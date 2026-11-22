import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/attendance/auth"
import { findAttendanceEvent } from "@/lib/attendance/catalog"
import { createSession, listRecords, listSessions } from "@/lib/attendance/store"
import { isValidLatLng, venue } from "@/lib/attendance/venue"

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 })
  }
  const sessions = await listSessions()
  const withCounts = await Promise.all(
    sessions.map(async (session) => ({
      ...session,
      count: (await listRecords(session.id)).length,
    })),
  )
  return NextResponse.json({
    sessions: withCounts,
    venue,
  })
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 })
  }

  const body = (await request.json().catch(() => null)) as
    | {
        eventId?: string
        customTitle?: string
        venueLat?: number
        venueLng?: number
        accuracy?: number
      }
    | null

  const eventId = body?.eventId?.trim()
  if (!eventId) {
    return NextResponse.json({ error: "Pick an event." }, { status: 400 })
  }

  const catalog = findAttendanceEvent(eventId)
  if (!catalog) {
    return NextResponse.json({ error: "Unknown event." }, { status: 400 })
  }

  const customTitle = body?.customTitle?.trim()
  if (eventId === "custom-session" && !customTitle) {
    return NextResponse.json({ error: "Add a title for the custom session." }, { status: 400 })
  }

  const venueLat = Number(body?.venueLat)
  const venueLng = Number(body?.venueLng)
  const accuracy = Number(body?.accuracy)
  if (!isValidLatLng(venueLat, venueLng)) {
    return NextResponse.json(
      {
        error:
          "Location permission is required. Allow location for this site in the browser, then Activate again from the event spot (phone is best).",
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

  const session = await createSession({
    eventId,
    eventTitle: eventId === "custom-session" ? customTitle! : catalog.title,
    radiusMeters: venue.radiusMeters,
    venueLat,
    venueLng,
  })

  return NextResponse.json({ session })
}
