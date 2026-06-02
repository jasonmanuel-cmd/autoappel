'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { store } from '@/lib/store'

// Production mode: auth-only. Development: allow demo toggle.
const isProd = process.env.NODE_ENV === 'production'
const initialMode = isProd ? 'auth' : 'demo'

export default function LoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState<'demo' | 'auth'>(initialMode)
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [authPassword, setAuthPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showHint, setShowHint] = useState(false)

  useEffect(() => {
    if (store.getDemoMode()) router.push('/test-dashboard')
  }, [router])

  const handleDemoLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (store.checkDemoPassword(password)) {
      store.setDemoMode(true)
      store.addAuditLog({ actor: 'demo-user', action: 'DEMO_LOGIN', resource: 'system', details: 'Demo mode activated', severity: 'info' })
      router.push('/test-dashboard')
    } else {
      setError('Invalid password')
    }
  }

  const handleAuthLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const result = await store.loginWithSupabase(email, authPassword)
    setLoading(false)
    if (result.success) {
      store.setDemoMode(true)
      router.push('/control-panel')
    } else {
      setError(result.error || 'Login failed')
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (authPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (authPassword.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    setLoading(true)
    setError('')
    const result = await store.signUpWithSupabase(email, authPassword)
    setLoading(false)
    if (result.success) {
      setError('')
      setAuthMode('login')
      setEmail('')
      setAuthPassword('')
      setConfirmPassword('')
      setError('Account created! Please sign in.')
    } else {
      setError(result.error || 'Sign up failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--gradient-bg)' }}>
      <div className="max-w-md w-full">
        <div className="card">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-black mb-2">
              {mode === 'demo' ? 'Demo Access' : authMode === 'login' ? 'Admin Login' : 'Create Account'}
            </h1>
            <p className="text-muted text-sm">
              {mode === 'demo'
                ? 'Enter the test password to explore the system.'
                : authMode === 'login'
                ? 'Sign in with your credentials.'
                : 'Create a new account to get started.'}
            </p>
          </div>

          {mode === 'demo' ? (
            <form onSubmit={handleDemoLogin} className="space-y-4">
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
          ) : authMode === 'login' ? (
            <form onSubmit={handleAuthLogin} className="space-y-4">
              <div>
                <label className="label">Email</label>
                <input
                  type="email"
                  className="input"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError('') }}
                  placeholder="you@example.com"
                  autoFocus
                />
              </div>
              <div>
                <label className="label">Password</label>
                <input
                  type="password"
                  className="input"
                  value={authPassword}
                  onChange={e => { setAuthPassword(e.target.value); setError('') }}
                  placeholder="Enter your password"
                />
                {error && <p className="text-danger text-xs mt-1">{error}</p>}
              </div>

              <button type="submit" className="btn-primary w-full" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </button>

              <div className="text-center pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => { setAuthMode('signup'); setError(''); setEmail(''); setAuthPassword(''); setConfirmPassword('') }}
                  className="text-xs text-primary hover:underline cursor-pointer bg-transparent border-none"
                >
                  Don't have an account? Sign up
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <label className="label">Email</label>
                <input
                  type="email"
                  className="input"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError('') }}
                  placeholder="you@example.com"
                  autoFocus
                  required
                />
              </div>
              <div>
                <label className="label">Password</label>
                <input
                  type="password"
                  className="input"
                  value={authPassword}
                  onChange={e => { setAuthPassword(e.target.value); setError('') }}
                  placeholder="At least 6 characters"
                  required
                />
              </div>
              <div>
                <label className="label">Confirm Password</label>
                <input
                  type="password"
                  className="input"
                  value={confirmPassword}
                  onChange={e => { setConfirmPassword(e.target.value); setError('') }}
                  placeholder="Confirm your password"
                  required
                />
                {error && <p className="text-danger text-xs mt-1">{error}</p>}
              </div>

              <button type="submit" className="btn-primary w-full" disabled={loading}>
                {loading ? 'Creating account...' : 'Create Account'}
              </button>

              <div className="text-center pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => { setAuthMode('login'); setError(''); setEmail(''); setAuthPassword(''); setConfirmPassword('') }}
                  className="text-xs text-primary hover:underline cursor-pointer bg-transparent border-none"
                >
                  Already have an account? Sign in
                </button>
              </div>
            </form>
          )}

          {!isProd && (
            <div className="mt-6 pt-4 border-t border-border">
              <button
                onClick={() => { setMode(m => m === 'demo' ? 'auth' : 'demo'); setError(''); setAuthMode('login'); setEmail(''); setAuthPassword(''); setConfirmPassword('') }}
                className="text-xs text-primary hover:underline cursor-pointer bg-transparent border-none"
              >
                {mode === 'demo' ? 'Use email & password login instead' : 'Use demo password instead'}
              </button>

              {mode === 'demo' && (
                <details className="text-xs text-muted cursor-pointer mt-2">
                  <summary className="font-semibold hover:text-muted-fg">Need the demo password?</summary>
                  <p className="mt-2 p-2 bg-bg-elevated rounded font-mono text-primary text-sm">demo-2026</p>
                </details>
              )}

              <p className="text-xs text-subtle mt-3">
                Demo mode seeds sample data. Auth mode connects to the production database.
              </p>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-subtle mt-6">
          <Link href="/" className="text-primary hover:underline">Return to site</Link>
        </p>
      </div>
    </div>
  )
}
