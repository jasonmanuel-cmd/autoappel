const stores = new Map<string, Map<string, { count: number; resetAt: number }>>()

export function rateLimit(opts: {
  windowMs: number
  max: number
  key?: string
}) {
  const storeKey = opts.key || 'default'
  if (!stores.has(storeKey)) stores.set(storeKey, new Map())

  return {
    check: (identifier: string) => {
      const store = stores.get(storeKey)!
      const now = Date.now()
      const record = store.get(identifier)

      if (!record || now > record.resetAt) {
        store.set(identifier, { count: 1, resetAt: now + opts.windowMs })
        return { allowed: true, remaining: opts.max - 1 }
      }

      if (record.count >= opts.max) {
        return { allowed: false, remaining: 0, resetAt: record.resetAt }
      }

      record.count++
      return { allowed: true, remaining: opts.max - record.count }
    },
    reset: (identifier: string) => {
      const store = stores.get(storeKey)!
      store.delete(identifier)
    },
  }
}

export const authLimiter = rateLimit({ windowMs: 60 * 1000, max: 10, key: 'auth' })
export const contactLimiter = rateLimit({ windowMs: 60 * 1000, max: 5, key: 'contact' })
export const apiLimiter = rateLimit({ windowMs: 60 * 1000, max: 30, key: 'api' })
