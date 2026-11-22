/** Default geofence settings for QR attendance. */
export const venue = {
  name: "event check-in point",
  /** Fallback only — live sessions use the organizer's activation GPS. */
  lat: 10.9375,
  lng: 76.9594,
  /** QR check-in is only valid within this radius (metres) of the activation point. */
  radiusMeters: 100,
  /** Reject student GPS readings with worse accuracy than this (metres). */
  maxAccuracyMeters: 120,
  /** Organizer activation can use weaker Wi‑Fi location (laptops often report ~100–200 m). */
  maxActivationAccuracyMeters: 250,
}

export function distanceMeters(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const toRad = (degrees: number) => (degrees * Math.PI) / 180
  const earth = 6371000
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
  return 2 * earth * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export function isValidLatLng(lat: number, lng: number): boolean {
  return Number.isFinite(lat) && Number.isFinite(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180
}
