import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Demo Payment | AppealMyTickets.com',
  robots: { index: false, follow: false },
}
export default function DemoPaymentLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
