import { NextResponse } from "next/server"
import { normalizeDeviceId, readDeviceIdFromRequest } from "@/lib/attendance/device"
import { findRecordForDevice, getSessionByToken } from "@/lib/attendance/store"
import { venue } from "@/lib/attendance/venue"

type Params = { params: Promise<{ token: string }> }

export async function GET(request: Request, { params }: Params) {
  const { token } = await params
  const session = await getSessionByToken(token)
  if (!session) {
    return NextResponse.json({ error: "This QR is not valid." }, { status: 404 })
  }

  const url = new URL(request.url)
  const deviceId =
    readDeviceIdFromRequest(request) || normalizeDeviceId(url.searchParams.get("deviceId"))
  const existing = deviceId ? await findRecordForDevice(session.id, deviceId) : null

  return NextResponse.json({
    active: session.active,
    eventTitle: session.eventTitle,
    radiusMeters: session.radiusMeters || venue.radiusMeters,
    venueName: "the QR check-in point",
    maxAccuracyMeters: venue.maxAccuracyMeters,
    alreadyCheckedIn: Boolean(existing),
    checkedInAt: existing?.checkedInAt ?? null,
  })
}
