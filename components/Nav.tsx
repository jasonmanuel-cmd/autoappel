'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'

const links = [
  { href: '/',             label: 'Home' },
  { href: '/intake',       label: 'Start Appeal' },
  { href: '/countdown',    label: 'Countdown' },
  { href: '/ambassadors',  label: 'Ambassadors' },
  { href: '/treasury',     label: 'Treasury' },
  { href: '/red-vault',    label: '🔴 Red Vault™' },
  { href: '/dashboard',    label: '⚡ Founder Dashboard™' },
  { href: '/qa',           label: 'QA Scorecard' },
]

export default function Nav() {
  const path = usePathname()
  return (
    <nav className="border-b border-[#1a3355] bg-[#08111e] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-1 overflow-x-auto py-3">
        <span className="text-[#1d6ef3] font-black text-lg mr-4 whitespace-nowrap">AutoAppeal™</span>
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
    </nav>
  )
}
