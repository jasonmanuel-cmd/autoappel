'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { store } from '@/lib/store'
import { api } from '@/lib/api'
import type { Citation } from '@/lib/types'

export default function TestDashboardPage() {
  const router = useRouter()
  const [demo, setDemo] = useState(false)
  const [citations, setCitations] = useState<Citation[]>([])
  const [seeded, setSeeded] = useState(false)
  const [logs, setLogs] = useState<string[]>([])
  const [step, setStep] = useState(0)

  useEffect(() => {
    const isDemo = store.getDemoMode()
    setDemo(isDemo)
    if (!isDemo) return
    refresh()
  }, [])

  const refresh = () => {
    setCitations(store.getCitations())
    setSeeded(store.getCitations().length > 0)
  }

  const log = (msg: string) => setLogs(p => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...p].slice(0, 20))

  const handleSeed = () => {
    store.seedDemoData()
    refresh()
    log('Seeded demo data: 5 citations, 2 ambassadors, 1 treasury profile')
  }

  const handleReset = () => {
    store.logout()
    store.setDemoMode(true)
    refresh()
    setLogs([])
    setStep(0)
    log('All data cleared. Ready to re-seed.')
  }

  const runGuidedFlow = async () => {
    setStep(0)
    log('Starting guided test flow...')

    await new Promise(r => setTimeout(r, 500))
    setStep(1)
    log('Step 1: Seeding demo data')
    store.seedDemoData()
    refresh()

    await new Promise(r => setTimeout(r, 500))
    setStep(2)
    log('Step 2: Citations created with various risk levels (green, orange, red, expired, resolved)')

    await new Promise(r => setTimeout(r, 500))
    setStep(3)
    log('Step 3: Ambassadors created (1 active, 1 pending compliance)')

    await new Promise(r => setTimeout(r, 500))
    setStep(4)
    log('Step 4: Treasury profile created with all checks passed')

    await new Promise(r => setTimeout(r, 500))
    setStep(5)
    log('Step 5: QA score calculated and deployment updated')

    await new Promise(r => setTimeout(r, 500))
    setStep(6)
    log('✓ Demo fully initialized. Navigate to any section to test.')
  }

  const runIntakeTest = () => {
    log('Opening intake form...')
    window.open('/intake', '_blank')
  }

  const runTrackTest = () => {
    log('Opening tracking page...')
    window.open('/track', '_blank')
  }

  const runControlPanel = () => {
    log('Opening control panel...')
    window.open('/control-panel', '_blank')
  }

  const runRedVault = () => {
    log('Opening Red Vault...')
    store.addAlert({ type: 'deployment_event', description: 'Demo test alert — monitoring system active', resolved: false })
    log('Created test alert in Red Vault')
    window.open('/red-vault', '_blank')
  }

  if (!demo) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--gradient-bg)' }}>
        <div className="card text-center max-w-md">
          <h1 className="text-2xl font-black mb-3">Demo Mode Required</h1>
          <p className="text-muted mb-6">You need to log in with the master password to access the test dashboard.</p>
          <Link href="/login" className="btn-primary">Go to Login</Link>
        </div>
      </div>
    )
  }

  const STATUS_STEPS = [
    { label: 'Citations Seeded', description: '5 test citations at different risk levels' },
    { label: 'Ambassadors Created', description: '2 ambassador profiles for referral testing' },
    { label: 'Treasury Configured', description: '1 profile with banking verification' },
    { label: 'QA Scored', description: 'Random QA pass/fail for deployment gating' },
    { label: 'Ready to Test', description: 'Navigate to any module below' },
  ]

  const riskBreakdown = {
    green: citations.filter(c => c.riskLevel === 'green').length,
    orange: citations.filter(c => c.riskLevel === 'orange').length,
    red: citations.filter(c => c.riskLevel === 'red').length,
    expired: citations.filter(c => c.riskLevel === 'expired').length,
    resolved: citations.filter(c => c.status === 'resolved').length,
  }

  return (
    <div className="min-h-screen py-12 px-4" style={{ background: 'var(--gradient-bg)' }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-black mb-1">Test Dashboard</h1>
            <p className="text-muted text-sm">Prototype testing & demo mode controls</p>
          </div>
          <button
            onClick={() => { store.logout(); window.location.href = '/' }}
            className="btn-secondary text-sm py-2"
          >
            Exit Demo
          </button>
        </div>

        {/* Credentials Panel */}
        <div className="card bg-warning/5 border border-warning/20 mb-6">
          <h2 className="font-bold text-sm mb-3 text-warning">🔑 Demo Access Credentials</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-bg rounded-lg p-3">
              <p className="text-subtle font-semibold mb-1">Master Password</p>
              <p className="font-mono text-text">demo-2026</p>
              <p className="text-subtle mt-1">Use at <Link href="/login" className="text-primary underline">/login</Link></p>
            </div>
            <div className="bg-bg rounded-lg p-3">
              <p className="text-subtle font-semibold mb-1">Test Card (Visa)</p>
              <p className="font-mono text-text">4242 4242 4242 4242</p>
              <p className="text-subtle mt-1">Exp 12/28 • CVC 123</p>
            </div>
            <div className="bg-bg rounded-lg p-3">
              <p className="text-subtle font-semibold mb-1">Ambassador Codes</p>
              <p className="font-mono text-text">ROBERT-HOU</p>
              <p className="font-mono text-text">LISA-HOU</p>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex gap-2 flex-wrap mb-8">
          <Link href="/" className="btn-secondary text-xs py-2">Home</Link>
          <Link href="/intake" className="btn-secondary text-xs py-2">Intake Form</Link>
          <Link href="/track" className="btn-secondary text-xs py-2">Track Appeals</Link>
          <Link href="/control-panel" className="btn-secondary text-xs py-2">Control Panel</Link>
          <Link href="/ambassadors" className="btn-secondary text-xs py-2">Ambassadors</Link>
          <Link href="/treasury" className="btn-secondary text-xs py-2">Treasury</Link>
          <Link href="/red-vault" className="btn-secondary text-xs py-2">Red Vault</Link>
          <Link href="/qa" className="btn-secondary text-xs py-2">QA Scorecard</Link>
          <Link href="/demo-payment" className="btn-secondary text-xs py-2">Payment Simulator</Link>
          <Link href="/faq" className="btn-secondary text-xs py-2">FAQ</Link>
          <Link href="/contact" className="btn-secondary text-xs py-2">Contact</Link>
        </div>

        {/* Data Status */}
        <div className="card mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg">Demo Data</h2>
            <div className="flex gap-2">
              <button onClick={handleSeed} className="btn-primary text-xs py-2">
                Seed Demo Data
              </button>
              <button onClick={handleReset} className="bg-danger/20 hover:bg-danger/30 text-danger text-xs font-bold py-2 px-4 rounded-lg transition-colors">
                Reset All
              </button>
            </div>
          </div>

          {!seeded ? (
            <div className="text-center py-8 text-muted">
              <p className="mb-2">No demo data loaded.</p>
              <p className="text-xs text-subtle">Click &quot;Seed Demo Data&quot; or run the guided flow to populate the system.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-center">
              <div className="bg-bg-elevated rounded-lg p-3">
                <div className="text-2xl font-black text-primary">{citations.length}</div>
                <div className="text-xs text-muted">Total Citations</div>
              </div>
              <div className="bg-bg-elevated rounded-lg p-3">
                <div className="text-2xl font-black text-success">{riskBreakdown.green}</div>
                <div className="text-xs text-muted">Safe (Green)</div>
              </div>
              <div className="bg-bg-elevated rounded-lg p-3">
                <div className="text-2xl font-black text-orange">{riskBreakdown.orange}</div>
                <div className="text-xs text-muted">Urgent (Orange)</div>
              </div>
              <div className="bg-bg-elevated rounded-lg p-3">
                <div className="text-2xl font-black text-danger">{riskBreakdown.red}</div>
                <div className="text-xs text-muted">Critical (Red)</div>
              </div>
              <div className="bg-bg-elevated rounded-lg p-3">
                <div className="text-2xl font-black text-subtle">{riskBreakdown.expired + riskBreakdown.resolved}</div>
                <div className="text-xs text-muted">Expired/Resolved</div>
              </div>
            </div>
          )}
        </div>

        {/* Guided Test Flow */}
        <div className="card mb-6">
          <h2 className="font-bold text-lg mb-4">Guided Test Flow</h2>

          {step === 0 ? (
            <div className="text-center py-6">
              <p className="text-muted mb-4">Run the full demo setup to populate the system with test data and verify all modules.</p>
              <button onClick={runGuidedFlow} className="btn-primary">
                ▶ Start Guided Flow
              </button>
            </div>
          ) : (
            <div className="space-y-3 mb-4">
              {STATUS_STEPS.map((s, i) => (
                <div key={i} className={`flex items-start gap-3 p-3 rounded-lg ${step > i ? 'bg-success/10 border border-success/20' : step === i ? 'bg-primary/10 border border-primary/30' : 'bg-bg-elevated border border-border'}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${step > i ? 'bg-success text-white' : step === i ? 'bg-primary text-white' : 'bg-border text-muted'}`}>
                    {step > i ? '✓' : i + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{s.label}</p>
                    <p className="text-xs text-muted">{s.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {step === 6 && (
            <div className="bg-success/10 border border-success/20 rounded-lg p-4 text-center">
              <p className="text-success font-bold mb-2">✓ Demo Ready — System Populated</p>
              <p className="text-muted text-sm mb-4">All modules are seeded with test data. Use the module links above to explore.</p>
              <div className="flex gap-2 justify-center flex-wrap">
                <button onClick={runIntakeTest} className="btn-primary text-sm">Test Intake</button>
                <button onClick={runTrackTest} className="btn-secondary text-sm">Test Tracking</button>
                <button onClick={runControlPanel} className="btn-secondary text-sm">Control Panel</button>
                <button onClick={runRedVault} className="btn-secondary text-sm">Red Vault</button>
                <button onClick={() => window.open('/demo-payment', '_blank')} className="btn-secondary text-sm">Payment Demo</button>
              </div>
            </div>
          )}
        </div>

        {/* Quick Module Tests */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="card">
            <h3 className="font-bold mb-2">🧪 Intake Funnel</h3>
            <p className="text-muted text-xs mb-3">Test the multi-step citation submission form.</p>
            <button onClick={runIntakeTest} className="btn-primary text-sm py-2">Open Intake</button>
          </div>
          <div className="card">
            <h3 className="font-bold mb-2">📊 Tracking & Countdown</h3>
            <p className="text-muted text-xs mb-3">View seeded citations with risk levels and deadlines.</p>
            <button onClick={runTrackTest} className="btn-primary text-sm py-2">Open Tracking</button>
          </div>
          <div className="card">
            <h3 className="font-bold mb-2">⚡ Control Panel</h3>
            <p className="text-muted text-xs mb-3">System toggles, deployment status, emergency shutdown.</p>
            <button onClick={runControlPanel} className="btn-primary text-sm py-2">Open Panel</button>
          </div>
          <div className="card">
            <h3 className="font-bold mb-2">🔴 Red Vault</h3>
            <p className="text-muted text-xs mb-3">Security monitoring, alerts, audit log.</p>
            <button onClick={runRedVault} className="btn-primary text-sm py-2">Open Vault</button>
          </div>
          <div className="card">
            <h3 className="font-bold mb-2">💳 Payment Simulator</h3>
            <p className="text-muted text-xs mb-3">Simulated Stripe checkout with success/failure flows.</p>
            <button onClick={() => window.open('/demo-payment', '_blank')} className="btn-primary text-sm py-2">Open Payment</button>
          </div>
        </div>

        {/* Activity Log */}
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-lg">Activity Log</h2>
            <button
              onClick={async () => {
                log('Mock API: sending email...')
                const result = await api.sendConfirmationEmail('demo@test.com', 'Test email from demo dashboard')
                log(`Mock API: email sent (${result.data?.messageId || 'failed'})`)
              }}
              className="bg-primary/20 hover:bg-primary/30 text-primary text-xs font-bold py-1.5 px-3 rounded-lg transition-colors"
            >
              Test Mock API
            </button>
          </div>
          {logs.length === 0 ? (
            <p className="text-subtle text-sm">No activity yet. Run the guided flow or seed data.</p>
          ) : (
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {logs.map((l, i) => (
                <p key={i} className="text-xs text-muted font-mono">{l}</p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
