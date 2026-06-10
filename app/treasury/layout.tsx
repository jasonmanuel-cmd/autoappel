import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Treasury | AppealMyTickets.com',
  robots: { index: false, follow: false },
}
export default function TreasuryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
