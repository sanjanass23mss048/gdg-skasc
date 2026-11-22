export type AttendanceRecord = {
  id: string
  sessionId: string
  name: string
  studentClass: string
  department: string
  section: string
  registerNumber: string
  email: string
  deviceId: string
  checkedInAt: string
  lat: number
  lng: number
  accuracy: number
  distanceMeters: number
}

export type AttendanceSession = {
  id: string
  eventId: string
  eventTitle: string
  token: string
  active: boolean
  createdAt: string
  activatedAt: string | null
  deactivatedAt: string | null
  radiusMeters: number
  venueLat: number
  venueLng: number
}

export type AttendanceStore = {
  sessions: AttendanceSession[]
  records: AttendanceRecord[]
}
