import type { Metadata } from 'next'
import './globals.css'
import Nav from '@/components/Nav'
import DemoBanner from '@/components/DemoBanner'
import { Analytics } from '@vercel/analytics/next'

export const metadata: Metadata = {
  title: 'AutoAppeal™ Houston — Professional Traffic Citation Appeals',
  description: 'Professional traffic citation appeal service for Houston, Texas.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-bg text-text">
        <DemoBanner />
        <Nav />
        <main>{children}</main>
        <Analytics />
      </body>
    </html>
  )
}
