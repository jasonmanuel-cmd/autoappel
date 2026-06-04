'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClientSupabase } from '@/lib/supabase'

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [validToken, setValidToken] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    // Verify that we have a valid reset token from the URL
    const token = searchParams.get('token')
    const type = searchParams.get('type')

    if (token && type === 'recovery') {
      setValidToken(true)
    } else {
      setError('Invalid or missing reset link. Please request a new one.')
    }
    setChecking(false)
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
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

    const supabase = createClientSupabase()
    if (!supabase) {
      setError('Service unavailable. Please try again later.')
      setLoading(false)
      return
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: password,
    })

    setLoading(false)

    if (updateError) {
      setError(updateError.message || 'Failed to reset password')
    } else {
      setSuccess(true)
      setTimeout(() => {
        router.push('/login')
      }, 3000)
    }
  }

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--gradient-bg)' }}>
        <div className="max-w-md w-full">
          <div className="card text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
            <p className="text-muted mt-4">Verifying reset link...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!validToken) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--gradient-bg)' }}>
        <div className="max-w-md w-full">
          <div className="card">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-black mb-2">Invalid Link</h1>
              <p className="text-muted text-sm">
                {error || 'This password reset link is invalid or has expired.'}
              </p>
            </div>

            <div className="space-y-3">
              <Link href="/forgot-password" className="btn-primary w-full text-center">
                Request a New Reset Link
              </Link>
              <Link href="/login" className="btn-secondary w-full text-center">
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--gradient-bg)' }}>
        <div className="max-w-md w-full">
          <div className="card text-center">
            <div className="text-4xl mb-4">✓</div>
            <h1 className="text-2xl font-black mb-2">Password Updated!</h1>
            <p className="text-muted mb-4">
              Your password has been successfully reset. Redirecting to login...
            </p>
            <Link href="/login" className="btn-primary w-full">
              Go to Login
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
            <h1 className="text-3xl font-black mb-2">Create New Password</h1>
            <p className="text-muted text-sm">
              Enter a strong password to secure your account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">New Password</label>
              <input
                type="password"
                className="input"
                value={password}
                onChange={e => { setPassword(e.target.value); setError('') }}
                placeholder="At least 8 characters with uppercase and number"
                autoFocus
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
              {loading ? 'Updating...' : 'Update Password'}
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
