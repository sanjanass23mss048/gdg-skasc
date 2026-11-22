import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/attendance/auth"
import { getSessionById, setSessionActive } from "@/lib/attendance/store"
import { isValidLatLng, venue } from "@/lib/attendance/venue"

type Params = { params: Promise<{ id: string }> }

export async function PATCH(request: Request, { params }: Params) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 })
  }

  const { id } = await params
  const existing = await getSessionById(id)
  if (!existing) {
    return NextResponse.json({ error: "Session not found." }, { status: 404 })
  }

  const body = (await request.json().catch(() => null)) as
    | { active?: boolean; venueLat?: number; venueLng?: number; accuracy?: number }
    | null
  if (typeof body?.active !== "boolean") {
    return NextResponse.json({ error: "Send { active: true|false }." }, { status: 400 })
  }

  let location: { venueLat: number; venueLng: number } | undefined
  if (body.active) {
    const venueLat = Number(body.venueLat)
    const venueLng = Number(body.venueLng)
    const accuracy = Number(body.accuracy)
    if (!isValidLatLng(venueLat, venueLng)) {
      return NextResponse.json(
        {
          error:
            "Location permission is required. Allow location for this site, then Re-open from the event spot (phone is best).",
        },
        { status: 400 },
      )
    }
    if (Number.isFinite(accuracy) && accuracy > venue.maxActivationAccuracyMeters) {
      return NextResponse.json(
        {
          error: `Location accuracy is too weak (${Math.round(accuracy)} m). Use a phone at the hall, or wait for a clearer Wi‑Fi fix (need under ${venue.maxActivationAccuracyMeters} m).`,
        },
        { status: 400 },
      )
    }
    location = { venueLat, venueLng }
  }

  const session = await setSessionActive(id, body.active, location)
  return NextResponse.json({ session })
}
