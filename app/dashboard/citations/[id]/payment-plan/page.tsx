'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { createClientSupabase } from '@/lib/supabase'

export default function PaymentPlanPage() {
  const router = useRouter()
  const params = useParams()
  const citationId = params.id as string

  const [installments, setInstallments] = useState('3')
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!installments || !reason.trim()) {
      setError('Please fill in all required fields')
      return
    }

    setLoading(true)
    setError('')

    const supabase = createClientSupabase()
    if (!supabase) {
      setError('Service unavailable')
      setLoading(false)
      return
    }

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user?.email) {
        setError('Not authenticated')
        setLoading(false)
        return
      }

      const response = await fetch('/api/submissions', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ citationId, type: 'payment_plan', reason, details: `Requested ${installments} installments. Reason: ${reason}` }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Request could not be saved')

      setSuccess(true)
      setTimeout(() => {
        router.push(`/dashboard/citations/${citationId}`)
      }, 2000)
    } catch (err) {
      console.error('Error:', err)
      setError(err instanceof Error ? err.message : 'Request failed')
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen" style={{ background: 'var(--gradient-bg)' }}>
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="card text-center">
            <div className="text-4xl mb-4">✓</div>
            <h1 className="text-2xl font-black mb-2">Payment Plan Requested!</h1>
            <p className="text-muted mb-4">
              Your payment plan request has been submitted. An admin will review and contact you within 2 business days.
            </p>
            <p className="text-xs text-muted">Redirecting...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--gradient-bg)' }}>
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Link href={`/dashboard/citations/${citationId}`} className="text-primary hover:underline mb-6 inline-block">
          ← Back to Citation
        </Link>

        <div className="card">
          <h1 className="text-3xl font-black mb-2">Request a Payment Plan</h1>
          <p className="text-muted mb-6">
            Spread your payment across multiple installments. An admin will review your request and contact you.
          </p>

          <p className="text-muted mb-4">This is an internal support request, not a filing with your court. You remain responsible for court deadlines and submissions.</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label" htmlFor="field-1">Number of Installments *</label>
              <select id="field-1"
                value={installments}
                onChange={e => { setInstallments(e.target.value); setError('') }}
                className="input"
                required
              >
                <option value="">Select...</option>
                <option value="2">2 Installments</option>
                <option value="3">3 Installments</option>
                <option value="4">4 Installments</option>
                <option value="6">6 Installments</option>
              </select>
            </div>

            <div>
              <label className="label" htmlFor="field-2">Reason for Payment Plan Request *</label>
              <textarea id="field-2"
                value={reason}
                onChange={e => { setReason(e.target.value); setError('') }}
                placeholder="Tell us why you need a payment plan..."
                className="input min-h-24"
                required
              />
              <p className="text-xs text-muted mt-1">{reason.length}/500 characters</p>
            </div>

            {error && <p className="text-danger text-xs p-2 bg-danger/10 rounded">{error}</p>}

            <div className="flex gap-3 pt-4">
              <button type="submit" className="btn-primary flex-1" disabled={loading}>
                {loading ? 'Submitting...' : 'Request Payment Plan'}
              </button>
              <Link href={`/dashboard/citations/${citationId}`} className="btn-secondary flex-1 text-center">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
