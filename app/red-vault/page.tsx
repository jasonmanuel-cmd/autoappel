'use client'

import { useEffect, useState } from 'react'
import { store } from '@/lib/store'
import type { AuditLog, RedVaultAlert, DeploymentStatus } from '@/lib/types'

const ALERT_LABELS: Record<string, string> = {
  permission_anomaly: 'Permission Anomaly',
  unauthorized_change: 'Unauthorized Change',
  deployment_event: 'Deployment Event',
  branding_change: 'Branding Change',
  data_export: 'Data Export',
  payment_routing: 'Payment/Routing Change',
  referral_routing: 'Referral Routing Change',
}

export default function RedVaultPage() {
  const [alerts, setAlerts] = useState<RedVaultAlert[]>([])
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [deployment, setDeployment] = useState<DeploymentStatus | null>(null)

  useEffect(() => {
    setAlerts(store.getAlerts())
    setLogs(store.getAuditLogs())
    setDeployment(store.getDeployment())
  }, [])

  const resolve = (id: string) => {
    store.resolveAlert(id)
    setAlerts(store.getAlerts())
  }

  const addTestAlert = () => {
    store.addAlert({
      type: 'permission_anomaly',
      description: 'Simulated permission anomaly detected for testing purposes.',
      resolved: false,
    })
    setAlerts(store.getAlerts())
  }

  const protections = deployment ? [
    { label: 'Red Vault™ Monitoring', active: deployment.redVaultActive },
    { label: 'Audit Logging', active: deployment.auditMonitoringActive },
    { label: 'Emergency Shutdown', active: deployment.emergencyShutdownActive },
    { label: 'Founder Dashboard™', active: deployment.founderDashboardActive },
    { label: 'Banking Verification', active: deployment.bankingVerificationActive },
    { label: 'Treasury System', active: deployment.treasurySystemActive },
  ] : []

  const unresolved = alerts.filter(a => !a.resolved)

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-3xl">🔴</span>
        <h1 className="text-3xl font-black">Red Vault™ Security Monitor</h1>
      </div>
      <p className="text-muted mb-8">
        LAGNAF™ network LLC · Houston Deployment · All activity monitored and logged
      </p>

      {unresolved.length > 0 && (
        <div className="bg-red-900/30 border border-red-500 rounded-xl p-4 mb-6">
          <p className="font-bold text-red-400">⚠ {unresolved.length} unresolved alert{unresolved.length > 1 ? 's' : ''} require attention</p>
        </div>
      )}

      {/* Protection Status */}
      <div className="card mb-6">
        <h2 className="font-bold text-lg mb-4">Red Vault™ Protection Status</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {protections.map(p => (
            <div key={p.label} className="flex items-center gap-2 text-sm">
              <div className={`w-3 h-3 rounded-full ${p.active ? 'bg-green-400' : 'bg-red-500'}`} />
              <span className={p.active ? 'text-green-400' : 'text-red-400'}>{p.label}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 bg-bg-elevated rounded text-xs text-muted">
          No deployment may go live unless all Red Vault™ protections are active. Founder authority supersedes all automation.
        </div>
      </div>

      {/* Alerts */}
      <div className="card mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg">Red Vault™ Alerts</h2>
          <button onClick={addTestAlert} className="btn-secondary text-xs py-1 px-3">+ Test Alert</button>
        </div>

        {alerts.length === 0 ? (
          <p className="text-subtle text-sm">No alerts recorded.</p>
        ) : (
          <div className="space-y-3">
            {alerts.map(a => (
                <div key={a.id} className={`p-3 rounded-lg border text-sm ${a.resolved ? 'border-primary/20 opacity-50' : 'border-primary'}`}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-semibold text-primary">{ALERT_LABELS[a.type] || a.type}</span>
                    <p className="text-muted mt-0.5">{a.description}</p>
                    <p className="text-subtle text-xs mt-1">{new Date(a.timestamp).toLocaleString()}</p>
                  </div>
                  {!a.resolved && (
                    <button onClick={() => resolve(a.id)} className="btn-secondary text-xs py-1 px-2 shrink-0">
                      Resolve
                    </button>
                  )}
                  {a.resolved && <span className="text-xs text-green-400 shrink-0">✓ Resolved</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Audit Log */}
      <div className="card">
        <h2 className="font-bold text-lg mb-4">Audit Log</h2>
        {logs.length === 0 ? (
          <p className="text-subtle text-sm">No audit entries yet.</p>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {logs.map(l => (
              <div key={l.id} className="flex items-start gap-3 text-xs p-2 bg-bg-elevated rounded">
                <span className={
                  l.severity === 'critical' ? 'text-danger' :
                  l.severity === 'warn' ? 'text-warning' : 'text-muted'
                }>
                  {l.severity.toUpperCase()}
                </span>
                <span className="text-subtle shrink-0">{new Date(l.timestamp).toLocaleTimeString()}</span>
                <span className="text-muted-fg">{l.actor}</span>
                <span className="text-text font-medium">{l.action}</span>
                <span className="text-muted">{l.details}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
