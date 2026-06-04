'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const citationId = searchParams.get('citation_id')

  return (
    <div className="min-h-screen" style={{ background: 'var(--gradient-bg)' }}>
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="card text-center">
          <div className="text-6xl mb-4">✓</div>
          <h1 className="text-3xl font-black mb-2">Payment Successful!</h1>
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
        </div>
      </div>
    </div>
  )
}
