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

function TrackingContent() {
  const params = useSearchParams()
  const id = params.get('id')
  const [citations, setCitations] = useState<Citation[]>([])
  const [activeTab, setActiveTab] = useState<'current' | 'history'>('current')

  useEffect(() => {
    const all = store.getCitations()
    if (id) {
      const found = all.find(c => c.id === id)
      setCitations(found ? [found] : all)
    } else {
      setCitations(all)
    }
  }, [id])

  const pending = citations.filter(c => ['pending', 'in_review', 'appealing'].includes(c.status))
  const resolved = citations.filter(c => ['resolved', 'expired'].includes(c.status))

  if (citations.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="card">
          <div className="text-5xl mb-4">📋</div>
          <h2 className="text-2xl font-bold mb-2">No Appeals Yet</h2>
          <p className="text-muted mb-6">You haven't submitted any appeals. Start one now to track your case.</p>
          <Link href="/intake" className="btn-primary inline-block">
            Start My First Appeal
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-black mb-2">Track Your Appeals</h1>
        <p className="text-muted-fg">Monitor your citation appeals and response deadlines in real-time.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-border">
        <button
          onClick={() => setActiveTab('current')}
          className={`px-4 py-3 font-semibold border-b-2 transition-colors ${
            activeTab === 'current'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted hover:text-muted-fg'
          }`}
        >
          Active Appeals ({pending.length})
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-3 font-semibold border-b-2 transition-colors ${
            activeTab === 'history'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted hover:text-muted-fg'
          }`}
        >
          Resolved ({resolved.length})
        </button>
      </div>

      {/* Active Appeals */}
      {activeTab === 'current' && (
        <div className="space-y-4">
          {pending.length === 0 ? (
            <div className="card text-center py-12">
              <p className="text-muted">No active appeals. Start a new one to get tracking.</p>
              <Link href="/intake" className="btn-primary mt-4 inline-block">Start Appeal</Link>
            </div>
          ) : (
            pending.map(c => {
              const days = daysUntil(c.responseDeadline)
              const risk = store.computeRisk(c.responseDeadline)
              const color = RISK_COLORS[risk]
              return (
                <div key={c.id} className="card hover:border-primary/50 transition-colors" style={{ borderLeftColor: color, borderLeftWidth: '4px' }}>
                  <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
                    <div>
                      <p className="font-bold text-lg text-text">{c.firstName} {c.lastName}</p>
                      <p className="text-muted text-sm">Citation #{c.citationNumber}</p>
                      <p className="text-muted text-sm">{c.violationType} • {c.county}, TX</p>
                    </div>
                    {c.responseDeadline && (
                      <div className="text-right bg-bg-elevated rounded-lg px-4 py-3 border border-border">
                        <div className="text-3xl font-black" style={{ color }}>
                          {days === null ? '—' : days < 0 ? '0' : days}
                        </div>
                        <div className="text-xs font-bold uppercase" style={{ color }}>
                          {days === null ? 'N/A' : days === 0 ? 'Today' : days === 1 ? 'Tomorrow' : `Days Left`}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 text-sm">
                    <div className="bg-bg-elevated rounded p-3 border border-border">
                      <p className="text-subtle text-xs font-semibold mb-1">Submitted</p>
                      <p className="text-text">{new Date(c.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="bg-bg-elevated rounded p-3 border border-border">
                      <p className="text-subtle text-xs font-semibold mb-1">Response Deadline</p>
                      <p className="text-text">{c.responseDeadline ? new Date(c.responseDeadline).toLocaleDateString() : 'Not provided'}</p>
                    </div>
                    <div className="bg-bg-elevated rounded p-3 border border-border">
                      <p className="text-subtle text-xs font-semibold mb-1">Status</p>
                      <p className="text-text capitalize">{c.status.replace('_', ' ')}</p>
                    </div>
                    <div className="bg-bg-elevated rounded p-3 border border-border">
                      <p className="text-subtle text-xs font-semibold mb-1">Risk Level</p>
                      <p style={{ color }}>{RISK_LABELS[risk]}</p>
                    </div>
                  </div>

                  {days !== null && days <= 7 && days > 0 && (
                    <div className="bg-primary/10 border border-primary/30 rounded-lg p-3 mb-4">
                      <p className="text-sm text-primary">⏰ Your deadline is approaching. Make sure to respond by <strong>{new Date(c.responseDeadline).toLocaleDateString()}</strong></p>
                    </div>
                  )}

                  {days !== null && days <= 0 && (
                    <div className="bg-danger/10 border border-danger/30 rounded-lg p-3 mb-4">
                      <p className="text-sm text-danger">⚠️ Your response deadline may have passed. Please contact us immediately for assistance.</p>
                    </div>
                  )}

                  <div className="text-xs text-subtle bg-bg-elevated rounded p-3">
                    <p className="font-semibold text-muted-fg mb-2">Next Steps:</p>
                    <ul className="space-y-1 list-disc list-inside">
                      <li>We're reviewing your citation details</li>
                      <li>You'll receive status updates via {c.preferredContact === 'sms' ? 'text' : c.preferredContact === 'both' ? 'email and text' : 'email'}</li>
                      <li>Check back here to monitor your appeal status</li>
                    </ul>
                  </div>
                </div>
              )
            })
          )}
        </div>
      )}

      {/* Resolved Appeals */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          {resolved.length === 0 ? (
              <div className="card text-center py-12">
              <p className="text-muted">No resolved appeals yet.</p>
            </div>
          ) : (
            resolved.map(c => (
              <div key={c.id} className="card opacity-75">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <p className="font-bold text-lg text-text">{c.firstName} {c.lastName}</p>
                    <p className="text-muted text-sm">Citation #{c.citationNumber}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-success">✓ {c.status.replace('_', ' ').toUpperCase()}</p>
                    <p className="text-xs text-muted">Resolved {new Date(c.updatedAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Disclaimer */}
      <div className="card bg-danger/5 border border-danger/30 mt-8">
        <h3 className="font-bold text-danger mb-2">⚠ Important Legal Notice</h3>
        <ul className="text-sm text-muted space-y-2">
          <li><strong>Deadline estimates are for reference only.</strong> Actual court deadlines may differ. Always verify your response deadline directly with the issuing court.</li>
          <li><strong>This is not legal advice.</strong> AppealMyTicket<span className="text-primary">S</span>.com provides administrative assistance with citation paperwork. We are not a law firm and do not provide legal representation unless expressly stated in a separate agreement.</li>
          <li><strong>No guarantee of outcome.</strong> Court decisions are unpredictable. Past results do not guarantee future outcomes.</li>
          <li><strong>Texas citation deadlines</strong> vary by county and violation type. Consult with a licensed Texas attorney for advice specific to your situation.</li>
        </ul>
      </div>

      {/* Risk Level Key */}
      <div className="card mt-6 bg-bg-elevated">
        <h3 className="font-bold text-primary mb-4">Understanding Risk Levels</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
          {(Object.keys(RISK_LABELS) as RiskLevel[]).map(r => (
            <div key={r} className="flex items-center gap-2 p-2 bg-bg rounded">
              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: RISK_COLORS[r] }} />
              <span style={{ color: RISK_COLORS[r] }} className="font-semibold">{RISK_LABELS[r]}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-muted mb-4">Have questions about your appeal?</p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link href="/faq" className="btn-secondary">View FAQ</Link>
          <Link href="/contact" className="btn-primary">Contact Support</Link>
        </div>
      </div>
    </div>
  )
}

export default function TrackingPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-muted">Loading your appeals...</div>}>
      <TrackingContent />
    </Suspense>
  )
}
