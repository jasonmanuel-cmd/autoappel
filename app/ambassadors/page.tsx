'use client'

import { useEffect, useState } from 'react'
import { store } from '@/lib/store'
import type { Ambassador } from '@/lib/types'

const blank = (): Omit<Ambassador, 'id' | 'createdAt'> => ({
  name: '', email: '', phone: '', referralCode: '',
  cardActivated: false, masterCodeValidated: false,
  ndaSigned: false, agreementExecuted: false, w9Submitted: false,
  bankingVerified: false, treasuryApproved: false, founderApproved: false,
  active: false, referralCount: 0, compensationFrozen: false, linkDisabled: false,
})

export default function AmbassadorsPage() {
  const [ambassadors, setAmbassadors] = useState<Ambassador[]>([])
  const [form, setForm] = useState(blank())
  const [adding, setAdding] = useState(false)

  useEffect(() => { setAmbassadors(store.getAmbassadors()) }, [])

  const refresh = () => setAmbassadors(store.getAmbassadors())

  const save = () => {
    const a: Ambassador = { ...form, id: crypto.randomUUID(), createdAt: new Date().toISOString() }
    store.saveAmbassador(a)
    setForm(blank())
    setAdding(false)
    refresh()
  }

  const toggle = (a: Ambassador, key: keyof Ambassador) => {
    const updated = { ...a, [key]: !a[key as keyof Ambassador] }
    if (key === 'active') {
      const eligible = a.ndaSigned && a.agreementExecuted && a.w9Submitted &&
        a.bankingVerified && a.treasuryApproved && a.founderApproved &&
        a.cardActivated && a.masterCodeValidated
      if (!eligible && !a.active) {
        alert('Ambassador cannot be activated until all compliance requirements are met.')
        return
      }
    }
    store.saveAmbassador(updated)
    refresh()
  }

  const checks = [
    { key: 'ndaSigned' as const,           label: 'NDA Signed' },
    { key: 'agreementExecuted' as const,   label: 'Agreement Executed' },
    { key: 'w9Submitted' as const,         label: 'W-9 Submitted' },
    { key: 'cardActivated' as const,       label: '.card Activated' },
    { key: 'masterCodeValidated' as const, label: 'Master Code Validated' },
    { key: 'bankingVerified' as const,     label: 'Banking Verified' },
    { key: 'treasuryApproved' as const,    label: 'Treasury Approved' },
    { key: 'founderApproved' as const,     label: 'Founder Approved' },
  ]

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-black mb-2">Brand Ambassador System</h1>
      <p className="text-[#5b7fa6] mb-8">Houston AutoAppeal™ · Referral & Compensation Management</p>

      <div className="card mb-4 text-sm text-[#5b7fa6] border-[#1d6ef3]">
        <p className="font-semibold text-[#8aafd4]">Founder Control Notice</p>
        <p>Ambassadors cannot activate until all compliance requirements are verified. Founder may disable links, pause routing, freeze compensation, or suspend access at any time.</p>
      </div>

      <div className="flex justify-between items-center mb-4">
        <p className="text-[#5b7fa6] text-sm">{ambassadors.length} ambassador{ambassadors.length !== 1 ? 's' : ''} registered</p>
        <button onClick={() => setAdding(v => !v)} className="btn-primary text-sm py-2">
          {adding ? 'Cancel' : '+ Add Ambassador'}
        </button>
      </div>

      {adding && (
        <div className="card mb-6 space-y-3">
          <h3 className="font-bold">New Ambassador</h3>
          {(['name', 'email', 'phone', 'referralCode'] as const).map(k => (
            <div key={k}>
              <label className="label capitalize">{k.replace(/([A-Z])/g, ' $1')}</label>
              <input className="input" value={form[k]} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))} />
            </div>
          ))}
          <button onClick={save} className="btn-primary w-full">Save Ambassador</button>
        </div>
      )}

      {ambassadors.length === 0 ? (
        <div className="card text-center text-[#27415e]">No ambassadors registered yet.</div>
      ) : (
        <div className="space-y-4">
          {ambassadors.map(a => (
            <div key={a.id} className="card">
              <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
                <div>
                  <p className="font-bold text-lg">{a.name}</p>
                  <p className="text-[#5b7fa6] text-sm">{a.email} · {a.phone}</p>
                  <p className="text-[#27415e] text-xs">Referral: {a.referralCode} · {a.referralCount} referrals</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => toggle(a, 'active')}
                    className={`px-3 py-1 rounded text-xs font-bold ${a.active ? 'bg-green-700 text-green-100' : 'bg-[#1a3355] text-[#5b7fa6]'}`}
                  >
                    {a.active ? 'ACTIVE' : 'INACTIVE'}
                  </button>
                  <button
                    onClick={() => toggle(a, 'linkDisabled')}
                    className={`px-3 py-1 rounded text-xs font-bold ${a.linkDisabled ? 'bg-red-800 text-red-200' : 'bg-[#2a1010] text-[#5b7fa6]'}`}
                  >
                    {a.linkDisabled ? 'LINK DISABLED' : 'Link Active'}
                  </button>
                  <button
                    onClick={() => toggle(a, 'compensationFrozen')}
                    className={`px-3 py-1 rounded text-xs font-bold ${a.compensationFrozen ? 'bg-yellow-800 text-yellow-200' : 'bg-[#2a1010] text-[#5b7fa6]'}`}
                  >
                    {a.compensationFrozen ? '❄ FROZEN' : 'Comp Active'}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {checks.map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => toggle(a, key)}
                    className={`text-xs p-2 rounded text-left transition-colors ${
                      a[key] ? 'bg-green-900/40 text-green-300 border border-green-800' : 'bg-[#08111e] text-[#27415e] border border-[#2a1010]'
                    }`}
                  >
                    {a[key] ? '✓' : '○'} {label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
