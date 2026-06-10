import { Suspense } from 'react'
import SuccessContent from './content'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Payment Successful | AppealMyTickets.com',
  robots: { index: false, follow: false },
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen" style={{ background: 'var(--gradient-bg)' }}>
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="card text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
            <p className="text-muted mt-4">Loading...</p>
          </div>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}
