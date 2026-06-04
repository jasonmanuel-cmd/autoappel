// In-memory store for rate limiting (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000
const RATE_LIMIT_MAX_REQUESTS = 100

function cleanupExpired(): void {
  const now = Date.now()
  rateLimitStore.forEach((value, key) => {
    if (now > value.resetTime) {
      rateLimitStore.delete(key)
    }
  })
}

export function rateLimit(identifier: string): { allowed: boolean; remaining: number } {
  cleanupExpired()
  const now = Date.now()
  const entry = rateLimitStore.get(identifier)

  if (!entry || now > entry.resetTime) {
    rateLimitStore.set(identifier, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS })
    return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - 1 }
  }

  if (entry.count >= RATE_LIMIT_MAX_REQUESTS) {
    return { allowed: false, remaining: 0 }
  }

  entry.count++
  return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - entry.count }
}
