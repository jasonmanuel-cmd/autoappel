import type { Metadata } from 'next'
import './globals.css'
import Nav from '@/components/Nav'
import DemoBanner from '@/components/DemoBanner'
import StarsBackground from '@/components/StarsBackground'
import { Analytics } from '@vercel/analytics/next'

export const metadata: Metadata = {
  title: 'AutoAppeal™ — Traffic Ticket Paperwork Assistance for Houston',
  description: 'Traffic ticket paperwork assistance platform for Houston drivers. We help prepare citation documentation, track deadlines, and navigate the appeal process.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-bg text-text relative">
        <StarsBackground />
        <div className="relative z-10">
          <DemoBanner />
          <Nav />
          <main>{children}</main>
          <Analytics />
        </div>
      </body>
    </html>
  )
}
