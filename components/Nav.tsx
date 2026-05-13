'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'

const links = [
  { href: '/', label: 'Home' },
  { href: '/intake', label: 'Start Appeal' },
  { href: '/track', label: 'Track Appeal' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact' },
]

export default function Nav() {
  const path = usePathname()
  return (
    <nav className="border-b border-[#1a3355] bg-[#08111e] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between py-4">
        <Link href="/" className="text-[#1d6ef3] font-black text-xl whitespace-nowrap">
          AutoAppeal™
        </Link>
        <div className="flex items-center gap-1 overflow-x-auto">
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className={clsx(
                'px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
                path === l.href
                  ? 'bg-[#1d6ef3] text-white'
                  : 'text-[#8aafd4] hover:text-white hover:bg-[#142540]'
              )}
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
