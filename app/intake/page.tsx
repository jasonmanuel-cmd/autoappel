'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { store } from '@/lib/store'
import type { Citation } from '@/lib/types'

const STEPS = ['Contact', 'Citation Details', 'Upload & Submit']

const VIOLATION_TYPES = [
  'Speeding', 'Red Light', 'Stop Sign', 'Lane Change', 'No Insurance',
  'Registration', 'Cell Phone', 'Failure to Yield', 'Reckless Driving', 'Other',
]

export default function IntakePage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    preferredContact: 'email' as 'email' | 'sms' | 'both',
    citationNumber: '', citationDate: '', responseDeadline: '',
    county: '', court: '', jurisdiction: '', violationType: '',
    referralSource: '', ambassadorId: '',
  })

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const validateStep = () => {
    const e: Record<string, string> = {}
    if (step === 0) {
      if (!form.firstName) e.firstName = 'Required'
      if (!form.lastName)  e.lastName  = 'Required'
      if (!form.email)     e.email     = 'Required'
      if (!form.phone)     e.phone     = 'Required'
    }
    if (step === 1) {
      if (!form.citationNumber) e.citationNumber = 'Required'
      if (!form.citationDate)   e.citationDate   = 'Required'
      if (!form.county)         e.county         = 'Required'
      if (!form.violationType)  e.violationType  = 'Required'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const next = () => { if (validateStep()) setStep(s => s + 1) }
  const back = () => setStep(s => s - 1)

  const submit = () => {
    if (!validateStep()) return
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
    router.push(`/countdown?id=${citation.id}`)
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
      />
      {errors[key] && <p className="text-red-400 text-xs mt-1">{errors[key]}</p>}
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-black mb-2">Start My Ticket Review</h1>
      <p className="text-[#5b7fa6] mb-8">Houston AutoAppeal™ Citation Intake</p>

      <div className="flex gap-2 mb-8">
        {STEPS.map((s, i) => (
          <div key={s} className="flex-1">
            <div className={`h-1 rounded ${i <= step ? 'bg-[#1d6ef3]' : 'bg-[#1a3355]'}`} />
            <p className={`text-xs mt-1 ${i === step ? 'text-white' : 'text-[#27415e]'}`}>{s}</p>
          </div>
        ))}
      </div>

      <div className="card space-y-4">
        {step === 0 && (
          <>
            <div className="grid grid-cols-2 gap-4">
              {field('First Name', 'firstName', 'text', 'John')}
              {field('Last Name', 'lastName', 'text', 'Smith')}
            </div>
            {field('Email Address', 'email', 'email', 'john@email.com')}
            {field('Phone Number', 'phone', 'tel', '(713) 555-0100')}
            <div>
              <label className="label">Preferred Contact Method</label>
              <select className="input" value={form.preferredContact} onChange={e => set('preferredContact', e.target.value)}>
                <option value="email">Email</option>
                <option value="sms">SMS/Text</option>
                <option value="both">Both</option>
              </select>
            </div>
          </>
        )}

        {step === 1 && (
          <>
            {field('Citation Number', 'citationNumber', 'text', 'TX-2026-XXXXXX')}
            {field('Citation Date', 'citationDate', 'date')}
            {field('Response Deadline (if visible)', 'responseDeadline', 'date')}
            {field('County', 'county', 'text', 'Harris County')}
            {field('Court / Jurisdiction', 'court', 'text', 'Houston Municipal Court')}
            {field('City/Jurisdiction', 'jurisdiction', 'text', 'Houston, TX')}
            <div>
              <label className="label">Violation Type</label>
              <select className="input" value={form.violationType} onChange={e => set('violationType', e.target.value)}>
                <option value="">Select violation type...</option>
                {VIOLATION_TYPES.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
              {errors.violationType && <p className="text-red-400 text-xs mt-1">{errors.violationType}</p>}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="border-2 border-dashed border-[#1a3355] rounded-lg p-8 text-center">
              <p className="text-[#5b7fa6] mb-2">📎 Citation Upload</p>
              <p className="text-sm text-[#27415e]">Drag & drop your citation image or PDF</p>
              <input type="file" accept="image/*,.pdf" className="hidden" id="upload" />
              <label htmlFor="upload" className="btn-secondary mt-4 inline-block cursor-pointer text-sm">
                Browse Files
              </label>
              <p className="text-xs text-[#27415e] mt-2">JPG, PNG, or PDF · Max 10MB</p>
            </div>
            {field('Ambassador / Referral ID (optional)', 'ambassadorId', 'text', 'AMB-XXXX')}
            {field('How did you hear about us?', 'referralSource', 'text', 'Friend, social media...')}
            <div className="bg-[#08111e] border border-[#1a3355] rounded-lg p-4 text-sm text-[#5b7fa6]">
              <p className="font-semibold text-[#8aafd4] mb-2">Review Summary</p>
              <p>Name: {form.firstName} {form.lastName}</p>
              <p>Citation #: {form.citationNumber}</p>
              <p>Violation: {form.violationType}</p>
              <p>Deadline: {form.responseDeadline || 'Not provided'}</p>
              <p>County: {form.county}</p>
            </div>
          </>
        )}

        <div className="flex gap-3 pt-2">
          {step > 0 && (
            <button onClick={back} className="btn-secondary flex-1">← Back</button>
          )}
          {step < STEPS.length - 1 ? (
            <button onClick={next} className="btn-primary flex-1">Next →</button>
          ) : (
            <button onClick={submit} className="btn-primary flex-1">Submit My Appeal →</button>
          )}
        </div>
      </div>
    </div>
  )
}
