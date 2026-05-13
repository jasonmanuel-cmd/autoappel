'use client'

import { useEffect, useState } from 'react'
import { store } from '@/lib/store'
import type { QAItem, DeploymentStatus } from '@/lib/types'

const CATEGORIES = ['Landing Page', 'Intake Funnel', 'Countdown Engine', 'Red Vault™', 'Founder Dashboard™', 'Ambassador System', 'Treasury', 'Security']

export default function QAPage() {
  const [items, setItems] = useState<QAItem[]>([])
  const [deployment, setDeployment] = useState<DeploymentStatus | null>(null)

  useEffect(() => {
    setItems(store.getQAItems())
    setDeployment(store.getDeployment())
  }, [])

  const toggle = (id: string) => {
    const updated = items.map(i => i.id === id ? { ...i, passed: !i.passed } : i)
    store.saveQAItems(updated)
    const score = store.computeScore(updated)
    if (deployment) {
      const d = { ...deployment, qaScore: score }
      store.saveDeployment(d)
      setDeployment(d)
    }
    setItems(updated)
  }

  const score = store.computeScore(items)
  const passed = items.filter(i => i.passed).length
  const total = items.length

  const scoreColor = score >= 90 ? '#4ade80' : score >= 70 ? '#facc15' : '#f87171'

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-black mb-2">QA Scorecard</h1>
      <p className="text-[#5b7fa6] mb-8">Apollo QA 90-Point Launch Law · Houston AutoAppeal™</p>

      {/* Score header */}
      <div className="card mb-6 text-center">
        <div className="text-6xl font-black mb-2" style={{ color: scoreColor }}>{score}</div>
        <div className="text-[#5b7fa6] mb-3">{passed}/{total} items passed</div>
        {score >= 90 ? (
          <div className="inline-block bg-green-900 text-green-300 px-4 py-2 rounded-full text-sm font-bold">
            ✓ MEETS GO-LIVE THRESHOLD (90+)
          </div>
        ) : (
          <div className="inline-block bg-[#1a3355] text-[#1d6ef3] px-4 py-2 rounded-full text-sm font-bold">
            ✗ BELOW 90 — CANNOT GO LIVE
          </div>
        )}
        {score === 90 && (
          <p className="text-xs text-yellow-400 mt-3">
            Score of exactly 90 requires written proposal, correction roadmap, completion timeline, and Founder approval.
          </p>
        )}
      </div>

      {/* Items by category */}
      {CATEGORIES.map(cat => {
        const catItems = items.filter(i => i.category === cat)
        if (catItems.length === 0) return null
        const catPassed = catItems.filter(i => i.passed).length
        return (
          <div key={cat} className="card mb-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold">{cat}</h3>
              <span className="text-sm text-[#5b7fa6]">{catPassed}/{catItems.length}</span>
            </div>
            <div className="space-y-2">
              {catItems.map(item => (
                <div
                  key={item.id}
                  onClick={() => toggle(item.id)}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    item.passed ? 'bg-green-900/30 border border-green-800' : 'bg-[#08111e] border border-[#2a1010] hover:border-[#1a3355]'
                  }`}
                >
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 ${
                    item.passed ? 'bg-green-500 border-green-500' : 'border-[#1a3355]'
                  }`}>
                    {item.passed && <span className="text-white text-xs">✓</span>}
                  </div>
                  <span className="text-sm flex-1">{item.item}</span>
                  <span className="text-xs text-[#27415e]">w{item.weight}</span>
                </div>
              ))}
            </div>
          </div>
        )
      })}

      <div className="card border-[#1d6ef3] text-sm text-[#5b7fa6]">
        <p className="font-semibold text-[#8aafd4] mb-1">Go-Live Requirements</p>
        <ul className="space-y-1">
          <li>• Minimum score of 90 required before go-live</li>
          <li>• Score of exactly 90 requires written proposal + correction roadmap + Founder approval</li>
          <li>• Founder controls all production domains, hosting, DNS, and final authorization</li>
          <li>• No deployment may go live below 90-point QA score</li>
        </ul>
      </div>
    </div>
  )
}
