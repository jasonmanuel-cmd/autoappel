import type { Metadata } from 'next'
import './globals.css'
import Nav from '@/components/Nav'

export const metadata: Metadata = {
  title: 'AutoAppeal™ Houston — Professional Traffic Citation Appeals',
  description: 'Fast, professional traffic citation appeal service for Houston, Texas. We fight traffic tickets and help get them dismissed.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#070d18] text-[#e8f1ff]">
        <Nav />
        <main>{children}</main>
      </body>
    </html>
  )
}
