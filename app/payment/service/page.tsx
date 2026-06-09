'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { store } from '@/lib/store'
import type { Citation } from '@/lib/types'

const SERVICE_FEE = 149
const SERVICE_PLAN = 'Citation Appeal Service'

function ServicePaymentContent() {
  const router = useRouter()
  const params = useSearchParams()
  const citationId = params.get('citation_id')
  const [citation, setCitation] = useState<Citation | null>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')
  const [found, setFound] = useState(false)

  useEffect(() => {
    if (citationId) {
      const c = store.getCitationById(citationId)
      if (c) {
        setCitation(c)
        setFound(true)
      }
    }
    setLoading(false)
  }, [citationId])

  const handlePay = async () => {
    setError('')
    setProcessing(true)
    try {
      const res = await fetch('/api/payment/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: SERVICE_PLAN, amount: SERVICE_FEE, citation_id: citationId }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setError(data.error || 'Failed to create checkout session')
        setProcessing(false)
      }
    } catch {
      setError('Network error. Please try again.')
      setProcessing(false)
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--gradient-bg)' }}>
      <div className="card text-center py-12">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-muted">Loading...</p>
      </div>
    </div>
  }

  if (!found || !citation) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--gradient-bg)' }}>
        <div className="card text-center max-w-md">
          <h1 className="text-2xl font-black mb-3">Citation Not Found</h1>
          <p className="text-muted mb-6">We couldn't find your citation. Please start a new appeal.</p>
          <Link href="/intake" className="btn-primary">Start New Appeal</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 px-4" style={{ background: 'var(--gradient-bg)' }}>
      <div className="max-w-lg mx-auto">
        <h1 className="text-3xl font-black mb-2">Complete Payment</h1>
        <p className="text-muted-fg mb-8">Pay the service fee to receive your personalized appeal strategy document.</p>

        {/* Citation Summary */}
        <div className="card mb-6">
          <h2 className="font-bold text-primary mb-3">Citation Summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted">Citation #</span>
              <span className="text-text font-semibold">{citation.citationNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Violation</span>
              <span className="text-text">{citation.violationType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">County</span>
              <span className="text-text">{citation.county}, TX</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Deadline</span>
              <span className="text-text">{citation.responseDeadline ? new Date(citation.responseDeadline).toLocaleDateString() : 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Service Fee Card */}
        <div className="card border-primary/30 bg-primary/5 mb-6">
          <h2 className="font-bold text-lg mb-4">Service Fee</h2>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-muted">AppealMyTicket<span className="text-primary">S</span>.com — Citation Strategy Service</p>
              <p className="text-xs text-subtle">One-time fee — includes personalized strategy document, deadline tracking, and dashboard access</p>
            </div>
            <p className="text-3xl font-black text-primary">${SERVICE_FEE}</p>
          </div>
          <div className="border-t border-primary/20 pt-4 flex justify-between">
            <span className="font-semibold">Total Due</span>
            <span className="font-black text-xl">${SERVICE_FEE}</span>
          </div>
        </div>

        {/* What's Included */}
        <div className="card mb-6">
          <h2 className="font-bold mb-3">What's Included</h2>
          <ul className="space-y-2 text-sm text-muted">
            <li className="flex items-start gap-2">✓ Personalized appeal strategy document (PDF)</li>
            <li className="flex items-start gap-2">✓ Step-by-step instructions for filing your appeal</li>
            <li className="flex items-start gap-2">✓ Court-specific filing guidance</li>
            <li className="flex items-start gap-2">✓ Deadline tracking and monitoring</li>
            <li className="flex items-start gap-2">✓ Real-time dashboard access</li>
            <li className="flex items-start gap-2">✓ Email and SMS status updates</li>
          </ul>
        </div>

        {/* Payment Button */}
        {error && (
          <div className="card bg-danger/10 border-danger/30 mb-4">
            <p className="text-danger text-sm">{error}</p>
          </div>
        )}

        <button
          onClick={handlePay}
          disabled={processing}
          className="btn-primary w-full text-lg py-4 mb-4 disabled:opacity-50"
        >
          {processing ? 'Redirecting to Square...' : `Pay $${SERVICE_FEE} with Square`}
        </button>

        <p className="text-center text-xs text-subtle">
          Secure payment powered by Square. Your card info is never stored on our servers.
        </p>

        <div className="text-center mt-8">
          <Link href={`/confirmation?id=${citation.id}`} className="text-muted text-sm hover:text-white">
            Pay later — return to confirmation
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function ServicePaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--gradient-bg)' }}>
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
      </div>
    }>
      <ServicePaymentContent />
    </Suspense>
  )
}
