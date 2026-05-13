import type { Metadata } from 'next'
import './globals.css'
import Nav from '@/components/Nav'

export const metadata: Metadata = {
  title: 'AutoAppeal™ Houston — LAGNAF™ network LLC',
  description: 'Houston Metro Area Traffic Citation Appeal Service',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#070d18]">
        <Nav />
        <main>{children}</main>
        <footer className="border-t border-[#1a3355] mt-16 py-6 text-center text-[#27415e] text-sm">
          <p>AutoAppeal™ Houston · LAGNAF™ network LLC · Founder: Marc Bouvier</p>
          <p className="mt-1">All activity is monitored and logged under Red Vault™ security protocol.</p>
        </footer>
      </body>
    </html>
  )
}
