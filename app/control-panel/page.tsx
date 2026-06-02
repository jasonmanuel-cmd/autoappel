"use client"

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { store } from '@/lib/store'
import { useAuth } from '@/lib/use-auth'
import { api } from '@/lib/api'
import type { DeploymentStatus, Citation, Ambassador } from '@/lib/types'

export default function ControlPanelPage() {
  const authStatus = useAuth('/login')
  if (authStatus !== 'authenticated') return null

  const [deployment, setDeployment] = useState<DeploymentStatus | null>(null)
  const [citations, setCitations] = useState<Citation[]>([])
  const [ambassadors, setAmbassadors] = useState<Ambassador[]>([])
  const [shutdownConfirm, setShutdownConfirm] = useState(false)
  const [tab, setTab] = useState<'overview' | 'submissions'>('overview')
  const [submissions, setSubmissions] = useState<any[]>([])
  const [loadingSubmissions, setLoadingSubmissions] = useState(false)
  const [submissionsSource, setSubmissionsSource] = useState<'server' | 'local' | null>(null)

  useEffect(() => {
    setDeployment(store.getDeployment())
    setCitations(store.getCitations())
    setAmbassadors(store.getAmbassadors())
  }, [])

  useEffect(() => {
    if (tab === 'submissions') {
      setLoadingSubmissions(true)
      fetch('/api/citations')
        .then(r => r.json())
        .then(d => {
          const serverSubs = d.data?.citations || []
          if (serverSubs.length > 0) {
            setSubmissions(serverSubs)
            setSubmissionsSource('server')
          } else {
            // Fallback: show client-side citations (localStorage / demo mode)
            const local = store.getCitations()
            setSubmissions(local.map(c => ({ id: c.id, status: c.status, createdAt: c.createdAt, data: c })))
            setSubmissionsSource('local')
          }
          setLoadingSubmissions(false)
        })
        .catch(() => {
          const local = store.getCitations()
          setSubmissions(local.map(c => ({ id: c.id, status: c.status, createdAt: c.createdAt, data: c })))
          setSubmissionsSource('local')
          setLoadingSubmissions(false)
        })
    }
  }, [tab])

  const handleStatus = async (id: string, status: string) => {
    try {
      await fetch(`/api/citations/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) })
      const res = await fetch('/api/citations')
      const d = await res.json()
      setSubmissions(d.data?.citations || [])
    } catch { /* ignore */ }
  }

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
      <p className="text-muted mb-1">Marc Bouvier · LAGNAF™ network LLC · Houston</p>
      <p className="text-xs text-subtle mb-8">Internal backend administration for deployment, routing, security, and case operations.</p>

      <div className="flex gap-2 flex-wrap mb-8">
        <button onClick={() => setTab('overview')} className={`text-xs py-2 px-4 rounded-lg font-semibold transition-colors ${tab === 'overview' ? 'bg-primary text-white' : 'btn-secondary text-xs'}`}>Overview</button>
        <button onClick={() => setTab('submissions')} className={`text-xs py-2 px-4 rounded-lg font-semibold transition-colors ${tab === 'submissions' ? 'bg-primary text-white' : 'btn-secondary text-xs'}`}>Submissions</button>
        <Link href="/ambassadors" className="btn-secondary text-xs py-2">Ambassadors</Link>
        <Link href="/treasury" className="btn-secondary text-xs py-2">Treasury</Link>
        <Link href="/red-vault" className="btn-secondary text-xs py-2">Red Vault</Link>
        <Link href="/qa" className="btn-secondary text-xs py-2">QA</Link>
      </div>

      {tab === 'overview' ? (
        <>

      {deployment.globalShutdown && (
        <div className="bg-danger/20 border border-danger/50 rounded-xl p-4 mb-6 text-center">
          <p className="font-black text-danger text-lg">🛑 EMERGENCY SHUTDOWN ACTIVE</p>
          <p className="text-danger/70 text-sm">All intake and ambassador systems disabled. Founder re-authorization required to restore.</p>
          <button onClick={() => save({ ...deployment, globalShutdown: false, liveStatus: 'staging' })} className="btn-primary mt-3 text-sm">
            Restore Operations
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="card text-center">
          <div className="text-3xl font-black text-white">{citations.length}</div>
          <div className="text-muted text-sm">Total Citations</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-black text-danger">{riskCounts.red}</div>
          <div className="text-muted text-sm">Critical Risk</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-black text-orange">{riskCounts.orange}</div>
          <div className="text-muted text-sm">High Urgency</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-black text-primary">{ambassadors.filter(a => a.active).length}</div>
          <div className="text-muted text-sm">Active Ambassadors</div>
        </div>
      </div>

      <div className="card mb-6">
        <h2 className="font-bold text-lg mb-4">System Controls</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {controls.map(({ label, key }) => {
            const active = deployment[key] as boolean
            return (
              <div key={key} className="flex items-center justify-between p-3 bg-bg rounded-lg">
                <span className="text-sm font-medium">{label}</span>
                <button
                  onClick={() => toggle(key)}
                  className={`px-4 py-1.5 rounded text-xs font-bold transition-colors ${
                    active ? 'bg-success/30 hover:bg-success/50 text-success' : 'bg-border hover:bg-primary text-muted hover:text-white'
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
            <p className="text-subtle">City</p>
            <p className="font-medium">{deployment.city}</p>
          </div>
          <div>
            <p className="text-subtle">Engineer</p>
            <p className="font-medium">{deployment.engineer}</p>
          </div>
          <div>
            <p className="text-subtle">Live Status</p>
            <p className="font-medium capitalize">{deployment.liveStatus.replace('_', ' ')}</p>
          </div>
          <div>
            <p className="text-subtle">QA Score</p>
            <p className={`font-bold text-lg ${deployment.qaScore >= 90 ? 'text-success' : 'text-warning'}`}>
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
                deployment.liveStatus === s ? 'bg-primary text-white' : 'btn-secondary text-xs'
              }`}
              disabled={s === 'live' && (!deployment.founderApprovalGranted || deployment.qaScore < 90)}
            >
              {s === 'live' ? '🔴 Go Live (90+ QA required)' : s.replace('_', ' ').toUpperCase()}
            </button>
          ))}
          <button
            onClick={() => save({ ...deployment, founderApprovalGranted: !deployment.founderApprovalGranted })}
            className={`px-3 py-1.5 rounded text-xs font-bold ${deployment.founderApprovalGranted ? 'bg-success/30 text-success' : 'bg-border text-muted'}`}
          >
            Founder Approval: {deployment.founderApprovalGranted ? 'GRANTED' : 'PENDING'}
          </button>
        </div>
        <p className="text-xs text-subtle mt-3">
          ⚠ Founder controls all hosting, DNS, production credentials, and final go-live authorization.
        </p>
      </div>

      <div className="card border-danger/30">
        <h2 className="font-bold text-danger mb-2">Emergency Shutdown</h2>
        <p className="text-muted text-sm mb-4">
          Immediately disables all intake, ambassador, and routing systems. Requires Founder re-authorization to restore.
        </p>
        {shutdownConfirm ? (
          <div className="flex gap-3">
            <button onClick={emergencyShutdown} className="bg-danger hover:bg-danger/80 text-white font-bold py-2 px-6 rounded-lg">
              CONFIRM SHUTDOWN
            </button>
            <button onClick={() => setShutdownConfirm(false)} className="btn-secondary">Cancel</button>
          </div>
        ) : (
          <button onClick={emergencyShutdown} className="bg-danger/20 hover:bg-danger/40 text-danger font-bold py-2 px-6 rounded-lg transition-colors">
            🛑 Trigger Emergency Shutdown
          </button>
        )}
      </div>
        </>
      ) : (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg">Inbound Submissions</h2>
            {submissions.length > 0 && <span className="text-xs text-muted">{submissions.filter(s => s.status === 'new').length} new</span>}
          </div>

          {loadingSubmissions ? (
            <p className="text-muted text-sm py-8 text-center">Loading submissions...</p>
          ) : submissions.length === 0 ? (
            <div className="text-center py-8 text-muted">
              <p className="mb-2">No submissions yet.</p>
              <p className="text-xs text-subtle">Submissions from the intake form will appear here. In demo mode, data is stored locally in your browser.</p>
            </div>
          ) : (
            <>
              {submissionsSource === 'local' && (
                <div className="bg-warning/10 border border-warning/30 rounded-lg p-3 mb-4 text-xs text-warning">
                  ℹ️ Showing locally stored submissions (demo mode). Connect Supabase for persistent server-side storage.
                </div>
              )}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-xs text-subtle uppercase">
                      <th className="text-left py-2 pr-3">Name</th>
                      <th className="text-left py-2 pr-3">Citation</th>
                      <th className="text-left py-2 pr-3">County</th>
                      <th className="text-left py-2 pr-3">Violation</th>
                      <th className="text-left py-2 pr-3">Status</th>
                      <th className="text-left py-2 pr-3">Submitted</th>
                      <th className="text-right py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.map(s => (
                      <tr key={s.id} className="border-b border-border hover:bg-bg-elevated/50">
                        <td className="py-3 pr-3 text-text font-medium">{s.data?.firstName} {s.data?.lastName}</td>
                        <td className="py-3 pr-3 text-muted font-mono text-xs">{s.data?.citationNumber}</td>
                        <td className="py-3 pr-3 text-muted">{s.data?.county}</td>
                        <td className="py-3 pr-3 text-muted">{s.data?.violationType}</td>
                        <td className="py-3 pr-3">
                          <span className={`text-xs font-semibold px-2 py-1 rounded ${
                            s.status === 'new' ? 'bg-primary/20 text-primary' :
                            s.status === 'in_review' ? 'bg-primary/20 text-primary' :
                            s.status === 'accepted' ? 'bg-success/20 text-success' :
                            s.status === 'pending' ? 'bg-primary/20 text-primary' :
                            s.status === 'rejected' ? 'bg-danger/20 text-danger' :
                            s.status === 'flagged' ? 'bg-warning/20 text-warning' :
                            s.status === 'appealing' ? 'bg-orange/20 text-orange' :
                            s.status === 'resolved' ? 'bg-success/20 text-success' :
                            s.status === 'expired' ? 'bg-gray-700 text-gray-400' :
                            'bg-bg-elevated text-muted'
                          }`}>{s.status.replace(/_/g, ' ')}</span>
                        </td>
                        <td className="py-3 pr-3 text-muted text-xs">{new Date(s.createdAt).toLocaleDateString()}</td>
                        <td className="py-3 text-right">
                          <div className="flex gap-1 justify-end">
                            {['new', 'pending', 'in_review'].includes(s.status) && <button onClick={() => handleStatus(s.id, 'in_review')} className="bg-primary/20 hover:bg-primary/30 text-primary text-xs px-2 py-1 rounded">Review</button>}
                            {['new', 'pending', 'in_review', 'appealing'].includes(s.status) && <button onClick={() => handleStatus(s.id, 'accepted')} className="bg-success/20 hover:bg-success/30 text-success text-xs px-2 py-1 rounded">Accept</button>}
                            {['new', 'pending', 'in_review', 'appealing'].includes(s.status) && <button onClick={() => handleStatus(s.id, 'rejected')} className="bg-danger/20 hover:bg-danger/30 text-danger text-xs px-2 py-1 rounded">Reject</button>}
                            <button onClick={() => handleStatus(s.id, s.status === 'flagged' ? 'pending' : 'flagged')} className="bg-warning/20 hover:bg-warning/30 text-warning text-xs px-2 py-1 rounded">{s.status === 'flagged' ? 'Unflag' : 'Flag'}</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
