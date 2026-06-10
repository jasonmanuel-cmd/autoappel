import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Brand Ambassador Program | AppealMyTickets.com',
  robots: { index: false, follow: false },
}
export default function AmbassadorsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
