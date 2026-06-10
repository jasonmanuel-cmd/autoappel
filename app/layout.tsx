import type { Metadata } from 'next'
import './globals.css'
import Nav from '@/components/Nav'
import DemoBanner from '@/components/DemoBanner'
import GalaxyBackground from '@/components/GalaxyBackground'
import { Analytics } from '@vercel/analytics/next'
import TrackingScripts from '@/components/Analytics'
import JsonLd from '@/components/JsonLd'

const gscId = process.env.NEXT_PUBLIC_GSC_VERIFICATION

export const metadata: Metadata = {
  title: 'AppealMyTickets.com — Traffic Ticket Paperwork Assistance for Houston',
  description: 'From Ticket to Appeal in Minutes. AppealMyTickets.com helps Houston drivers prepare citation paperwork, track deadlines, and navigate the appeal process — flat $79.99 per ticket.',
  ...(gscId ? { verification: { google: gscId } } : {}),
  openGraph: {
    title: 'AppealMyTickets.com — Traffic Ticket Paperwork Assistance',
    description: 'From Ticket to Strategy in Minutes. Get a professional, court-specific appeal strategy document for a flat $79.99.',
    url: 'https://autoappel1.vercel.app',
    siteName: 'AppealMyTickets.com',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AppealMyTickets.com — Traffic Ticket Paperwork Assistance',
    description: 'From Ticket to Strategy in Minutes. Get a professional, court-specific appeal strategy document for a flat $79.99.',
  },
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
          <JsonLd data={{
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "AppealMyTickets.com",
            "url": "https://autoappel1.vercel.app",
            "description": "Houston traffic ticket appeal strategy document service"
          }} />
          <JsonLd data={{
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Traffic Ticket Appeal Strategy Document",
            "description": "Professional court-specific appeal strategy document for Houston traffic citations",
            "provider": { "@type": "Organization", "name": "AppealMyTickets.com" },
            "offers": { "@type": "Offer", "price": "79.99", "priceCurrency": "USD" }
          }} />
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
