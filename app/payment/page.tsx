import { Suspense } from 'react'
import PaymentForm from './form'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Pay Citation Fine | AppealMyTickets.com',
  robots: { index: false, follow: false },
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen" style={{ background: 'var(--gradient-bg)' }}>
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="card">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
            <p className="text-muted mt-4">Loading...</p>
          </div>
        </div>
      </div>
    }>
      <PaymentForm />
    </Suspense>
  )
}
