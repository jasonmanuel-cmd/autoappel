'use client'

import { useEffect, useState } from 'react'
import { store } from '@/lib/store'
import { useAuth } from '@/lib/use-auth'
import type { TreasuryProfile } from '@/lib/types'

const blank = (): Omit<TreasuryProfile, 'id' | 'createdAt'> => ({
  entityName: '',
  ndaSigned: false,
  agreementExecuted: false,
  w9Submitted: false,
  bankingMethod: 'zelle',
  bankingVerified: false,
  founderAuthorized: false,
  cardActivated: false,
  masterCodeValidated: false,
})

export default function TreasuryPage() {
  const authStatus = useAuth()
  if (authStatus !== 'authenticated') return null

  const [profiles, setProfiles] = useState<TreasuryProfile[]>([])
  const [form, setForm] = useState(blank())
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    setProfiles(store.getTreasuryProfiles())
  }, [])

  const refresh = () => setProfiles(store.getTreasuryProfiles())

  const save = () => {
    store.saveTreasuryProfile({ ...form, id: crypto.randomUUID(), createdAt: new Date().toISOString() })
    setForm(blank())
    setAdding(false)
    refresh()
  }

  const toggle = (p: TreasuryProfile, key: keyof TreasuryProfile) => {
    store.saveTreasuryProfile({ ...p, [key]: !p[key as keyof TreasuryProfile] })
    refresh()
  }

  const checks = [
    { key: 'ndaSigned' as const,           label: 'NDA Signed' },
    { key: 'agreementExecuted' as const,   label: 'Agreement Executed' },
    { key: 'w9Submitted' as const,         label: 'W-9 Submitted' },
    { key: 'cardActivated' as const,       label: '.card Activated' },
    { key: 'masterCodeValidated' as const, label: 'Master Code Validated' },
    { key: 'bankingVerified' as const,     label: 'Banking Verified' },
    { key: 'founderAuthorized' as const,   label: 'Founder Authorized' },
  ]

  const eligible = (p: TreasuryProfile) =>
    p.ndaSigned && p.agreementExecuted && p.w9Submitted &&
    p.bankingVerified && p.founderAuthorized && p.cardActivated && p.masterCodeValidated

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-black mb-2">Treasury & Banking</h1>
      <p className="text-muted mb-8">AppealMyTicket<span className="text-primary">S</span>.com · Compensation Verification</p>

      <div className="card mb-4 text-sm text-muted border-primary">
        <p className="font-semibold text-muted-fg mb-1">Compensation Release Requirements</p>
        <p>No compensation may be released without explicit Founder authorization. Approved methods: Zelle · ACH Transfer · Direct Bank Transfer · Approved Institutional Banking Channels.</p>
      </div>

      <div className="flex justify-between items-center mb-4">
        <p className="text-muted text-sm">{profiles.length} treasury profile{profiles.length !== 1 ? 's' : ''}</p>
        <button onClick={() => setAdding(v => !v)} className="btn-primary text-sm py-2">
          {adding ? 'Cancel' : '+ Add Profile'}
        </button>
      </div>

      {adding && (
        <div className="card mb-6 space-y-3">
          <h3 className="font-bold">New Treasury Profile</h3>
          <div>
            <label className="label">Entity Name</label>
            <input className="input" value={form.entityName} onChange={e => setForm(f => ({ ...f, entityName: e.target.value }))} />
          </div>
          <div>
            <label className="label">Banking Method</label>
            <select className="input" value={form.bankingMethod} onChange={e => setForm(f => ({ ...f, bankingMethod: e.target.value as TreasuryProfile['bankingMethod'] }))}>
              <option value="zelle">Zelle</option>
              <option value="ach">ACH Transfer</option>
              <option value="direct">Direct Bank Transfer</option>
              <option value="institutional">Approved Institutional</option>
            </select>
          </div>
          <button onClick={save} className="btn-primary w-full">Save Profile</button>
        </div>
      )}

      {profiles.length === 0 ? (
          <div className="card text-center text-subtle">No treasury profiles yet.</div>
      ) : (
        <div className="space-y-4">
          {profiles.map(p => (
            <div key={p.id} className="card">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="font-bold text-lg">{p.entityName}</p>
                  <p className="text-muted text-sm capitalize">Method: {p.bankingMethod.replace('_', ' ')}</p>
                </div>
                <div className={`px-3 py-1 rounded text-xs font-bold ${eligible(p) ? 'bg-green-800 text-green-100' : 'bg-border text-muted'}`}>
                  {eligible(p) ? '✓ ELIGIBLE' : 'PENDING'}
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {checks.map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => toggle(p, key)}
                    className={`text-xs p-2 rounded text-left transition-colors ${
                      p[key] ? 'bg-green-900/40 text-green-300 border border-green-800' : 'bg-bg-elevated text-subtle border border-primary/10'
                    }`}
                  >
                    {p[key] ? '✓' : '○'} {label}
                  </button>
                ))}
              </div>
              {!p.founderAuthorized && (
                <p className="text-xs text-primary mt-3">⚠ Founder authorization required before any compensation release.</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
