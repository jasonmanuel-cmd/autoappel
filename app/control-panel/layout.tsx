import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Control Panel | AppealMyTickets.com',
  robots: { index: false, follow: false },
}
export default function ControlPanelLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
