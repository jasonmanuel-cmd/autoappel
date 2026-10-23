import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'QA Dashboard | AppealMyTickets.com',
  robots: { index: false, follow: false },
}
export default function QALayout({ children }: { children: React.ReactNode }) {
  return <><aside role="note" className="p-4 border border-warning text-warning text-center">Prototype / simulation only. Controls on this screen are stored in this browser; they do not change production security, banking, deployment or customer payments.</aside>{children}</>
}
