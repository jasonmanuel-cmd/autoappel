'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { store } from '@/lib/store'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const result = await store.loginWithSupabase(email, password)
    setLoading(false)
    if (result.success) {
      router.push('/admin/dashboard')
    } else {
      setError(result.error || 'Login failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--gradient-bg)' }}>
      <div className="max-w-md w-full">
        <div className="card">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-black mb-2">Admin Access</h1>
            <p className="text-muted text-sm">
              Restricted to authorized administrators only.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="label">Admin Email</label>
              <input
                type="email"
                className="input"
                value={email}
                onChange={e => { setEmail(e.target.value); setError('') }}
                placeholder="admin@example.com"
                autoFocus
                required
              />
            </div>
            <div>
              <label className="label">Password</label>
              <input
                type="password"
                className="input"
                value={password}
                onChange={e => { setPassword(e.target.value); setError('') }}
                placeholder="Enter your password"
                required
              />
            </div>

            {error && <p className="text-danger text-xs p-2 bg-danger/10 rounded">{error}</p>}

            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            <div className="text-center pt-4 border-t border-border">
              <Link href="/forgot-password" className="text-xs text-muted hover:text-muted-fg">
                Forgot your password?
              </Link>
            </div>
          </form>
        </div>

        <p className="text-center text-xs text-subtle mt-6">
          <Link href="/login" className="text-primary hover:underline">Back to customer login</Link>
        </p>
      </div>
    </div>
  )
}
