export type RiskLevel = 'green' | 'yellow' | 'orange' | 'red' | 'expired'

export interface Citation {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  preferredContact: 'email' | 'sms' | 'both'
  citationNumber: string
  citationDate: string
  responseDeadline: string
  county: string
  court: string
  jurisdiction: string
  violationType: string
  uploadPath?: string
  ambassadorId?: string
  referralSource?: string
  riskLevel: RiskLevel
  status: 'pending' | 'in_review' | 'appealing' | 'resolved' | 'expired'
  paymentStatus: 'unpaid' | 'paid' | 'waived'
  serviceFeeStatus: 'unpaid' | 'paid' | 'waived'
  createdAt: string
  updatedAt: string
}

export interface Ambassador {
  id: string
  name: string
  email: string
  phone: string
  referralCode: string
  cardActivated: boolean
  masterCodeValidated: boolean
  ndaSigned: boolean
  agreementExecuted: boolean
  w9Submitted: boolean
  bankingVerified: boolean
  treasuryApproved: boolean
  founderApproved: boolean
  active: boolean
  referralCount: number
  compensationFrozen: boolean
  linkDisabled: boolean
  createdAt: string
}

export interface AuditLog {
  id: string
  timestamp: string
  actor: string
  action: string
  resource: string
  details: string
  severity: 'info' | 'warn' | 'critical'
}

export interface RedVaultAlert {
  id: string
  timestamp: string
  type: 'permission_anomaly' | 'unauthorized_change' | 'deployment_event' | 'branding_change' | 'data_export' | 'payment_routing' | 'referral_routing'
  description: string
  resolved: boolean
}

export interface TreasuryProfile {
  id: string
  entityName: string
  ndaSigned: boolean
  agreementExecuted: boolean
  w9Submitted: boolean
  bankingMethod: 'zelle' | 'ach' | 'direct' | 'institutional'
  bankingVerified: boolean
  founderAuthorized: boolean
  cardActivated: boolean
  masterCodeValidated: boolean
  createdAt: string
}

export interface DeploymentStatus {
  city: string
  engineer: string
  founder: string
  company: string
  redVaultActive: boolean
  founderDashboardActive: boolean
  countdownEngineActive: boolean
  citationIntakeActive: boolean
  ambassadorSystemActive: boolean
  treasurySystemActive: boolean
  bankingVerificationActive: boolean
  emergencyShutdownActive: boolean
  auditMonitoringActive: boolean
  qaScore: number
  liveStatus: 'staging' | 'pending_approval' | 'live' | 'shutdown'
  founderApprovalGranted: boolean
  globalShutdown: boolean
}

export interface QAItem {
  id: string
  category: string
  item: string
  weight: number
  passed: boolean
  notes?: string
}
