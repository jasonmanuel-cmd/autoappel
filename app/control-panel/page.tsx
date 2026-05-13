"use client"

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { store } from '@/lib/store'
import type { DeploymentStatus, Citation, Ambassador } from '@/lib/types'

export default function ControlPanelPage() {
  const [deployment, setDeployment] = useState<DeploymentStatus | null>(null)
  const [citations, setCitations] = useState<Citation[]>([])
  const [ambassadors, setAmbassadors] = useState<Ambassador[]>([])
  const [shutdownConfirm, setShutdownConfirm] = useState(false)

  useEffect(() => {
    setDeployment(store.getDeployment())
    setCitations(store.getCitations())
    setAmbassadors(store.getAmbassadors())
  }, [])

  if (!deployment) return null

  const save = (d: DeploymentStatus) => {
    store.saveDeployment(d)
    setDeployment({ ...d })
  }

  const toggle = (key: keyof DeploymentStatus) => {
    save({ ...deployment, [key]: !deployment[key as keyof DeploymentStatus] })
  }

  const emergencyShutdown = () => {
    if (!shutdownConfirm) {
      setShutdownConfirm(true)
      return
    }
    const d: DeploymentStatus = {
      ...deployment,
      globalShutdown: true,
      liveStatus: 'shutdown',
      founderApprovalGranted: false,
      ambassadorSystemActive: false,
      citationIntakeActive: false,
    }
    save(d)
    store.addAlert({ type: 'deployment_event', description: 'EMERGENCY SHUTDOWN triggered by Founder.', resolved: false })
    setShutdownConfirm(false)
  }

  const riskCounts = {
    red: citations.filter(c => c.riskLevel === 'red').length,
    orange: citations.filter(c => c.riskLevel === 'orange').length,
    yellow: citations.filter(c => c.riskLevel === 'yellow').length,
    expired: citations.filter(c => c.riskLevel === 'expired').length,
  }

  const controls = [
    { label: 'Ambassador System', key: 'ambassadorSystemActive' as const },
    { label: 'Citation Intake', key: 'citationIntakeActive' as const },
    { label: 'Countdown Engine', key: 'countdownEngineActive' as const },
    { label: 'Treasury System', key: 'treasurySystemActive' as const },
    { label: 'Banking Verification', key: 'bankingVerificationActive' as const },
    { label: 'Red Vault™ Monitoring', key: 'redVaultActive' as const },
    { label: 'Audit Monitoring', key: 'auditMonitoringActive' as const },
    { label: 'Control Panel Access', key: 'founderDashboardActive' as const },
  ]

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-3xl">⚡</span>
        <h1 className="text-3xl font-black">Control Panel</h1>
      </div>
      <p className="text-[#5b7fa6] mb-1">Marc Bouvier · LAGNAF™ network LLC · Houston</p>
      <p className="text-xs text-[#27415e] mb-8">Internal backend administration for deployment, routing, security, and case operations.</p>

      <div className="flex gap-2 flex-wrap mb-8">
        <Link href="/control-panel" className="btn-secondary text-xs py-2">Overview</Link>
        <Link href="/ambassadors" className="btn-secondary text-xs py-2">Ambassadors</Link>
        <Link href="/treasury" className="btn-secondary text-xs py-2">Treasury</Link>
        <Link href="/red-vault" className="btn-secondary text-xs py-2">Red Vault</Link>
        <Link href="/qa" className="btn-secondary text-xs py-2">QA</Link>
      </div>

      {deployment.globalShutdown && (
        <div className="bg-red-900 border border-red-500 rounded-xl p-4 mb-6 text-center">
          <p className="font-black text-red-300 text-lg">🛑 EMERGENCY SHUTDOWN ACTIVE</p>
          <p className="text-red-400 text-sm">All intake and ambassador systems disabled. Founder re-authorization required to restore.</p>
          <button onClick={() => save({ ...deployment, globalShutdown: false, liveStatus: 'staging' })} className="btn-primary mt-3 text-sm">
            Restore Operations
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="card text-center">
          <div className="text-3xl font-black text-white">{citations.length}</div>
          <div className="text-[#5b7fa6] text-sm">Total Citations</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-black text-red-400">{riskCounts.red}</div>
          <div className="text-[#5b7fa6] text-sm">Critical Risk</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-black text-orange-400">{riskCounts.orange}</div>
          <div className="text-[#5b7fa6] text-sm">High Urgency</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-black text-[#8aafd4]">{ambassadors.filter(a => a.active).length}</div>
          <div className="text-[#5b7fa6] text-sm">Active Ambassadors</div>
        </div>
      </div>

      <div className="card mb-6">
        <h2 className="font-bold text-lg mb-4">System Controls</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {controls.map(({ label, key }) => {
            const active = deployment[key] as boolean
            return (
              <div key={key} className="flex items-center justify-between p-3 bg-[#08111e] rounded-lg">
                <span className="text-sm font-medium">{label}</span>
                <button
                  onClick={() => toggle(key)}
                  className={`px-4 py-1.5 rounded text-xs font-bold transition-colors ${
                    active ? 'bg-green-700 hover:bg-green-600 text-green-100' : 'bg-[#1a3355] hover:bg-[#1d6ef3] text-[#5b7fa6] hover:text-white'
                  }`}
                >
                  {active ? 'ACTIVE' : 'DISABLED'}
                </button>
              </div>
            )
          })}
        </div>
      </div>

      <div className="card mb-6">
        <h2 className="font-bold text-lg mb-4">Deployment Status</h2>
        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
          <div>
            <p className="text-[#27415e]">City</p>
            <p className="font-medium">{deployment.city}</p>
          </div>
          <div>
            <p className="text-[#27415e]">Engineer</p>
            <p className="font-medium">{deployment.engineer}</p>
          </div>
          <div>
            <p className="text-[#27415e]">Live Status</p>
            <p className="font-medium capitalize">{deployment.liveStatus.replace('_', ' ')}</p>
          </div>
          <div>
            <p className="text-[#27415e]">QA Score</p>
            <p className={`font-bold text-lg ${deployment.qaScore >= 90 ? 'text-green-400' : 'text-yellow-400'}`}>
              {deployment.qaScore}/100
            </p>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          {(['staging', 'pending_approval', 'live'] as const).map(s => (
            <button
              key={s}
              onClick={() => save({ ...deployment, liveStatus: s })}
              className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${
                deployment.liveStatus === s ? 'bg-[#1d6ef3] text-white' : 'btn-secondary text-xs'
              }`}
              disabled={s === 'live' && (!deployment.founderApprovalGranted || deployment.qaScore < 90)}
            >
              {s === 'live' ? '🔴 Go Live (90+ QA required)' : s.replace('_', ' ').toUpperCase()}
            </button>
          ))}
          <button
            onClick={() => save({ ...deployment, founderApprovalGranted: !deployment.founderApprovalGranted })}
            className={`px-3 py-1.5 rounded text-xs font-bold ${deployment.founderApprovalGranted ? 'bg-green-700 text-green-100' : 'bg-[#1a3355] text-[#5b7fa6]'}`}
          >
            Founder Approval: {deployment.founderApprovalGranted ? 'GRANTED' : 'PENDING'}
          </button>
        </div>
        <p className="text-xs text-[#27415e] mt-3">
          ⚠ Founder controls all hosting, DNS, production credentials, and final go-live authorization.
        </p>
      </div>

      <div className="card border-red-900">
        <h2 className="font-bold text-red-400 mb-2">Emergency Shutdown</h2>
        <p className="text-[#5b7fa6] text-sm mb-4">
          Immediately disables all intake, ambassador, and routing systems. Requires Founder re-authorization to restore.
        </p>
        {shutdownConfirm ? (
          <div className="flex gap-3">
            <button onClick={emergencyShutdown} className="bg-red-700 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg">
              CONFIRM SHUTDOWN
            </button>
            <button onClick={() => setShutdownConfirm(false)} className="btn-secondary">Cancel</button>
          </div>
        ) : (
          <button onClick={emergencyShutdown} className="bg-red-900 hover:bg-red-700 text-red-300 font-bold py-2 px-6 rounded-lg transition-colors">
            🛑 Trigger Emergency Shutdown
          </button>
        )}
      </div>
    </div>
  )
}
