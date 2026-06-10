import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Track Your Appeal | AppealMyTickets.com',
  robots: { index: false, follow: true },
  alternates: { canonical: 'https://autoappel1.vercel.app/countdown' },
}
export default function TrackLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
