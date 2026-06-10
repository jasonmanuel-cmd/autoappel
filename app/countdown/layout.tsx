import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Track Your Appeal | AppealMyTickets.com',
  description: 'Track the status of your traffic citation appeal with AppealMyTickets.com.',
  alternates: { canonical: 'https://autoappel1.vercel.app/countdown' },
}
export default function CountdownLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
