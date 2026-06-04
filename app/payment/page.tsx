'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClientSupabase } from '@/lib/supabase'
import type { Citation } from '@/lib/types'

export const dynamic = 'force-dynamic'

interface CitationRow {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  preferred_contact: 'email' | 'sms' | 'both'
  citation_number: string
  citation_date: string
  response_deadline: string
  county: string
  court: string
  jurisdiction: string
  violation_type: string
  risk_level: 'green' | 'yellow' | 'orange' | 'red' | 'expired'
  status: 'pending' | 'in_review' | 'appealing' | 'resolved' | 'expired'
  payment_status: 'unpaid' | 'paid' | 'waived'
  created_at: string
  updated_at: string
  fine_amount?: number
}

const CITATION_FINE = 15000 // $150.00 in cents

export default function PaymentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const citationId = searchParams.get('citation_id') as string

  const [citation, setCitation] = useState<Citation | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [processing, setProcessing] = useState(false)
  const [cardComplete, setCardComplete] = useState(false)

  // Card element refs (using basic HTML for simplicity without Stripe.js library)
  const [cardNumber, setCardNumber] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [cvc, setCvc] = useState('')
  const [billingZip, setBillingZip] = useState('')

  useEffect(() => {
    const loadCitation = async () => {
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

        const { data, error: queryError } = await supabase
          .from('citations')
          .select('*')
          .eq('id', citationId)
          .eq('email', user.email)
          .single()

        if (queryError) {
          setError('Citation not found or access denied')
          setLoading(false)
          return
        }

        const row = data as CitationRow
        const transformed: Citation = {
          id: row.id,
          firstName: row.first_name,
          lastName: row.last_name,
          email: row.email,
          phone: row.phone,
          preferredContact: row.preferred_contact,
          citationNumber: row.citation_number,
          citationDate: row.citation_date,
          responseDeadline: row.response_deadline,
          county: row.county,
          court: row.court,
          jurisdiction: row.jurisdiction,
          violationType: row.violation_type,
          riskLevel: row.risk_level,
          status: row.status,
          paymentStatus: row.payment_status,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
        }

        setCitation(transformed)
      } catch (err) {
        console.error('Load error:', err)
        setError('An error occurred while loading the citation')
      } finally {
        setLoading(false)
      }
    }

    if (citationId) {
      loadCitation()
    }
  }, [citationId])

  const validateCardForm = () => {
    return cardNumber.replace(/\s/g, '').length === 16 && expiryDate.length === 5 && cvc.length === 3 && billingZip.length >= 5
  }

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!citation || !validateCardForm()) {
      setError('Please fill in all card details correctly')
      return
    }

    setProcessing(true)
    setError('')

    try {
      // In production, this would call a secure backend endpoint that:
      // 1. Creates a Stripe PaymentIntent
      // 2. Tokenizes the card
      // 3. Processes the payment
      // 4. Updates the citation status to paid
      // 5. Sends confirmation email/SMS

      // For now, we'll simulate a successful payment
      const response = await fetch('/api/payment/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          citationId: citation.id,
          amount: CITATION_FINE,
          cardNumber: cardNumber.replace(/\s/g, ''),
          expiryDate,
          cvc,
          billingZip,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Payment processing failed')
        setProcessing(false)
        return
      }

      // Update citation status to paid
      const supabase = createClientSupabase()
      if (supabase) {
        await supabase
          .from('citations')
          .update({
            payment_status: 'paid',
            status: 'resolved',
            updated_at: new Date().toISOString(),
          })
          .eq('id', citation.id)

        // Send payment confirmation email
        try {
          await fetch('/api/notifications/email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'payment_received',
              email: citation.email,
              firstName: citation.firstName,
              citationNumber: citation.citationNumber,
              amount: fineAmount,
            }),
          })
        } catch (err) {
          console.error('Error sending payment email:', err)
        }

        // Send payment confirmation SMS if enabled
        if (citation.preferredContact === 'sms' || citation.preferredContact === 'both') {
          try {
            await fetch('/api/notifications/sms', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                type: 'payment_received',
                phoneNumber: citation.phone,
                citationNumber: citation.citationNumber,
                amount: CITATION_FINE,
              }),
            })
          } catch (err) {
            console.error('Error sending payment SMS:', err)
          }
        }
      }

      // Redirect to success page
      router.push(`/payment/success?citation_id=${citation.id}`)
    } catch (err) {
      console.error('Payment error:', err)
      setError('Payment processing failed. Please try again.')
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen" style={{ background: 'var(--gradient-bg)' }}>
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="card">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
            <p className="text-muted mt-4">Loading citation...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !citation) {
    return (
      <div className="min-h-screen" style={{ background: 'var(--gradient-bg)' }}>
        <div className="max-w-2xl mx-auto px-4 py-8">
          <Link href="/dashboard" className="text-primary hover:underline mb-6 inline-block">
            ← Back to Dashboard
          </Link>
          <div className="card bg-danger/10 border border-danger/20">
            <p className="text-danger">{error || 'Citation not found'}</p>
          </div>
        </div>
      </div>
    )
  }

  const fineAmount = CITATION_FINE / 100

  return (
    <div className="min-h-screen" style={{ background: 'var(--gradient-bg)' }}>
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Link href={`/dashboard/citations/${citation.id}`} className="text-primary hover:underline mb-6 inline-block">
          ← Back to Citation
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Payment Form */}
          <div className="md:col-span-2">
            <div className="card">
              <h1 className="text-3xl font-black mb-2">Pay Citation Fine</h1>
              <p className="text-muted mb-6">
                Securely pay your citation fine using your credit or debit card.
              </p>

              <form onSubmit={handlePayment} className="space-y-4">
                {/* Card Number */}
                <div>
                  <label className="label">Card Number *</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={e => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 16)
                      setCardNumber(val.replace(/(\d{4})/g, '$1 ').trim())
                    }}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    className="input font-mono"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Expiry Date */}
                  <div>
                    <label className="label">Expiry Date *</label>
                    <input
                      type="text"
                      value={expiryDate}
                      onChange={e => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 4)
                        if (val.length <= 2) {
                          setExpiryDate(val)
                        } else {
                          setExpiryDate(val.slice(0, 2) + '/' + val.slice(2))
                        }
                      }}
                      placeholder="MM/YY"
                      maxLength={5}
                      className="input font-mono"
                      required
                    />
                  </div>

                  {/* CVC */}
                  <div>
                    <label className="label">CVC *</label>
                    <input
                      type="text"
                      value={cvc}
                      onChange={e => setCvc(e.target.value.replace(/\D/g, '').slice(0, 3))}
                      placeholder="123"
                      maxLength={3}
                      className="input font-mono"
                      required
                    />
                  </div>
                </div>

                {/* Billing Zip */}
                <div>
                  <label className="label">Billing ZIP Code *</label>
                  <input
                    type="text"
                    value={billingZip}
                    onChange={e => setBillingZip(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="90210"
                    className="input"
                    required
                  />
                </div>

                {error && <p className="text-danger text-xs p-2 bg-danger/10 rounded">{error}</p>}

                <button
                  type="submit"
                  disabled={processing || !validateCardForm()}
                  className="btn-primary w-full"
                >
                  {processing ? 'Processing...' : `Pay $${fineAmount.toFixed(2)}`}
                </button>

                <p className="text-xs text-muted text-center">
                  This is a secure, encrypted payment. Your card details are never stored.
                </p>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="card">
              <h2 className="text-lg font-bold mb-4">Order Summary</h2>

              <div className="space-y-3 border-b border-border pb-4 mb-4">
                <div>
                  <p className="text-muted text-sm">Citation Number</p>
                  <p className="font-mono font-semibold mt-1">{citation.citationNumber}</p>
                </div>
                <div>
                  <p className="text-muted text-sm">Violation</p>
                  <p className="font-semibold mt-1 text-sm">{citation.violationType}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Fine Amount</span>
                  <span className="font-semibold">${fineAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Processing Fee</span>
                  <span className="font-semibold">$0.00</span>
                </div>
                <div className="border-t border-border pt-2 mt-2 flex justify-between">
                  <span className="font-bold">Total Due</span>
                  <span className="font-black text-lg">${fineAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
