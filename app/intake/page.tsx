'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { store } from '@/lib/store'
import type { Citation } from '@/lib/types'

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

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    preferredContact: 'email' as 'email' | 'sms' | 'both',
    citationNumber: '', citationDate: '', responseDeadline: '',
    county: '', court: '', jurisdiction: '', violationType: '',
  })

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

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
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      store.saveCitation(citation)
      
      // Simulate sending confirmation email
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      router.push(`/confirmation?id=${citation.id}`)
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
      {errors[key] && <p className="text-red-400 text-xs mt-1">{errors[key]}</p>}
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#070d18] to-[#0d1b2e] py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-black mb-2">Start Your Appeal</h1>
          <p className="text-[#8aafd4]">Complete this form to begin your Houston traffic citation appeal process.</p>
        </div>

        {/* Progress Bar */}
        <div className="flex gap-2 mb-10">
          {STEPS.map((s, i) => (
            <div key={s} className="flex-1">
              <div className={`h-2 rounded-full transition-colors ${i <= step ? 'bg-[#1d6ef3]' : 'bg-[#1a3355]'}`} />
              <p className={`text-xs font-semibold mt-2 ${i === step ? 'text-[#1d6ef3]' : i < step ? 'text-[#4ade80]' : 'text-[#27415e]'}`}>{s}</p>
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="card space-y-6">
          {step === 0 && (
            <>
              <h2 className="text-xl font-bold text-[#1d6ef3] mb-4">Your Contact Information</h2>
              <div className="grid grid-cols-2 gap-4">
                {field('First Name', 'firstName', 'text', 'John')}
                {field('Last Name', 'lastName', 'text', 'Smith')}
              </div>
              {field('Email Address', 'email', 'email', 'john@email.com')}
              {field('Phone Number', 'phone', 'tel', '(713) 555-0100')}
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
              <h2 className="text-xl font-bold text-[#1d6ef3] mb-4">Citation Information</h2>
              {field('Citation Number', 'citationNumber', 'text', 'TX-2026-XXXXXX')}
              {field('Citation Date', 'citationDate', 'date')}
              {field('Response Deadline', 'responseDeadline', 'date')}
              <p className="text-xs text-[#27415e]">If you know your response deadline, enter it here. This helps us track urgency.</p>
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
                {errors.county && <p className="text-red-400 text-xs mt-1">{errors.county}</p>}
              </div>
              {field('Court Name', 'court', 'text', 'Houston Municipal Court')}
              {field('City/Jurisdiction', 'jurisdiction', 'text', 'Houston, TX')}
              <div>
                <label className="label">Violation Type</label>
                <select className="input" value={form.violationType} onChange={e => set('violationType', e.target.value)} disabled={loading}>
                  <option value="">Select violation type...</option>
                  {VIOLATION_TYPES.map(v => <option key={v} value={v}>{v}</option>)}
                </select>
                {errors.violationType && <p className="text-red-400 text-xs mt-1">{errors.violationType}</p>}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="text-xl font-bold text-[#1d6ef3] mb-4">Review Your Information</h2>
              <div className="bg-[#08111e] border border-[#1a3355] rounded-lg p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-[#27415e] font-semibold">Full Name</p>
                    <p className="text-[#e8f1ff]">{form.firstName} {form.lastName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#27415e] font-semibold">Email</p>
                    <p className="text-[#e8f1ff]">{form.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#27415e] font-semibold">Phone</p>
                    <p className="text-[#e8f1ff]">{form.phone}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#27415e] font-semibold">Preferred Contact</p>
                    <p className="text-[#e8f1ff] capitalize">{form.preferredContact.replace('both', 'Email & SMS')}</p>
                  </div>
                </div>

                <div className="border-t border-[#1a3355] pt-4 mt-4">
                  <h3 className="font-bold text-[#1d6ef3] mb-3">Citation Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-[#27415e] font-semibold">Citation #</p>
                      <p className="text-[#e8f1ff]">{form.citationNumber}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#27415e] font-semibold">Violation</p>
                      <p className="text-[#e8f1ff]">{form.violationType}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#27415e] font-semibold">Citation Date</p>
                      <p className="text-[#e8f1ff]">{form.citationDate}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#27415e] font-semibold">Response Deadline</p>
                      <p className="text-[#e8f1ff]">{form.responseDeadline || 'Not provided'}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs text-[#27415e] font-semibold">Court</p>
                      <p className="text-[#e8f1ff]">{form.court}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-[#1d6ef3]/10 border border-[#1d6ef3]/30 rounded-lg p-4 mt-4">
                  <p className="text-sm text-[#1d6ef3]">✓ Your information is secure and encrypted. We'll send you regular updates about your appeal status.</p>
                </div>
              </div>
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

        <p className="text-center text-xs text-[#27415e] mt-8">
          By submitting, you agree to our{' '}
          <a href="/terms" className="text-[#1d6ef3] hover:underline">Terms of Service</a> and{' '}
          <a href="/privacy" className="text-[#1d6ef3] hover:underline">Privacy Policy</a>
        </p>
      </div>
    </div>
  )
}
