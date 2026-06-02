'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { store } from '@/lib/store'
import Link from 'next/link'

export default function DemoBanner() {
  const [demo, setDemo] = useState(false)
  const path = usePathname()

  useEffect(() => {
    setDemo(store.getDemoMode())
    const interval = setInterval(() => setDemo(store.getDemoMode()), 1000)
    return () => clearInterval(interval)
  }, [])

  // Never show in production
  if (process.env.NODE_ENV === 'production') return null
  if (!demo) return null
  if (path === '/login' || path === '/test-dashboard' || path === '/demo-payment') return null

  return (
    <div className="bg-warning/20 border-b border-warning/30 text-warning text-xs text-center py-2 px-4 flex items-center justify-center gap-3 flex-wrap">
      <span className="font-bold">🔬 Staging Environment</span>
      <span className="text-warning/70">|</span>
      <span>Pre-production — data is not live</span>
      <span className="text-warning/70">|</span>
      <Link href="/control-panel" className="underline hover:no-underline font-semibold">
        Control Panel →
      </Link>
      <button
        onClick={() => { store.logout(); window.location.href = '/' }}
        className="underline hover:no-underline font-semibold"
      >
        Exit Demo
      </button>
    </div>
  )
}
