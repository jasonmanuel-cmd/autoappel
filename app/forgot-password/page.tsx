'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClientSupabase } from '@/lib/supabase'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      setError('Please enter your email address')
      return
    }

    setLoading(true)
    setError('')

    const supabase = createClientSupabase()
    if (!supabase) {
      setError('Service unavailable. Please try again later.')
      setLoading(false)
      return
    }

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    setLoading(false)

    if (resetError) {
      setError(resetError.message || 'Failed to send reset email')
    } else {
      setSubmitted(true)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--gradient-bg)' }}>
        <div className="max-w-md w-full">
          <div className="card text-center">
            <div className="text-4xl mb-4">✉️</div>
            <h1 className="text-2xl font-black mb-2">Check Your Email</h1>
            <p className="text-muted mb-4">
              We've sent a password reset link to <strong>{email}</strong>
            </p>
            <div className="p-3 bg-info/10 border border-info/20 rounded mb-6">
              <p className="text-xs text-info-fg">
                The link will expire in 24 hours. Check your spam folder if you don't see it.
              </p>
            </div>
            <Link href="/login" className="btn-primary w-full">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--gradient-bg)' }}>
      <div className="max-w-md w-full">
        <div className="card">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-black mb-2">Reset Password</h1>
            <p className="text-muted text-sm">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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

            {error && <p className="text-danger text-xs p-2 bg-danger/10 rounded">{error}</p>}

            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          <div className="text-center pt-4 border-t border-border mt-4">
            <Link href="/login" className="text-sm text-primary hover:underline">
              Back to Sign In
            </Link>
          </div>
        </div>

        <p className="text-center text-xs text-subtle mt-6">
          <Link href="/" className="text-primary hover:underline">Return to site</Link>
        </p>
      </div>
    </div>
  )
}
