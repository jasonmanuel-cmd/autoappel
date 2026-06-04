'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClientSupabase } from '@/lib/supabase'

export default function VerifyEmailPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [verified, setVerified] = useState(false)
  const [error, setError] = useState('')
  const [email, setEmail] = useState('')

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClientSupabase()
      if (!supabase) {
        setError('Authentication service not available')
        setLoading(false)
        return
      }

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      setEmail(user.email || '')

      if (user.email_confirmed_at) {
        setVerified(true)
        setTimeout(() => router.push('/dashboard'), 2000)
      } else {
        setVerified(false)
      }
      setLoading(false)
    }

    checkAuth()
  }, [router])

  const handleResendEmail = async () => {
    setLoading(true)
    setError('')
    const supabase = createClientSupabase()
    if (!supabase) {
      setError('Service unavailable')
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
    })

    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      setError('Verification email sent! Check your inbox.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--gradient-bg)' }}>
        <div className="max-w-md w-full">
          <div className="card text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
            <p className="text-muted mt-4">Checking verification status...</p>
          </div>
        </div>
      </div>
    )
  }

  if (verified) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--gradient-bg)' }}>
        <div className="max-w-md w-full">
          <div className="card text-center">
            <div className="text-4xl mb-4">✓</div>
            <h1 className="text-2xl font-black mb-2">Email Verified!</h1>
            <p className="text-muted">Redirecting to your dashboard...</p>
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
            <h1 className="text-3xl font-black mb-2">Verify Your Email</h1>
            <p className="text-muted text-sm">
              We've sent a verification link to <strong>{email}</strong>
            </p>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-muted-fg">
              Click the link in your email to verify your account and access your dashboard.
            </p>

            <div className="p-3 bg-warning/10 border border-warning/20 rounded">
              <p className="text-xs text-warning-fg">
                💡 Check your spam folder if you don't see the email.
              </p>
            </div>

            {error && (
              <p className={`text-xs p-2 rounded ${error.includes('sent') ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
                {error}
              </p>
            )}

            <button
              onClick={handleResendEmail}
              disabled={loading}
              className="btn-secondary w-full"
            >
              {loading ? 'Sending...' : 'Resend Verification Email'}
            </button>
          </div>

          <div className="text-center pt-4 border-t border-border mt-4">
            <button
              onClick={() => {
                const supabase = createClientSupabase()
                if (supabase) supabase.auth.signOut()
                router.push('/login')
              }}
              className="text-xs text-muted hover:text-muted-fg bg-transparent border-none cursor-pointer"
            >
              Sign in with a different account
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-subtle mt-6">
          <Link href="/" className="text-primary hover:underline">Return to site</Link>
        </p>
      </div>
    </div>
  )
}
