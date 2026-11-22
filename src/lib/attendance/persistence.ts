import { promises as fs } from "fs"
import path from "path"
import { Redis } from "@upstash/redis"
import type { AttendanceStore } from "./types"

const redisKey = "gdg-skasc:attendance"
const lockKey = "gdg-skasc:attendance:lock"
const dataDir = path.join(process.cwd(), "data")
const storePath = path.join(dataDir, "attendance.json")

const emptyStore = (): AttendanceStore => ({ sessions: [], records: [] })

function normalizeStore(value: unknown): AttendanceStore {
  if (!value || typeof value !== "object") return emptyStore()
  const parsed = value as AttendanceStore
  return {
    sessions: Array.isArray(parsed.sessions) ? parsed.sessions : [],
    records: Array.isArray(parsed.records) ? parsed.records : [],
  }
}

function redisCredentials(): { url: string; token: string } | null {
  const url =
    process.env.UPSTASH_REDIS_REST_URL?.trim() || process.env.KV_REST_API_URL?.trim() || ""
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN?.trim() || process.env.KV_REST_API_TOKEN?.trim() || ""
  if (!url || !token) return null
  return { url, token }
}

function getRedis(): Redis | null {
  const credentials = redisCredentials()
  if (!credentials) return null
  return new Redis(credentials)
}

export function usingRemoteStore(): boolean {
  return Boolean(redisCredentials())
}

async function ensureFileStore(): Promise<void> {
  await fs.mkdir(dataDir, { recursive: true })
  try {
    await fs.access(storePath)
  } catch {
    await fs.writeFile(storePath, JSON.stringify(emptyStore(), null, 2), "utf8")
  }
}

async function readFileStore(): Promise<AttendanceStore> {
  await ensureFileStore()
  const raw = await fs.readFile(storePath, "utf8")
  try {
    return normalizeStore(JSON.parse(raw) as AttendanceStore)
  } catch {
    return emptyStore()
  }
}

async function writeFileStore(store: AttendanceStore): Promise<void> {
  await ensureFileStore()
  await fs.writeFile(storePath, JSON.stringify(store, null, 2), "utf8")
}

async function withRedisLock<T>(redis: Redis, run: () => Promise<T>): Promise<T> {
  const token = `${Date.now()}-${Math.random().toString(36).slice(2)}`
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const locked = await redis.set(lockKey, token, { nx: true, ex: 5 })
    if (locked) {
      try {
        return await run()
      } finally {
        const current = await redis.get<string>(lockKey)
        if (current === token) await redis.del(lockKey)
      }
    }
    await new Promise((resolve) => setTimeout(resolve, 40 * (attempt + 1)))
  }
  throw new Error("Attendance store is busy. Try again in a moment.")
}

export async function readStore(): Promise<AttendanceStore> {
  const redis = getRedis()
  if (redis) {
    const value = await redis.get<AttendanceStore>(redisKey)
    return normalizeStore(value)
  }
  if (process.env.VERCEL) {
    throw new Error(
      "Attendance storage is not configured. Connect Upstash Redis (KV_REST_API_URL / KV_REST_API_TOKEN) in the Vercel project.",
    )
  }
  return readFileStore()
}

export async function writeStore(store: AttendanceStore): Promise<void> {
  const redis = getRedis()
  if (redis) {
    await redis.set(redisKey, store)
    return
  }
  if (process.env.VERCEL) {
    throw new Error(
      "Attendance storage is not configured. Connect Upstash Redis (KV_REST_API_URL / KV_REST_API_TOKEN) in the Vercel project.",
    )
  }
  await writeFileStore(store)
}

export async function updateStore<T>(
  mutator: (store: AttendanceStore) => T | Promise<T>,
): Promise<T> {
  const redis = getRedis()
  if (redis) {
    return withRedisLock(redis, async () => {
      const store = normalizeStore(await redis.get<AttendanceStore>(redisKey))
      const result = await mutator(store)
      await redis.set(redisKey, store)
      return result
    })
  }
  if (process.env.VERCEL) {
    throw new Error(
      "Attendance storage is not configured. Connect Upstash Redis (KV_REST_API_URL / KV_REST_API_TOKEN) in the Vercel project.",
    )
  }
  const store = await readFileStore()
  const result = await mutator(store)
  await writeFileStore(store)
  return result
}
