export const deviceCookieName = "gdg_skasc_device"

const deviceIdPattern = /^[a-zA-Z0-9_-]{16,80}$/

export function isValidDeviceId(value: string): boolean {
  return deviceIdPattern.test(value)
}

export function normalizeDeviceId(value: string | null | undefined): string {
  const trimmed = value?.trim() ?? ""
  return isValidDeviceId(trimmed) ? trimmed : ""
}

export function readDeviceIdFromRequest(request: Request): string {
  const cookieHeader = request.headers.get("cookie") ?? ""
  const match = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${deviceCookieName}=`))
  if (!match) return ""
  return normalizeDeviceId(decodeURIComponent(match.slice(deviceCookieName.length + 1)))
}

export function deviceCookieHeader(deviceId: string): string {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : ""
  return `${deviceCookieName}=${encodeURIComponent(deviceId)}; Path=/; Max-Age=31536000; SameSite=Lax; HttpOnly${secure}`
}
