import { NextResponse } from "next/server"
import { collegeIdError, normalizeCollegeId } from "@/lib/attendance/collegeId"
import {
  deviceCookieHeader,
  isValidDeviceId,
  normalizeDeviceId,
  readDeviceIdFromRequest,
} from "@/lib/attendance/device"
import { addRecord, getSessionByToken } from "@/lib/attendance/store"
import { distanceMeters, venue } from "@/lib/attendance/venue"

type Body = {
  token?: string
  name?: string
  studentClass?: string
  department?: string
  section?: string
  registerNumber?: string
  collegeId?: string
  email?: string
  deviceId?: string
  lat?: number
  lng?: number
  accuracy?: number
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Body | null
  if (!body) {
    return NextResponse.json({ error: "Bad request." }, { status: 400 })
  }

  const token = body.token?.trim() ?? ""
  const name = body.name?.trim() ?? ""
  const studentClass = body.studentClass?.trim() ?? ""
  const department = body.department?.trim() ?? ""
  const section = body.section?.trim() ?? ""
  const registerNumber = body.registerNumber?.trim() ?? ""
  const collegeId = normalizeCollegeId(body.collegeId ?? body.email ?? "")
  const cookieDevice = readDeviceIdFromRequest(request)
  const bodyDevice = normalizeDeviceId(body.deviceId)
  const deviceId = cookieDevice || bodyDevice
  const lat = Number(body.lat)
  const lng = Number(body.lng)
  const accuracy = Number(body.accuracy)

  if (!token || !name || !studentClass || !registerNumber || !department) {
    return NextResponse.json(
      { error: "Name, class, department, and roll number are required." },
      { status: 400 },
    )
  }

  const idError = collegeIdError(collegeId)
  if (idError) {
    return NextResponse.json({ error: idError }, { status: 403 })
  }

  if (!deviceId || !isValidDeviceId(deviceId)) {
    return NextResponse.json(
      { error: "This phone could not be verified. Refresh and try again." },
      { status: 400 },
    )
  }

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return NextResponse.json({ error: "Location is required for check-in." }, { status: 400 })
  }

  const session = await getSessionByToken(token)
  if (!session) {
    return NextResponse.json({ error: "This QR is not valid." }, { status: 404 })
  }
  if (!session.active) {
    return NextResponse.json(
      { error: "Attendance is closed for this event right now." },
      { status: 403 },
    )
  }

  if (Number.isFinite(accuracy) && accuracy > venue.maxAccuracyMeters) {
    return NextResponse.json(
      {
        error: `GPS accuracy is too weak (${Math.round(accuracy)} m). Step outside or wait for a clearer signal, then try again.`,
      },
      { status: 400 },
    )
  }

  const allowedRadius = session.radiusMeters || venue.radiusMeters
  const distance = distanceMeters(lat, lng, session.venueLat, session.venueLng)
  if (distance > allowedRadius) {
    return NextResponse.json(
      {
        error: `You look about ${Math.round(distance)} m from the check-in point. Move within ${allowedRadius} m of where the QR was activated, then try again.`,
        distanceMeters: Math.round(distance),
      },
      { status: 403 },
    )
  }

  const result = await addRecord({
    sessionId: session.id,
    name,
    studentClass,
    department,
    section,
    registerNumber,
    email: collegeId,
    deviceId,
    lat,
    lng,
    accuracy: Number.isFinite(accuracy) ? accuracy : -1,
    distanceMeters: Math.round(distance),
  })

  if (!result.ok) {
    const messages = {
      duplicate_roll: "This roll number is already marked present for this session.",
      duplicate_device: "This phone has already registered attendance for this event.",
      duplicate_college: "This college ID is already marked present for this session.",
    } as const
    return NextResponse.json({ error: messages[result.reason] }, { status: 409 })
  }

  const response = NextResponse.json({
    ok: true,
    eventTitle: session.eventTitle,
    checkedInAt: result.record.checkedInAt,
    distanceMeters: result.record.distanceMeters,
  })
  response.headers.set("Set-Cookie", deviceCookieHeader(deviceId))
  return response
}
