import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'QA Dashboard | AppealMyTickets.com',
  robots: { index: false, follow: false },
}
export default function QALayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
