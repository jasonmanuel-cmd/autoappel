import type { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'
export const metadata: Metadata = {
  title: 'Contact Us | AppealMyTickets.com',
  description: 'Get in touch with the AppealMyTickets.com team. Email us at info@lagnafnetwork.com or call (949) 350-8804.',
  alternates: { canonical: 'https://autoappel1.vercel.app/contact' },
}
export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "ContactPage",
        "name": "Contact AppealMyTickets.com",
        "description": "Contact the AppealMyTickets.com team for traffic ticket appeal assistance."
      }} />
      {children}
    </>
  )
}
