const storageKey = "gdg_skasc_device_id"

function createDeviceId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID().replaceAll("-", "")
  }
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("")
}

/** Stable per-browser id used to allow only one check-in per phone. */
export function getClientDeviceId(): string {
  try {
    const existing = window.localStorage.getItem(storageKey)?.trim() ?? ""
    if (/^[a-zA-Z0-9_-]{16,80}$/.test(existing)) return existing
    const next = createDeviceId()
    window.localStorage.setItem(storageKey, next)
    return next
  } catch {
    return createDeviceId()
  }
}
