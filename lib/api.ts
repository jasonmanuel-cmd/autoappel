'use client'

import { store } from './store'

interface MockResponse<T> {
  success: boolean
  data?: T
  error?: string
  requestId: string
}

export interface CheckoutSession {
  id: string
  amount: number
  description: string
  status: 'pending' | 'completed' | 'failed'
  createdAt: string
  completedAt?: string
  receiptUrl?: string
}

interface EmailResult {
  to: string
  subject: string
  sentAt: string
  messageId: string
}

interface CitationSubmissionResult {
  id: string
  status: string
  message: string
}

interface PaymentHistoryEntry {
  date: string
  description: string
  amount: number
  status: string
  receiptId: string
}

function genId(prefix: string): string {
  return `${prefix}_${crypto.randomUUID().slice(0, 8)}`
}

let sessions: CheckoutSession[] = []

function getDemoMode(): boolean {
  try { return store.getDemoMode() } catch { return false }
}

function ensureDemo(): void {
  if (!getDemoMode()) throw new Error('Demo mode required for mock API')
}

function delay(ms: number): Promise<void> {
  return new Promise(r => setTimeout(r, ms))
}

export const api = {
  submitCitation: async (citation: Record<string, unknown>): Promise<MockResponse<CitationSubmissionResult>> => {
    ensureDemo()
    await delay(800 + Math.random() * 700)
    store.addAuditLog({ actor: 'demo-api', action: 'CITATION_SUBMITTED', resource: `citation:${citation.id}`, details: 'Citation submitted via mock API', severity: 'info' })
    return {
      success: true,
      data: { id: citation.id as string, status: 'received', message: 'Citation submitted. A confirmation email has been sent.' },
      requestId: genId('req'),
    }
  },

  sendConfirmationEmail: async (to: string, subject: string): Promise<MockResponse<EmailResult>> => {
    ensureDemo()
    await delay(500 + Math.random() * 500)
    store.addAuditLog({ actor: 'demo-api', action: 'EMAIL_SENT', resource: `email:${to}`, details: `Mock email sent: "${subject}"`, severity: 'info' })
    return {
      success: true,
      data: { to, subject, sentAt: new Date().toISOString(), messageId: genId('msg') },
      requestId: genId('req'),
    }
  },

  createCheckoutSession: async (amount: number, description: string): Promise<MockResponse<CheckoutSession>> => {
    ensureDemo()
    await delay(300)
    const session: CheckoutSession = { id: genId('cs'), amount, description, status: 'pending', createdAt: new Date().toISOString() }
    sessions.push(session)
    store.addAuditLog({ actor: 'demo-api', action: 'CHECKOUT_CREATED', resource: `checkout:${session.id}`, details: `$${amount} — ${description}`, severity: 'info' })
    return { success: true, data: session, requestId: genId('req') }
  },

  simulatePayment: async (sessionId: string): Promise<MockResponse<CheckoutSession>> => {
    ensureDemo()
    await delay(1500 + Math.random() * 1000)
    const idx = sessions.findIndex(s => s.id === sessionId)
    if (idx === -1) return { success: false, error: 'Session not found', requestId: genId('req') }
    const session: CheckoutSession = {
      ...sessions[idx],
      status: 'completed',
      completedAt: new Date().toISOString(),
      receiptUrl: `/demo-payment?receipt=${sessionId.slice(0, 8)}`,
    }
    sessions[idx] = session
    store.addAuditLog({ actor: 'demo-api', action: 'PAYMENT_COMPLETED', resource: `checkout:${sessionId}`, details: `$${session.amount} charged successfully`, severity: 'info' })
    return { success: true, data: session, requestId: genId('req') }
  },

  simulatePaymentFailure: async (sessionId: string): Promise<MockResponse<CheckoutSession>> => {
    ensureDemo()
    await delay(1000)
    const idx = sessions.findIndex(s => s.id === sessionId)
    if (idx === -1) return { success: false, error: 'Session not found', requestId: genId('req') }
    const session: CheckoutSession = { ...sessions[idx], status: 'failed', completedAt: new Date().toISOString() }
    sessions[idx] = session
    store.addAuditLog({ actor: 'demo-api', action: 'PAYMENT_FAILED', resource: `checkout:${sessionId}`, details: 'Card declined (simulated)', severity: 'warn' })
    return { success: true, data: session, requestId: genId('req') }
  },

  getPaymentStatus: async (sessionId: string): Promise<MockResponse<CheckoutSession>> => {
    ensureDemo()
    await delay(200)
    const session = sessions.find(s => s.id === sessionId)
    if (!session) return { success: false, error: 'Session not found', requestId: genId('req') }
    return { success: true, data: session, requestId: genId('req') }
  },

  getPaymentHistory: async (): Promise<MockResponse<PaymentHistoryEntry[]>> => {
    ensureDemo()
    await delay(300)
    const history: PaymentHistoryEntry[] = sessions
      .filter(s => s.status !== 'pending')
      .map(s => ({
        date: s.completedAt || s.createdAt,
        description: s.description,
        amount: s.amount,
        status: s.status,
        receiptId: s.id.slice(0, 8),
      }))
    return { success: true, data: history, requestId: genId('req') }
  },
}
