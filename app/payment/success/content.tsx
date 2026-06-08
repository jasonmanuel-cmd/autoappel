'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function SuccessContent() {
  const searchParams = useSearchParams()
  const citationId = searchParams.get('citation_id')
  const plan = searchParams.get('plan')
  const isServiceFee = plan === 'Citation Appeal Service'
  const [generating, setGenerating] = useState(false)
  const [generated, setGenerated] = useState(false)
  const [genError, setGenError] = useState('')

  useEffect(() => {
    if (isServiceFee && citationId && !generating && !generated) {
      setGenerating(true)
      fetch('/api/citations/generate-strategy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ citationId }),
      })
        .then(r => r.json())
        .then(data => {
          if (data.success) {
            setGenerated(true)
          } else {
            setGenError(data.error || 'Generation failed')
          }
        })
        .catch(() => setGenError('Network error'))
        .finally(() => setGenerating(false))
    }
  }, [isServiceFee, citationId, generating, generated])

  return (
    <div className="min-h-screen" style={{ background: 'var(--gradient-bg)' }}>
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="card text-center">
          <div className="text-6xl mb-4">✓</div>
          <h1 className="text-3xl font-black mb-2">Payment Successful!</h1>
          {isServiceFee ? (
            <>
              <p className="text-muted mb-2">
                Your <strong>$149</strong> service fee has been paid.
              </p>

              {generating && (
                <div className="bg-primary/10 border border-primary/30 rounded p-4 mb-6">
                  <div className="animate-spin w-6 h-6 border-3 border-primary border-t-transparent rounded-full mx-auto mb-2" />
                  <p className="text-primary font-semibold">
                    Generating your appeal strategy document...
                  </p>
                </div>
              )}

              {genError && (
                <div className="bg-danger/10 border border-danger/30 rounded p-4 mb-6">
                  <p className="text-danger font-semibold">
                    Could not generate strategy document: {genError}
                  </p>
                  <p className="text-sm text-muted mt-2">
                    We will retry. If the issue persists, please contact support.
                  </p>
                </div>
              )}

              {generated && (
                <>
                  <div className="bg-success/10 border border-success/20 rounded p-4 mb-6">
                    <p className="text-success font-semibold">
                      Your appeal strategy document is ready!
                    </p>
                    <p className="text-sm text-muted mt-1">
                      We have emailed it to you with step-by-step instructions on how to submit your appeal.
                    </p>
                  </div>
                  <div className="flex flex-col gap-3">
                    <Link href="/dashboard" className="btn-primary">
                      Go to Dashboard
                    </Link>
                    <a href={`mailto:info@lagnafnetwork.com?subject=Strategy%20Document%20-%20${citationId}`} className="btn-secondary">
                      Resend Email
                    </a>
                  </div>
                </>
              )}

              {!generating && !generated && !genError && (
                <>
                  <p className="text-sm text-muted mb-6">
                    A confirmation receipt has been sent to your email. Your strategy document will be ready shortly.
                  </p>
                  <div className="flex flex-col gap-3">
                    <Link href={citationId ? `/confirmation?id=${citationId}` : '/dashboard'} className="btn-primary">
                      View Status
                    </Link>
                    <Link href="/dashboard" className="btn-secondary">
                      Back to Dashboard
                    </Link>
                  </div>
                </>
              )}
            </>
          ) : (
            <>
              <p className="text-muted mb-2">
                Your citation fine has been paid successfully.
              </p>
              <p className="text-sm text-muted mb-6">
                A confirmation email has been sent to your email address.
              </p>
              <div className="bg-success/10 border border-success/20 rounded p-4 mb-6">
                <p className="text-success font-semibold">
                  Your citation status has been updated to <strong>RESOLVED</strong>
                </p>
              </div>
              <div className="flex flex-col gap-3">
                {citationId && (
                  <Link href={`/dashboard/citations/${citationId}`} className="btn-primary">
                    View Citation
                  </Link>
                )}
                <Link href="/dashboard" className="btn-secondary">
                  Back to Dashboard
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
