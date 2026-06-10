import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Red Vault Security | AppealMyTickets.com',
  robots: { index: false, follow: false },
}
export default function RedVaultLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
