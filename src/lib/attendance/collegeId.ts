/** Official SKASC student / staff mail domain used as College ID. */
export const collegeEmailDomain = "skasc.ac.in"

export function normalizeCollegeId(value: string): string {
  return value.trim().toLowerCase()
}

export function isCollegeId(value: string): boolean {
  const email = normalizeCollegeId(value)
  if (!email.includes("@")) return false
  const [local, domain] = email.split("@")
  if (!local || !domain) return false
  if (!/^[a-z0-9._%+-]+$/i.test(local)) return false
  return domain === collegeEmailDomain
}

export function collegeIdError(value: string): string | null {
  const email = normalizeCollegeId(value)
  if (!email) return "College ID is required."
  if (!isCollegeId(email)) {
    return `Use your official college ID email ending with @${collegeEmailDomain}.`
  }
  return null
}
