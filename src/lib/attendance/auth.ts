import { createHmac, timingSafeEqual } from "crypto"
import { cookies } from "next/headers"

export const ADMIN_COOKIE = "gdg_attendance_admin"

function adminSecret(): string {
  return process.env.ATTENDANCE_ADMIN_SECRET || "gdg-skasc-dev-secret"
}

function sign(value: string): string {
  return createHmac("sha256", adminSecret()).update(value).digest("base64url")
}

export function issueAdminToken(): string {
  const issuedAt = Date.now().toString()
  return `${issuedAt}.${sign(issuedAt)}`
}

export function verifyAdminToken(token: string | undefined | null): boolean {
  if (!token) return false
  const [issuedAt, signature] = token.split(".")
  if (!issuedAt || !signature) return false
  const expected = sign(issuedAt)
  try {
    const left = Buffer.from(signature)
    const right = Buffer.from(expected)
    if (left.length !== right.length) return false
    if (!timingSafeEqual(left, right)) return false
  } catch {
    return false
  }
  const ageMs = Date.now() - Number(issuedAt)
  if (!Number.isFinite(ageMs) || ageMs < 0) return false
  // 12-hour organizer window for a live event day
  return ageMs < 12 * 60 * 60 * 1000
}

export function passwordMatches(password: string): boolean {
  const expected = Buffer.from(adminSecret())
  const given = Buffer.from(password)
  if (expected.length !== given.length) return false
  return timingSafeEqual(expected, given)
}

export async function requireAdmin(): Promise<boolean> {
  const jar = await cookies()
  return verifyAdminToken(jar.get(ADMIN_COOKIE)?.value)
}
