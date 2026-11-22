import { randomBytes } from "crypto"
import { normalizeCollegeId } from "./collegeId"
import { normalizeDepartment } from "./departments"
import { readStore, updateStore } from "./persistence"
import type { AttendanceRecord, AttendanceSession } from "./types"
import { venue } from "./venue"

export function createToken(): string {
  return randomBytes(18).toString("base64url")
}

export function createId(prefix: string): string {
  return `${prefix}_${randomBytes(8).toString("hex")}`
}

export async function listSessions(): Promise<AttendanceSession[]> {
  const store = await readStore()
  return [...store.sessions].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export async function getSessionByToken(token: string): Promise<AttendanceSession | null> {
  const store = await readStore()
  return store.sessions.find((session) => session.token === token) ?? null
}

export async function getSessionById(id: string): Promise<AttendanceSession | null> {
  const store = await readStore()
  return store.sessions.find((session) => session.id === id) ?? null
}

export async function createSession(input: {
  eventId: string
  eventTitle: string
  radiusMeters?: number
  venueLat: number
  venueLng: number
}): Promise<AttendanceSession> {
  return updateStore((store) => {
    const now = new Date().toISOString()
    const session: AttendanceSession = {
      id: createId("sess"),
      eventId: input.eventId,
      eventTitle: input.eventTitle,
      token: createToken(),
      active: true,
      createdAt: now,
      activatedAt: now,
      deactivatedAt: null,
      radiusMeters: input.radiusMeters ?? venue.radiusMeters,
      venueLat: input.venueLat,
      venueLng: input.venueLng,
    }
    store.sessions.forEach((item) => {
      if (item.active) {
        item.active = false
        item.deactivatedAt = now
      }
    })
    store.sessions.unshift(session)
    return session
  })
}

export async function setSessionActive(
  id: string,
  active: boolean,
  location?: { venueLat: number; venueLng: number },
): Promise<AttendanceSession | null> {
  return updateStore((store) => {
    const session = store.sessions.find((item) => item.id === id)
    if (!session) return null
    const now = new Date().toISOString()
    if (active) {
      store.sessions.forEach((item) => {
        if (item.id !== id && item.active) {
          item.active = false
          item.deactivatedAt = now
        }
      })
      session.active = true
      session.activatedAt = now
      session.deactivatedAt = null
      if (location) {
        session.venueLat = location.venueLat
        session.venueLng = location.venueLng
        session.radiusMeters = venue.radiusMeters
      }
    } else {
      session.active = false
      session.deactivatedAt = now
    }
    return session
  })
}

export async function listRecords(sessionId: string): Promise<AttendanceRecord[]> {
  const store = await readStore()
  return store.records
    .filter((record) => record.sessionId === sessionId)
    .sort((a, b) => a.checkedInAt.localeCompare(b.checkedInAt))
}

export async function findRecordForDevice(
  sessionId: string,
  deviceId: string,
): Promise<AttendanceRecord | null> {
  if (!deviceId) return null
  const store = await readStore()
  return (
    store.records.find(
      (item) => item.sessionId === sessionId && item.deviceId && item.deviceId === deviceId,
    ) ?? null
  )
}

export async function addRecord(
  record: Omit<AttendanceRecord, "id" | "checkedInAt">,
): Promise<
  | { ok: true; record: AttendanceRecord }
  | { ok: false; reason: "duplicate_roll" | "duplicate_device" | "duplicate_college" }
> {
  return updateStore((store) => {
    const registerKey = record.registerNumber.trim().toUpperCase()
    const collegeKey = normalizeCollegeId(record.email ?? "")
    const deviceKey = record.deviceId.trim()

    const sameRoll = store.records.find(
      (item) =>
        item.sessionId === record.sessionId &&
        item.registerNumber.trim().toUpperCase() === registerKey,
    )
    if (sameRoll) return { ok: false, reason: "duplicate_roll" as const }

    if (deviceKey) {
      const sameDevice = store.records.find(
        (item) => item.sessionId === record.sessionId && item.deviceId === deviceKey,
      )
      if (sameDevice) return { ok: false, reason: "duplicate_device" as const }
    }

    if (collegeKey) {
      const sameCollege = store.records.find(
        (item) =>
          item.sessionId === record.sessionId &&
          normalizeCollegeId(item.email ?? "") === collegeKey,
      )
      if (sameCollege) return { ok: false, reason: "duplicate_college" as const }
    }

    const saved: AttendanceRecord = {
      ...record,
      id: createId("att"),
      checkedInAt: new Date().toISOString(),
      studentClass: record.studentClass.trim(),
      section: record.section.trim(),
      registerNumber: registerKey,
      department: normalizeDepartment(record.department),
      email: collegeKey,
      deviceId: deviceKey,
    }
    store.records.push(saved)
    return { ok: true as const, record: saved }
  })
}
