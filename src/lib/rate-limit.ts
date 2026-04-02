const rateMap = new Map<string, { count: number; resetAt: number }>()

const CLEANUP_INTERVAL = 60_000
let lastCleanup = Date.now()

function cleanup() {
  const now = Date.now()
  if (now - lastCleanup < CLEANUP_INTERVAL) return
  lastCleanup = now
  for (const [key, val] of rateMap) {
    if (val.resetAt < now) rateMap.delete(key)
  }
}

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): { success: boolean; remaining: number } {
  cleanup()
  const now = Date.now()
  const entry = rateMap.get(key)

  if (!entry || entry.resetAt < now) {
    rateMap.set(key, { count: 1, resetAt: now + windowMs })
    return { success: true, remaining: limit - 1 }
  }

  entry.count++
  if (entry.count > limit) {
    return { success: false, remaining: 0 }
  }

  return { success: true, remaining: limit - entry.count }
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  return request.headers.get('x-real-ip') || 'unknown'
}
