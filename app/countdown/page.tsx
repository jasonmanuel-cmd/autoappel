'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { store } from '@/lib/store'
import type { Citation, RiskLevel } from '@/lib/types'
import Link from 'next/link'
import { Suspense } from 'react'

const RISK_LABELS: Record<RiskLevel, string> = {
  green: 'Safe Window',
  yellow: 'Approaching Deadline',
  orange: 'High Urgency',
  red: 'Critical — Act Now',
  expired: 'Deadline May Have Passed',
}

const RISK_COLORS: Record<RiskLevel, string> = {
  green: '#4ade80',
  yellow: '#facc15',
  orange: '#fb923c',
  red: '#f87171',
  expired: '#6b7280',
}

function daysUntil(dateStr: string) {
  if (!dateStr) return null
  const diff = new Date(dateStr).getTime() - Date.now()
  return Math.ceil(diff / 86400000)
}

function CountdownContent() {
  const params = useSearchParams()
  const id = params.get('id')
  const [citations, setCitations] = useState<Citation[]>([])

  useEffect(() => {
    const all = store.getCitations()
    if (id) {
      const found = all.find(c => c.id === id)
      setCitations(found ? [found] : all)
    } else {
      setCitations(all)
    }
  }, [id])

  if (citations.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-[#5b7fa6] mb-4">No citations found.</p>
        <Link href="/intake" className="btn-primary">Start a New Appeal</Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-black mb-2">Countdown Escalation Dashboard</h1>
      <p className="text-[#5b7fa6] mb-8">Deadline tracking for Houston AutoAppeal™ citations</p>

      <div className="space-y-4">
        {citations.map(c => {
          const days = daysUntil(c.responseDeadline)
          const risk = store.computeRisk(c.responseDeadline)
          const color = RISK_COLORS[risk]
          return (
            <div key={c.id} className="card" style={{ borderColor: color + '44' }}>
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <p className="font-bold text-lg">{c.firstName} {c.lastName}</p>
                  <p className="text-[#5b7fa6] text-sm">Citation #{c.citationNumber} · {c.violationType}</p>
                  <p className="text-[#5b7fa6] text-sm">{c.county} · {c.court}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black" style={{ color }}>
                    {days === null ? '—' : days < 0 ? 'EXPIRED' : `${days}d`}
                  </div>
                  <div className="text-xs font-bold uppercase tracking-wider" style={{ color }}>
                    {RISK_LABELS[risk]}
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div className="bg-[#08111e] rounded p-2">
                  <p className="text-[#27415e] text-xs">Citation Date</p>
                  <p>{c.citationDate || '—'}</p>
                </div>
                <div className="bg-[#08111e] rounded p-2">
                  <p className="text-[#27415e] text-xs">Response Deadline</p>
                  <p>{c.responseDeadline || 'Not provided'}</p>
                </div>
                <div className="bg-[#08111e] rounded p-2">
                  <p className="text-[#27415e] text-xs">Status</p>
                  <p className="capitalize">{c.status.replace('_', ' ')}</p>
                </div>
                <div className="bg-[#08111e] rounded p-2">
                  <p className="text-[#27415e] text-xs">Payment</p>
                  <p className="capitalize">{c.paymentStatus}</p>
                </div>
              </div>

              <div className="mt-3 text-xs text-[#27415e]">
                Reminders: Initial confirmation · Incomplete submission · Deadline approaching · Final urgency · Founder/admin risk alert
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-8 card border-[#1d6ef3]">
        <h3 className="font-bold text-[#1d6ef3] mb-3">Risk Level Key</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
          {(Object.keys(RISK_LABELS) as RiskLevel[]).map(r => (
            <div key={r} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ background: RISK_COLORS[r] }} />
              <span style={{ color: RISK_COLORS[r] }}>{RISK_LABELS[r]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function CountdownPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-[#5b7fa6]">Loading...</div>}>
      <CountdownContent />
    </Suspense>
  )
}
