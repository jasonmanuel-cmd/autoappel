'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { createClientSupabase } from '@/lib/supabase'

export default function DismissalPage() {
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

      // Insert submission
      const { error: insertError } = await supabase.from('submissions').insert({
        citation_id: citationId,
        customer_email: user.email,
        submission_type: 'dismissal',
        reason,
        details,
        status: 'pending',
        created_at: new Date().toISOString(),
      })

      if (insertError) {
        setError(insertError.message)
        setLoading(false)
        return
      }

      // Update citation status
      await supabase
        .from('citations')
        .update({ status: 'in_review', updated_at: new Date().toISOString() })
        .eq('id', citationId)

      // Send confirmation email notification
      try {
        await fetch('/api/notifications/email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'submission_received',
            email: user.email,
            firstName: user.email.split('@')[0], // Fallback
            citationNumber: citationId,
            submissionType: 'dismissal request',
          }),
        })
      } catch (err) {
        console.error('Error sending notification:', err)
      }

      setSuccess(true)
      setTimeout(() => {
        router.push(`/dashboard/citations/${citationId}`)
      }, 2000)
    } catch (err) {
      console.error('Error:', err)
      setError('An error occurred while submitting your dismissal request')
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen" style={{ background: 'var(--gradient-bg)' }}>
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="card text-center">
            <div className="text-4xl mb-4">✓</div>
            <h1 className="text-2xl font-black mb-2">Dismissal Request Submitted!</h1>
            <p className="text-muted mb-4">
              Your dismissal request has been submitted for review. You'll be notified of the outcome within 5-7 business days.
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
          <h1 className="text-3xl font-black mb-2">Request Dismissal</h1>
          <p className="text-muted mb-6">
            Request that this citation be dismissed. Provide a detailed explanation of why the citation should be dismissed.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Reason for Dismissal *</label>
              <select
                value={reason}
                onChange={e => { setReason(e.target.value); setError('') }}
                className="input"
                required
              >
                <option value="">Select a reason...</option>
                <option value="improper_notice">Improper Notice</option>
                <option value="expired_statute">Expired Statute of Limitations</option>
                <option value="insufficient_evidence">Insufficient Evidence</option>
                <option value="due_process_violation">Due Process Violation</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="label">Detailed Explanation *</label>
              <textarea
                value={details}
                onChange={e => { setDetails(e.target.value); setError('') }}
                placeholder="Provide detailed explanation of why this citation should be dismissed..."
                className="input min-h-32"
                required
              />
              <p className="text-xs text-muted mt-1">{details.length}/2000 characters</p>
            </div>

            {error && <p className="text-danger text-xs p-2 bg-danger/10 rounded">{error}</p>}

            <div className="flex gap-3 pt-4">
              <button type="submit" className="btn-primary flex-1" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Dismissal Request'}
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
