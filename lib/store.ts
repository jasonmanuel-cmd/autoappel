'use client'

import type { Citation, Ambassador, AuditLog, RedVaultAlert, TreasuryProfile, DeploymentStatus, QAItem, RiskLevel } from './types'

const DEMO_PASSWORD = 'demo-2026'
const DEMO_KEY = 'aa_demo_mode'

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
  qaScore: 90,
  liveStatus: 'pending_approval',
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

function daysFromNow(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return d.toISOString()
}

export const store = {
   /* ── Supabase Auth (PRODUCTION ONLY) ────────────── */
   loginWithSupabase: async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
     try {
       const { createClientSupabase } = await import('./supabase')
       const supabase = createClientSupabase()
       if (!supabase) {
         return { success: false, error: 'Authentication service is not configured. Please contact support.' }
       }
       const { error } = await supabase.auth.signInWithPassword({ email, password })
       if (error) {
         return { success: false, error: error.message }
       }
       return { success: true }
     } catch (err) {
       return { success: false, error: 'Authentication failed. Please try again.' }
     }
   },

  signUpWithSupabase: async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { createClientSupabase } = await import('./supabase')
      const supabase = createClientSupabase()
      if (!supabase) return { success: false, error: 'Authentication service is not configured. Please contact support.' }
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) return { success: false, error: error.message }
      return { success: true }
    } catch {
      return { success: false, error: 'Auth service unavailable' }
    }
  },

  logoutFromSupabase: async () => {
    try {
      const { createClientSupabase } = await import('./supabase')
      const supabase = createClientSupabase()
      if (supabase) await supabase.auth.signOut()
    } catch {}
  },

  /* ── Demo Mode ─────────────────────────────── */
  getDemoMode: (): boolean => getLS<boolean>(DEMO_KEY, false),
  setDemoMode: (on: boolean) => {
    setLS(DEMO_KEY, on)
    if (typeof window !== 'undefined') {
      document.cookie = `aa_demo=${on}; path=/; max-age=${on ? 86400 * 30 : 0}; SameSite=Lax`
    }
  },
  checkDemoPassword: (pw: string): boolean => pw === DEMO_PASSWORD,
  getDemoPassword: () => DEMO_PASSWORD,

  logout: () => {
    store.logoutFromSupabase()
    setLS(DEMO_KEY, false)
    if (typeof window !== 'undefined') {
      document.cookie = 'aa_demo=false; path=/; max-age=0; SameSite=Lax'
      document.cookie = 'sb-access-token=; path=/; max-age=0; SameSite=Lax'
    }
    setLS('aa_citations', [])
    setLS('aa_ambassadors', [])
    setLS('aa_treasury', [])
    setLS('aa_audit', [])
    setLS('aa_alerts', [])
    setLS('aa_qa', DEFAULT_QA)
    setLS('aa_deployment', DEFAULT_DEPLOYMENT)
  },

  seedDemoData: () => {
    const now = new Date()

    const citations: Citation[] = [
      {
        id: 'demo-001', firstName: 'Maria', lastName: 'Garcia',
        email: 'maria.garcia@email.com', phone: '(713) 555-0101',
        preferredContact: 'email',
        citationNumber: 'TX-HC-2026-00421', citationDate: daysFromNow(-14),
        responseDeadline: daysFromNow(10),
        county: 'Harris', court: 'Houston Municipal Court', jurisdiction: 'Houston, TX',
        violationType: 'Speeding', riskLevel: 'green', status: 'pending',
        paymentStatus: 'unpaid', createdAt: daysFromNow(-14), updatedAt: daysFromNow(-1),
      },
      {
        id: 'demo-002', firstName: 'James', lastName: 'Johnson',
        email: 'james.j@email.com', phone: '(832) 555-0202',
        preferredContact: 'both',
        citationNumber: 'TX-HC-2026-00887', citationDate: daysFromNow(-7),
        responseDeadline: daysFromNow(5),
        county: 'Fort Bend', court: 'Fort Bend County Court', jurisdiction: 'Richmond, TX',
        violationType: 'Red Light', riskLevel: 'orange', status: 'in_review',
        paymentStatus: 'unpaid', createdAt: daysFromNow(-7), updatedAt: daysFromNow(-1),
      },
      {
        id: 'demo-003', firstName: 'Sarah', lastName: 'Chen',
        email: 'sarah.chen@email.com', phone: '(281) 555-0303',
        preferredContact: 'sms',
        citationNumber: 'TX-MC-2026-00112', citationDate: daysFromNow(-28),
        responseDeadline: daysFromNow(2),
        county: 'Montgomery', court: 'Montgomery County JP Court', jurisdiction: 'Conroe, TX',
        violationType: 'Failure to Yield', riskLevel: 'red', status: 'appealing',
        paymentStatus: 'unpaid', createdAt: daysFromNow(-28), updatedAt: daysFromNow(-1),
      },
      {
        id: 'demo-004', firstName: 'Mike', lastName: 'Davis',
        email: 'mike.davis@email.com', phone: '(346) 555-0404',
        preferredContact: 'email',
        citationNumber: 'TX-HC-2026-00155', citationDate: daysFromNow(-45),
        responseDeadline: daysFromNow(-10),
        county: 'Harris', court: 'Harris County Justice Court', jurisdiction: 'Houston, TX',
        violationType: 'No Insurance', riskLevel: 'expired', status: 'expired',
        paymentStatus: 'unpaid', createdAt: daysFromNow(-45), updatedAt: daysFromNow(-5),
      },
      {
        id: 'demo-005', firstName: 'Ana', lastName: 'Martinez',
        email: 'ana.m@email.com', phone: '(713) 555-0505',
        preferredContact: 'both',
        citationNumber: 'TX-FB-2026-00333', citationDate: daysFromNow(-60),
        responseDeadline: daysFromNow(-30),
        county: 'Fort Bend', court: 'Fort Bend County Court', jurisdiction: 'Richmond, TX',
        violationType: 'Speeding', riskLevel: 'expired', status: 'resolved',
        paymentStatus: 'waived', createdAt: daysFromNow(-60), updatedAt: daysFromNow(-20),
      },
    ]
    setLS('aa_citations', citations)

    const ambassadors: Ambassador[] = [
      {
        id: 'demo-amb-1', name: 'Robert Williams', email: 'robert.w@email.com', phone: '(713) 555-1001',
        referralCode: 'ROBERT-HOU', cardActivated: true, masterCodeValidated: true,
        ndaSigned: true, agreementExecuted: true, w9Submitted: true,
        bankingVerified: true, treasuryApproved: true, founderApproved: true,
        active: true, referralCount: 12, compensationFrozen: false, linkDisabled: false,
        createdAt: daysFromNow(-90),
      },
      {
        id: 'demo-amb-2', name: 'Lisa Thompson', email: 'lisa.t@email.com', phone: '(832) 555-1002',
        referralCode: 'LISA-HOU', cardActivated: true, masterCodeValidated: true,
        ndaSigned: true, agreementExecuted: false, w9Submitted: true,
        bankingVerified: false, treasuryApproved: false, founderApproved: false,
        active: false, referralCount: 5, compensationFrozen: false, linkDisabled: false,
        createdAt: daysFromNow(-60),
      },
    ]
    setLS('aa_ambassadors', ambassadors)

    const treasury: TreasuryProfile[] = [
      {
        id: 'demo-tres-1', entityName: 'Maria Garcia Law LLC',
        ndaSigned: true, agreementExecuted: true, w9Submitted: true,
        bankingMethod: 'zelle', bankingVerified: true,
        founderAuthorized: true, cardActivated: true, masterCodeValidated: true,
        createdAt: daysFromNow(-30),
      },
    ]
    setLS('aa_treasury', treasury)

    store.addAuditLog({ actor: 'demo-system', action: 'DEMO_DATA_SEEDED', resource: 'system', details: 'All demo data seeded successfully', severity: 'info' })

    const qa = store.getQAItems().map(q => ({ ...q, passed: Math.random() > 0.3 }))
    store.saveQAItems(qa)
    const score = store.computeScore(qa)
    store.saveDeployment({ ...store.getDeployment(), qaScore: score })
  },

  /* ── Citations ─────────────────────────────── */
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
    const now = Date.now()
    const diff = new Date(deadlineStr).getTime() - now
    const rawDays = diff / 86400000
    const BUFFER_DAYS = 3
    const adjustedDays = rawDays - BUFFER_DAYS
    if (adjustedDays <= 0) return 'expired'
    if (adjustedDays <= 3) return 'red'
    if (adjustedDays <= 7) return 'orange'
    if (adjustedDays <= 14) return 'yellow'
    return 'green'
  },
}
