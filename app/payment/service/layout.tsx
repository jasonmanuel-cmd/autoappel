import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Complete Payment | AppealMyTickets.com',
  robots: { index: false, follow: false },
}
export default function PaymentServiceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
