'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { createClientSupabase } from '@/lib/supabase'

export default function AppealPage() {
  const router = useRouter()
  const params = useParams()
  const citationId = params.id as string

  const [reason, setReason] = useState('')
  const [details, setDetails] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!reason.trim() || !details.trim()) {
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
        body: JSON.stringify({ citationId, type: 'appeal', reason, details: details }),
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
            <h1 className="text-2xl font-black mb-2">Appeal Submitted!</h1>
            <p className="text-muted mb-4">
              Your appeal has been submitted successfully. You'll be notified of the outcome within 5-7 business days.
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
          <h1 className="text-3xl font-black mb-2">Submit an Appeal</h1>
          <p className="text-muted mb-6">
            Explain why you believe this citation should be dismissed or modified.
          </p>

          <p className="text-muted mb-4">This is an internal support request, not a filing with your court. You remain responsible for court deadlines and submissions.</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label" htmlFor="field-1">Reason for Appeal *</label>
              <select id="field-1"
                value={reason}
                onChange={e => { setReason(e.target.value); setError('') }}
                className="input"
                required
              >
                <option value="">Select a reason...</option>
                <option value="procedural_error">Procedural Error</option>
                <option value="factual_error">Factual Error</option>
                <option value="equipment_malfunction">Equipment Malfunction</option>
                <option value="officer_error">Officer Error</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="label" htmlFor="field-2">Details of Your Appeal *</label>
              <textarea id="field-2"
                value={details}
                onChange={e => { setDetails(e.target.value); setError('') }}
                placeholder="Provide detailed explanation of your appeal..."
                className="input min-h-32"
                required
              />
              <p className="text-xs text-muted mt-1">{details.length}/2000 characters</p>
            </div>

            {error && <p className="text-danger text-xs p-2 bg-danger/10 rounded">{error}</p>}

            <div className="flex gap-3 pt-4">
              <button type="submit" className="btn-primary flex-1" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Appeal'}
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
