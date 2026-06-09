import type { Metadata } from 'next'
import './globals.css'
import Nav from '@/components/Nav'
import DemoBanner from '@/components/DemoBanner'
import RoadBackground from '@/components/RoadBackground'
import { Analytics } from '@vercel/analytics/next'
import TrackingScripts from '@/components/Analytics'

const gscId = process.env.NEXT_PUBLIC_GSC_VERIFICATION

export const metadata: Metadata = {
  title: 'AppealMyTickets.com — Traffic Ticket Paperwork Assistance for Houston',
  description: 'From Ticket to Appeal in Minutes. AppealMyTickets.com helps Houston drivers prepare citation paperwork, track deadlines, and navigate the appeal process — flat $79.99 per ticket.',
  ...(gscId ? { verification: { google: gscId } } : {}),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-bg text-text relative">
        <RoadBackground />
        <div className="relative z-10">
          <DemoBanner />
          <Nav />
          <main>{children}</main>
          <Analytics />
          <TrackingScripts />
        </div>
      </body>
    </html>
  )
}
