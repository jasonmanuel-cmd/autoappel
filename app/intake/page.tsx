'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Turnstile } from '@marsidev/react-turnstile'
import { store } from '@/lib/store'
import type { Citation } from '@/lib/types'
import { validateCitationFormat, getCountyHint } from '@/lib/citation-validator'

const STEPS = ['Contact Info', 'Citation Details', 'Review & Submit']

const VIOLATION_TYPES = [
  'Speeding', 'Red Light', 'Stop Sign', 'Lane Change', 'No Insurance',
  'Registration', 'Cell Phone', 'Failure to Yield', 'Reckless Driving', 'Other',
]

export default function IntakePage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [authLoading, setAuthLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { createClientSupabase } = await import('@/lib/supabase')
        const supabase = createClientSupabase()
        if (supabase) {
          const { data: { user } } = await supabase.auth.getUser()
          setAuthenticated(!!user)
        }
      } catch {}
      setAuthLoading(false)
    }
    checkAuth()
  }, [])

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    preferredContact: 'email' as 'email' | 'sms' | 'both',
    citationNumber: '', citationDate: '', responseDeadline: '',
    county: '', court: '', jurisdiction: '', violationType: '',
  })
  const [disclaimerAck, setDisclaimerAck] = useState(false)
  const [citationValidation, setCitationValidation] = useState<{ valid: boolean; confidence: string; message: string } | null>(null)
  const turnstileTokenRef = useRef<string | null>(null)
  const [turnstileSolved, setTurnstileSolved] = useState(false)

  const onTurnstileSuccess = useCallback((token: string) => {
    turnstileTokenRef.current = token
    setTurnstileSolved(true)
  }, [])
  const onTurnstileError = useCallback(() => {
    turnstileTokenRef.current = null
    setTurnstileSolved(false)
  }, [])
  const onTurnstileExpire = useCallback(() => {
    turnstileTokenRef.current = null
    setTurnstileSolved(false)
  }, [])

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  useEffect(() => {
    if (form.citationNumber.trim() && form.county) {
      const result = validateCitationFormat(form.citationNumber, form.county)
      setCitationValidation({ valid: result.valid, confidence: result.confidence, message: result.message })
    } else {
      setCitationValidation(null)
    }
  }, [form.citationNumber, form.county])

  const validateStep = () => {
    const e: Record<string, string> = {}
    if (step === 0) {
      if (!form.firstName.trim()) e.firstName = 'First name is required'
      if (!form.lastName.trim())  e.lastName  = 'Last name is required'
      if (!form.email.trim())     e.email     = 'Email is required'
      if (!form.email.includes('@')) e.email = 'Please enter a valid email'
      if (!form.phone.trim())     e.phone     = 'Phone is required'
    }
    if (step === 1) {
      if (!form.citationNumber.trim()) e.citationNumber = 'Citation number is required'
      if (!form.citationDate)   e.citationDate   = 'Citation date is required'
      if (!form.county.trim())         e.county         = 'County is required'
      if (!form.violationType)  e.violationType  = 'Violation type is required'
    }
    if (step === 2) {
      if (!disclaimerAck) e.disclaimerAcknowledged = 'You must acknowledge the disclaimer to proceed'
      if (!turnstileTokenRef.current) e.turnstile = 'Please complete the security check'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const next = () => { if (validateStep()) setStep(s => s + 1) }
  const back = () => setStep(s => s - 1)

  const submit = async () => {
    if (!validateStep()) return
    setLoading(true)
    
    try {
      const citation: Citation = {
        id: crypto.randomUUID(),
        ...form,
        riskLevel: store.computeRisk(form.responseDeadline),
        status: 'pending',
        paymentStatus: 'unpaid',
        serviceFeeStatus: 'unpaid',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      store.saveCitation(citation)
      
      try {
        await fetch('/api/citations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...citation, turnstileToken: turnstileTokenRef.current }),
        })
      } catch (err) {
        console.error('Failed to submit citation to server:', err)
      }

      try {
        const firstName = form.firstName || form.email.split('@')[0]
        await fetch('/api/notifications/email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'welcome', email: form.email, firstName, citationNumber: form.citationNumber }),
        })
      } catch (err) {
        console.error('Failed to send confirmation email:', err)
      }

      if (form.phone && form.preferredContact !== 'email') {
        try {
          await fetch('/api/notifications/sms', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'submission_decision',
              phoneNumber: form.phone,
              citationNumber: form.citationNumber,
              submissionType: 'appeal',
              decision: 'approved',
            }),
          })
        } catch (err) {
          console.error('Failed to send SMS notification:', err)
        }
      }

      router.push(`/payment/service?citation_id=${citation.id}`)
    } finally {
      setLoading(false)
    }
  }

  const field = (label: string, key: string, type = 'text', placeholder = '') => (
    <div key={key}>
      <label className="label">{label}</label>
      <input
        type={type}
        className="input"
        placeholder={placeholder}
        value={(form as Record<string, string>)[key]}
        onChange={e => set(key, e.target.value)}
        disabled={loading}
      />
      {errors[key] && <p className="text-danger text-xs mt-1">{errors[key]}</p>}
    </div>
  )

  if (authLoading) {
    return (
      <div className="min-h-screen py-12" style={{ background: 'var(--gradient-bg)' }}>
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="card py-12">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"/>
            <p className="text-muted">Checking authentication...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen py-12" style={{ background: 'var(--gradient-bg)' }}>
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="card py-12">
            <h1 className="text-3xl font-black mb-4">Sign In Required</h1>
             <p className="text-muted mb-8">Create an account or sign in to start your appeal. Flat $79.99 per citation.</p>
            <div className="space-y-3">
              <Link href="/login" className="btn-primary w-full inline-block">Sign In</Link>
              <Link href="/login?mode=signup" className="btn-secondary w-full inline-block">Create Account</Link>
            </div>
            <p className="text-xs text-subtle mt-8">
              Already have an account? <Link href="/login" className="text-sm text-primary hover:underline inline-block py-3">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12" style={{ background: 'var(--gradient-bg)' }}>
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-black mb-2">Start Your Appeal</h1>
          <p className="text-muted-fg">Complete this form to begin. Flat <strong>$79.99</strong> per citation — you'll pay after we review your details.</p>
        </div>

        {/* Progress Bar */}
        <div className="flex gap-2 mb-10">
          {STEPS.map((s, i) => (
            <div key={s} className="flex-1">
              <div className={`h-2 rounded-full transition-colors ${i <= step ? 'bg-primary' : 'bg-border'}`} />
              <p className={`text-xs font-semibold mt-2 ${i === step ? 'text-primary' : i < step ? 'text-success' : 'text-subtle'}`}>{s}</p>
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="card space-y-6">
          {step === 0 && (
            <>
              <h2 className="text-xl font-bold text-primary mb-4">Your Contact Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {field('First Name', 'firstName', 'text', 'John')}
                {field('Last Name', 'lastName', 'text', 'Smith')}
              </div>
              {field('Email Address', 'email', 'email', 'john@email.com')}
              {field('Phone Number', 'phone', 'tel', '(555) 123-4567')}
              <div>
                <label className="label">How should we contact you?</label>
                <select className="input" value={form.preferredContact} onChange={e => set('preferredContact', e.target.value as any)} disabled={loading}>
                  <option value="email">Email</option>
                  <option value="sms">Text Message (SMS)</option>
                  <option value="both">Both Email & Text</option>
                </select>
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <h2 className="text-xl font-bold text-primary mb-4">Citation Information</h2>
              {field('Citation Number', 'citationNumber', 'text', 'TX-2026-XXXXXX')}
              {citationValidation && (
                <div className={`text-xs mt-1 ${citationValidation.valid ? 'text-green-500' : 'text-amber-500'}`}>
                  {citationValidation.valid ? '✓ ' : '⚠ '}{citationValidation.message}
                </div>
              )}
              {form.county && form.citationNumber.trim() && (
                <div className="text-xs text-subtle">
                  Expected format{['Harris', 'Fort Bend', 'Montgomery', 'Galveston', 'Brazoria', 'Chambers'].includes(form.county) ? ` for ${form.county} County: ${getCountyHint(form.county) || 'TX-XX-YYYY-NNNNN'}` : ': TX-XX-YYYY-NNNNN'}
                </div>
              )}
              {field('Citation Date', 'citationDate', 'date')}
              {field('Response Deadline', 'responseDeadline', 'date')}
              <p className="text-xs text-subtle">If you know your response deadline, enter it here. This helps us track urgency.</p>
              <div>
                <label className="label">County</label>
                <select className="input" value={form.county} onChange={e => set('county', e.target.value)} disabled={loading}>
                  <option value="">Select county...</option>
                  <option value="Harris">Harris County (Houston)</option>
                  <option value="Fort Bend">Fort Bend County</option>
                  <option value="Montgomery">Montgomery County</option>
                  <option value="Galveston">Galveston County</option>
                  <option value="Brazoria">Brazoria County</option>
                  <option value="Chambers">Chambers County</option>
                  <option value="Other">Other</option>
                </select>
                {errors.county && <p className="text-danger text-xs mt-1">{errors.county}</p>}
              </div>
              {field('Court Name', 'court', 'text', 'Houston Municipal Court')}
              {field('City/Jurisdiction', 'jurisdiction', 'text', 'Houston, TX')}
              <div>
                <label className="label">Violation Type</label>
                <select className="input" value={form.violationType} onChange={e => set('violationType', e.target.value)} disabled={loading}>
                  <option value="">Select violation type...</option>
                  {VIOLATION_TYPES.map(v => <option key={v} value={v}>{v}</option>)}
                </select>
                {errors.violationType && <p className="text-danger text-xs mt-1">{errors.violationType}</p>}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="text-xl font-bold text-primary mb-4">Review Your Information</h2>
              <div className="bg-bg-elevated border border-border rounded-lg p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-subtle font-semibold">Full Name</p>
                    <p className="text-text">{form.firstName} {form.lastName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-subtle font-semibold">Email</p>
                    <p className="text-text">{form.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-subtle font-semibold">Phone</p>
                    <p className="text-text">{form.phone}</p>
                  </div>
                  <div>
                    <p className="text-xs text-subtle font-semibold">Preferred Contact</p>
                    <p className="text-text capitalize">{form.preferredContact.replace('both', 'Email & SMS')}</p>
                  </div>
                </div>

                <div className="border-t border-border pt-4 mt-4">
                  <h3 className="font-bold text-primary mb-3">Citation Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-subtle font-semibold">Citation #</p>
                      <p className="text-text">{form.citationNumber}</p>
                    </div>
                    <div>
                      <p className="text-xs text-subtle font-semibold">Violation</p>
                      <p className="text-text">{form.violationType}</p>
                    </div>
                    <div>
                      <p className="text-xs text-subtle font-semibold">Citation Date</p>
                      <p className="text-text">{form.citationDate}</p>
                    </div>
                    <div>
                      <p className="text-xs text-subtle font-semibold">Response Deadline</p>
                      <p className="text-text">{form.responseDeadline || 'Not provided'}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs text-subtle font-semibold">Court</p>
                      <p className="text-text">{form.court}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="bg-orange/10 border border-orange/30 rounded-lg p-4 space-y-3">
                <h3 className="font-bold text-orange text-sm">📋 Important Notice</h3>
                <div className="text-xs text-muted space-y-2">
                  <p><strong>AppealMyTicket<span className="text-primary">S</span>.com is not a law firm.</strong> We do not provide legal advice or legal representation. We are an appeal assistance platform that helps you organize citation information, prepare documentation, and navigate the appeal process.</p>
                  <p>No attorney-client relationship is created by submitting this form. AppealMyTicket<span className="text-primary">S</span>.com provides document preparation and filing guidance only.</p>
                  <p>Court deadlines vary. Our countdown tools provide estimates only — always verify deadlines with the issuing court.</p>
                  <p>Results are not guaranteed. Outcomes depend on individual case facts, court rulings, and other factors beyond our control.</p>
                </div>
                <label className="flex items-start gap-3 cursor-pointer pt-2">
                  <input
                    type="checkbox"
                    checked={disclaimerAck}
                    onChange={e => setDisclaimerAck(e.target.checked)}
                    className="mt-0.5"
                  />
                  <span className="text-sm text-text">I understand and acknowledge the above. I am submitting my citation information for document preparation assistance. I understand AppealMyTicket<span className="text-primary">S</span>.com is not a law firm and does not provide legal representation.</span>
                </label>
                {errors.disclaimerAcknowledged && <p className="text-danger text-xs">{errors.disclaimerAcknowledged}</p>}
              </div>

              <Turnstile
                siteKey="0x4AAAAAADi_eC_XdAiWpakE"
                onSuccess={onTurnstileSuccess}
                onError={onTurnstileError}
                onExpire={onTurnstileExpire}
              />
              {errors.turnstile && <p className="text-danger text-xs">{errors.turnstile}</p>}
            </>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            {step > 0 && (
              <button onClick={back} className="btn-secondary flex-1" disabled={loading}>
                ← Back
              </button>
            )}
            {step < STEPS.length - 1 ? (
              <button onClick={next} className="btn-primary flex-1" disabled={loading}>
                Next →
              </button>
            ) : (
              <button onClick={submit} className="btn-primary flex-1" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Appeal →'}
              </button>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-subtle mt-8">
          By submitting, you agree to our{' '}
          <a href="/terms" className="text-primary hover:underline">Terms of Service</a> and{' '}
          <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>
        </p>
      </div>
    </div>
  )
}
