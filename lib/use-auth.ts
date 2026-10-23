'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated'

export function useAuth(redirectTo = '/login'): AuthStatus {
  const router = useRouter()
  const [status, setStatus] = useState<AuthStatus>('loading')

  useEffect(() => {
    async function check() {
      try {
        const { createClientSupabase } = await import('./supabase')
        const supabase = createClientSupabase()
        if (supabase) {
          const { data: { user: session } } = await supabase.auth.getUser()
          if (session) { setStatus('authenticated'); return }
        }
      } catch {}

      setStatus('unauthenticated')
      router.replace(redirectTo)
    }
    check()
  }, [router, redirectTo])

  return status
}
