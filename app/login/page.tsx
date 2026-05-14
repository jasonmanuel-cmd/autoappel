'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { store } from '@/lib/store'

export default function LoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showHint, setShowHint] = useState(false)

  useEffect(() => {
    if (store.getDemoMode()) router.push('/test-dashboard')
  }, [router])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (store.checkDemoPassword(password)) {
      store.setDemoMode(true)
      store.addAuditLog({ actor: 'demo-user', action: 'DEMO_LOGIN', resource: 'system', details: 'Demo mode activated', severity: 'info' })
      router.push('/test-dashboard')
    } else {
      setError('Invalid password')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--gradient-bg)' }}>
      <div className="max-w-md w-full">
        <div className="card">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-black mb-2">Demo Access</h1>
            <p className="text-muted text-sm">Enter the test password to explore the full system with pre-seeded data.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="label">Master Password</label>
              <div className="relative">
                <input
                  type={showHint ? 'text' : 'password'}
                  className="input pr-20"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError('') }}
                  placeholder="Enter demo password"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowHint(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted hover:text-muted-fg"
                >
                  {showHint ? 'Hide' : 'Show'}
                </button>
              </div>
              {error && <p className="text-danger text-xs mt-1">{error}</p>}
            </div>

            <button type="submit" className="btn-primary w-full">
              Enter Demo Mode
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-border">
            <details className="text-xs text-muted cursor-pointer">
              <summary className="font-semibold hover:text-muted-fg">Need the password?</summary>
              <p className="mt-2 p-2 bg-bg-elevated rounded font-mono text-primary text-sm">demo-2026</p>
            </details>
            <p className="text-xs text-subtle mt-3">
              Demo mode seeds sample data and enables test controls. No real data is used.
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-subtle mt-6">
          <Link href="/" className="text-primary hover:underline">Return to site</Link>
        </p>
      </div>
    </div>
  )
}
