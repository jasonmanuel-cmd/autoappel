import crypto from 'crypto'

// In-memory store for CSRF tokens (in production, use Redis or session storage)
const csrfTokenStore = new Map<string, { token: string; createdAt: number }>()

const CSRF_TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000 // 24 hours
const TOKEN_LENGTH = 32

export function generateCSRFToken(): string {
  return crypto.randomBytes(TOKEN_LENGTH).toString('hex')
}

export function storeCSRFToken(sessionId: string, token: string): void {
  csrfTokenStore.set(sessionId, {
    token,
    createdAt: Date.now(),
  })
}

export function validateCSRFToken(sessionId: string, token: string): boolean {
  const entry = csrfTokenStore.get(sessionId)

  if (!entry) {
    return false
  }

  // Check expiry
  if (Date.now() - entry.createdAt > CSRF_TOKEN_EXPIRY_MS) {
    csrfTokenStore.delete(sessionId)
    return false
  }

  // Compare tokens (timing-safe comparison)
  return crypto.timingSafeEqual(
    Buffer.from(entry.token),
    Buffer.from(token)
  )
}

export function invalidateCSRFToken(sessionId: string): void {
  csrfTokenStore.delete(sessionId)
}

// Cleanup old tokens periodically
setInterval(() => {
  const now = Date.now()
  const entriesToDelete: string[] = []
  csrfTokenStore.forEach((value, key) => {
    if (now - value.createdAt > CSRF_TOKEN_EXPIRY_MS) {
      entriesToDelete.push(key)
    }
  })
  entriesToDelete.forEach(key => csrfTokenStore.delete(key))
}, 60 * 60 * 1000) // Cleanup every hour
