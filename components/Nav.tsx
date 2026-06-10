'use client'

import Image from 'next/image'
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
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    setDemo(store.getDemoMode())
  }, [])

  useEffect(() => { setMenuOpen(false) }, [path])

  return (
    <nav className="border-b border-border bg-bg-elevated sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between py-2.5">
        <Link href="/" className="flex items-center gap-2 whitespace-nowrap py-1 min-h-[44px]">
          <Image src="/appealmytickets-logo.png" alt="AppealMyTickets.com" width={160} height={40} className="h-10 w-auto" priority />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
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
              href="/control-panel"
              className={clsx(
                'px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
                path.startsWith('/control-panel') || path.startsWith('/test-dashboard')
                  ? 'bg-primary text-white'
                  : 'text-muted-fg hover:text-white hover:bg-card-hover'
              )}
            >
              Admin
            </Link>
          ) : (
            <Link
              href="/login"
              className="px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap text-subtle hover:text-muted-fg transition-colors"
            >
              Login
            </Link>
          )}
        </div>

        {/* Hamburger Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex flex-col items-center justify-center gap-1.5 p-3 rounded-lg hover:bg-card-hover transition-colors min-w-[44px] min-h-[44px]"
          aria-label="Toggle navigation menu"
        >
          <span className={`block w-5 h-0.5 bg-text transition-transform ${menuOpen ? 'rotate-45 translate-y-1' : ''}`} />
          <span className={`block w-5 h-0.5 bg-text transition-opacity ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-0.5 bg-text transition-transform ${menuOpen ? '-rotate-45 -translate-y-1' : ''}`} />
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-border bg-bg-elevated">
          <div className="px-4 py-3 flex flex-col gap-1">
            {links.map(l => (
              <Link
                key={l.href}
                href={l.href}
                className={clsx(
                  'px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
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
                href="/control-panel"
                className={clsx(
                  'px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  path.startsWith('/control-panel')
                    ? 'bg-primary text-white'
                    : 'text-muted-fg hover:text-white hover:bg-card-hover'
                )}
              >
                Admin Panel
              </Link>
            ) : (
              <Link
                href="/login"
                className="px-3 py-2.5 rounded-lg text-sm font-medium text-subtle hover:text-muted-fg transition-colors"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
