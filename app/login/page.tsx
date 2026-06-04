'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { store } from '@/lib/store'

export default function CustomerLoginPage() {
  const router = useRouter()
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const result = await store.loginWithSupabase(email, password)
    setLoading(false)
    if (result.success) {
      router.push('/verify-email')
    } else {
      setError(result.error || 'Login failed')
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    if (!/[A-Z]/.test(password)) {
      setError('Password must include an uppercase letter')
      return
    }
    if (!/[0-9]/.test(password)) {
      setError('Password must include a number')
      return
    }
    setLoading(true)
    setError('')
    const result = await store.signUpWithSupabase(email, password)
    setLoading(false)
    if (result.success) {
      setSuccess('Account created! Please check your email to verify, then sign in.')
      setAuthMode('login')
      setEmail('')
      setPassword('')
      setConfirmPassword('')
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
              {authMode === 'login' ? 'Sign In' : 'Create Account'}
            </h1>
            <p className="text-muted text-sm">
              {authMode === 'login'
                ? 'Access your citations and manage your account.'
                : 'Create an account to get started.'}
            </p>
          </div>

          {success && <p className="text-success text-sm mb-4 p-3 bg-success/10 rounded">{success}</p>}

          {authMode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="label">Email Address</label>
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

              <div className="text-center pt-4 border-t border-border space-y-3">
                <button
                  type="button"
                  onClick={() => { setAuthMode('signup'); setError(''); setSuccess(''); setEmail(''); setPassword(''); setConfirmPassword('') }}
                  className="text-sm text-primary hover:underline cursor-pointer bg-transparent border-none w-full"
                >
                  Don't have an account? Sign up
                </button>
                <Link href="/forgot-password" className="text-xs text-muted hover:text-muted-fg block">
                  Forgot your password?
                </Link>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <label className="label">Email Address</label>
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
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError('') }}
                  placeholder="At least 8 characters with uppercase and number"
                  required
                />
                <p className="text-xs text-muted mt-1">
                  Must include uppercase letter and number
                </p>
              </div>
              <div>
                <label className="label">Confirm Password</label>
                <input
                  type="password"
                  className="input"
                  value={confirmPassword}
                  onChange={e => { setConfirmPassword(e.target.value); setError('') }}
                  placeholder="Re-enter your password"
                  required
                />
              </div>

              {error && <p className="text-danger text-xs p-2 bg-danger/10 rounded">{error}</p>}

              <button type="submit" className="btn-primary w-full" disabled={loading}>
                {loading ? 'Creating account...' : 'Create Account'}
              </button>

              <div className="text-center pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => { setAuthMode('login'); setError(''); setSuccess(''); setEmail(''); setPassword(''); setConfirmPassword('') }}
                  className="text-sm text-primary hover:underline cursor-pointer bg-transparent border-none w-full"
                >
                  Already have an account? Sign in
                </button>
              </div>
            </form>
          )}
        </div>

        <p className="text-center text-xs text-subtle mt-6">
          <Link href="/" className="text-primary hover:underline">Return to site</Link>
        </p>

        {/* Hidden admin link */}
        <div className="text-center mt-4 opacity-0 hover:opacity-100 transition-opacity">
          <Link href="/admin/login" className="text-xs text-subtle hover:text-muted">
            admin
          </Link>
        </div>
      </div>
    </div>
  )
}
