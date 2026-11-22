import { NextResponse } from "next/server"
import { ADMIN_COOKIE, issueAdminToken, passwordMatches } from "@/lib/attendance/auth"

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { password?: string } | null
  const password = body?.password?.trim() ?? ""
  if (!password || !passwordMatches(password)) {
    return NextResponse.json({ error: "Wrong password." }, { status: 401 })
  }

  const response = NextResponse.json({ ok: true })
  response.cookies.set(ADMIN_COOKIE, issueAdminToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 12 * 60 * 60,
  })
  return response
}
