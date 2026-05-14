'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { store } from '@/lib/store'
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
  const [demo, setDemo] = useState(false)

  useEffect(() => {
    setDemo(store.getDemoMode())
    const interval = setInterval(() => setDemo(store.getDemoMode()), 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <nav className="border-b border-border bg-bg-elevated sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between py-4">
        <Link href="/" className="text-primary font-black text-xl whitespace-nowrap">
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
                  ? 'bg-primary text-white'
                  : 'text-muted-fg hover:text-white hover:bg-card-hover'
              )}
            >
              {l.label}
            </Link>
          ))}
          {demo ? (
            <Link
              href="/test-dashboard"
              className={clsx(
                'px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
                path === '/test-dashboard'
                  ? 'bg-warning text-black'
                  : 'text-warning hover:text-black hover:bg-warning/70'
              )}
            >
              🛠 Test
            </Link>
          ) : (
            <Link
              href="/login"
              className="px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap text-subtle hover:text-muted-fg transition-colors"
            >
              Demo
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
