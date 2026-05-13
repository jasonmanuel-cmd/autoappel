'use client'

import type { Citation, Ambassador, AuditLog, RedVaultAlert, TreasuryProfile, DeploymentStatus, QAItem, RiskLevel } from './types'

const DEFAULT_DEPLOYMENT: DeploymentStatus = {
  city: 'Houston',
  engineer: 'Jason Manuel',
  founder: 'Marc Bouvier',
  company: 'LAGNAF™ network LLC',
  redVaultActive: true,
  founderDashboardActive: true,
  countdownEngineActive: true,
  citationIntakeActive: true,
  ambassadorSystemActive: true,
  treasurySystemActive: true,
  bankingVerificationActive: true,
  emergencyShutdownActive: true,
  auditMonitoringActive: true,
  qaScore: 0,
  liveStatus: 'staging',
  founderApprovalGranted: false,
  globalShutdown: false,
}

const DEFAULT_QA: QAItem[] = [
  { id: '1', category: 'Landing Page', item: 'Houston landing page loads correctly', weight: 3, passed: false },
  { id: '2', category: 'Landing Page', item: 'CTA button functional', weight: 3, passed: false },
  { id: '3', category: 'Intake Funnel', item: 'All required fields present', weight: 5, passed: false },
  { id: '4', category: 'Intake Funnel', item: 'Citation upload functional', weight: 5, passed: false },
  { id: '5', category: 'Intake Funnel', item: 'Form validation working', weight: 4, passed: false },
  { id: '6', category: 'Countdown Engine', item: 'Countdown generates on citation upload', weight: 5, passed: false },
  { id: '7', category: 'Countdown Engine', item: 'Risk levels display correctly', weight: 4, passed: false },
  { id: '8', category: 'Countdown Engine', item: 'SMS/email reminders configured', weight: 4, passed: false },
  { id: '9', category: 'Red Vault™', item: 'Red Vault monitoring active', weight: 8, passed: false },
  { id: '10', category: 'Red Vault™', item: 'Audit logging operational', weight: 7, passed: false },
  { id: '11', category: 'Red Vault™', item: 'Permission anomaly detection active', weight: 6, passed: false },
  { id: '12', category: 'Red Vault™', item: 'Emergency shutdown controls operational', weight: 8, passed: false },
  { id: '13', category: 'Founder Dashboard™', item: 'All controls visible and operational', weight: 7, passed: false },
  { id: '14', category: 'Founder Dashboard™', item: 'Disable/enable controls work', weight: 6, passed: false },
  { id: '15', category: 'Ambassador System', item: 'Referral routing operational', weight: 4, passed: false },
  { id: '16', category: 'Ambassador System', item: 'Founder override controls work', weight: 5, passed: false },
  { id: '17', category: 'Treasury', item: 'Banking verification fields present', weight: 4, passed: false },
  { id: '18', category: 'Treasury', item: 'Founder authorization gate active', weight: 6, passed: false },
  { id: '19', category: 'Security', item: 'No unauthorized access paths', weight: 7, passed: false },
  { id: '20', category: 'Security', item: 'Biometric confirmation template ready', weight: 3, passed: false },
]

function getLS<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function setLS<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(key, JSON.stringify(value))
}

export const store = {
  getCitations: (): Citation[] => getLS<Citation[]>('aa_citations', []),
  saveCitation: (c: Citation) => {
    const all = store.getCitations()
    const idx = all.findIndex(x => x.id === c.id)
    if (idx >= 0) all[idx] = c; else all.unshift(c)
    setLS('aa_citations', all)
    store.addAuditLog({ actor: 'system', action: 'CITATION_SAVED', resource: `citation:${c.id}`, details: `Citation ${c.citationNumber} saved`, severity: 'info' })
  },
  deleteCitation: (id: string) => {
    setLS('aa_citations', store.getCitations().filter(c => c.id !== id))
  },

  getAmbassadors: (): Ambassador[] => getLS<Ambassador[]>('aa_ambassadors', []),
  saveAmbassador: (a: Ambassador) => {
    const all = store.getAmbassadors()
    const idx = all.findIndex(x => x.id === a.id)
    if (idx >= 0) all[idx] = a; else all.unshift(a)
    setLS('aa_ambassadors', all)
  },

  getAuditLogs: (): AuditLog[] => getLS<AuditLog[]>('aa_audit', []),
  addAuditLog: (log: Omit<AuditLog, 'id' | 'timestamp'>) => {
    const all = store.getAuditLogs()
    all.unshift({ ...log, id: crypto.randomUUID(), timestamp: new Date().toISOString() })
    setLS('aa_audit', all.slice(0, 500))
  },

  getAlerts: (): RedVaultAlert[] => getLS<RedVaultAlert[]>('aa_alerts', []),
  addAlert: (a: Omit<RedVaultAlert, 'id' | 'timestamp'>) => {
    const all = store.getAlerts()
    all.unshift({ ...a, id: crypto.randomUUID(), timestamp: new Date().toISOString() })
    setLS('aa_alerts', all)
  },
  resolveAlert: (id: string) => {
    setLS('aa_alerts', store.getAlerts().map(a => a.id === id ? { ...a, resolved: true } : a))
  },

  getTreasuryProfiles: (): TreasuryProfile[] => getLS<TreasuryProfile[]>('aa_treasury', []),
  saveTreasuryProfile: (p: TreasuryProfile) => {
    const all = store.getTreasuryProfiles()
    const idx = all.findIndex(x => x.id === p.id)
    if (idx >= 0) all[idx] = p; else all.unshift(p)
    setLS('aa_treasury', all)
  },

  getDeployment: (): DeploymentStatus => getLS<DeploymentStatus>('aa_deployment', DEFAULT_DEPLOYMENT),
  saveDeployment: (d: DeploymentStatus) => {
    setLS('aa_deployment', d)
    store.addAuditLog({ actor: 'founder', action: 'DEPLOYMENT_UPDATED', resource: 'deployment', details: `Status: ${d.liveStatus}, QA: ${d.qaScore}`, severity: 'warn' })
  },

  getQAItems: (): QAItem[] => getLS<QAItem[]>('aa_qa', DEFAULT_QA),
  saveQAItems: (items: QAItem[]) => setLS('aa_qa', items),

  computeScore: (items: QAItem[]): number => {
    const total = items.reduce((s, i) => s + i.weight, 0)
    const earned = items.filter(i => i.passed).reduce((s, i) => s + i.weight, 0)
    return total === 0 ? 0 : Math.round((earned / total) * 100)
  },

  getCitationById: (id: string): Citation | undefined => {
    return store.getCitations().find(c => c.id === id)
  },

  computeRisk: (deadlineStr: string): RiskLevel => {
    if (!deadlineStr) return 'green'
    const diff = new Date(deadlineStr).getTime() - Date.now()
    const days = diff / 86400000
    if (diff < 0) return 'expired'
    if (days <= 3) return 'red'
    if (days <= 7) return 'orange'
    if (days <= 14) return 'yellow'
    return 'green'
  },
}
