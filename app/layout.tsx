import type { Metadata } from 'next'
import './globals.css'
import Nav from '@/components/Nav'
import DemoBanner from '@/components/DemoBanner'
import GalaxyBackground from '@/components/GalaxyBackground'
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
        <GalaxyBackground />
        <div className="relative z-10">
          <DemoBanner />
          <Nav />
          <main>{children}</main>
          <div className="text-center py-4 border-t border-border/30 mt-8">
            <p className="text-xs text-subtle">
              Powered by <a href="https://coaibakersfield.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">coaibakersfield.com</a>
            </p>
          </div>
          <Analytics />
          <TrackingScripts />
        </div>
      </body>
    </html>
  )
}
