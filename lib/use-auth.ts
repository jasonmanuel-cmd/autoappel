'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { store } from './store'

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated'

export function useAuth(redirectTo = '/login'): AuthStatus {
  const router = useRouter()
  const [status, setStatus] = useState<AuthStatus>('loading')

  useEffect(() => {
    async function check() {
      // Check for admin auth state
      if (typeof window !== 'undefined') {
        try {
          const adminAuth = localStorage.getItem('aa_admin_auth')
          if (adminAuth) { setStatus('authenticated'); return }
        } catch {}
      }

      const demo = store.getDemoMode()
      if (demo) { setStatus('authenticated'); return }

      try {
        const { createClientSupabase } = await import('./supabase')
        const supabase = createClientSupabase()
        if (supabase) {
          const { data: { session } } = await supabase.auth.getSession()
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
