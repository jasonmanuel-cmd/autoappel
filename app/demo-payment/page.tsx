'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { store } from '@/lib/store'
import { api } from '@/lib/api'

const PLANS = [
  { id: 'basic', name: 'Basic Filing', price: 49, desc: 'Standard citation paperwork assistance' },
  { id: 'premium', name: 'Premium Review', price: 99, desc: 'Expedited review with detailed case analysis' },
  { id: 'full', name: 'Full Service Package', price: 249, desc: 'Complete citation document preparation and filing guidance' },
]

export default function DemoPaymentPage() {
  const router = useRouter()
  const [demo, setDemo] = useState(false)
  const [step, setStep] = useState<'plan' | 'payment' | 'processing' | 'receipt'>('plan')
  const [selectedPlan, setSelectedPlan] = useState<typeof PLANS[0] | null>(null)
  const [cardNumber, setCardNumber] = useState('')
  const [cardExp, setCardExp] = useState('')
  const [cardCvc, setCardCvc] = useState('')
  const [status, setStatus] = useState<'idle' | 'success' | 'failure'>('idle')
  const [sessionId, setSessionId] = useState('')
  const [logs, setLogs] = useState<string[]>([])
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    const isDemo = store.getDemoMode()
    setDemo(isDemo)
    if (!isDemo) return
  }, [])

  const log = (msg: string) => setLogs(p => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...p].slice(0, 10))

  const selectPlan = async (plan: typeof PLANS[0]) => {
    setSelectedPlan(plan)
    setStep('payment')
    log(`Selected plan: ${plan.name} ($${plan.price})`)
  }

  const handlePayment = async (fail = false) => {
    if (!selectedPlan) return
    setErrorMsg('')
    setStep('processing')
    setStatus('idle')

    if (!cardNumber.trim() || !cardExp.trim() || !cardCvc.trim()) {
      setErrorMsg('Please fill in all card fields')
      setStep('payment')
      return
    }

    if (cardNumber.replace(/\s/g, '').length < 16) {
      setErrorMsg('Card number must be 16 digits')
      setStep('payment')
      return
    }

    try {
      const session = await api.createCheckoutSession(selectedPlan.price, selectedPlan.name)
      if (!session.data) throw new Error('Failed to create checkout session')

      setSessionId(session.data.id)
      log(`Checkout session created: ${session.data.id}`)

      if (fail) {
        const result = await api.simulatePaymentFailure(session.data.id)
        log(`Payment simulation: DECLINED (card ending in ${cardNumber.slice(-4)})`)
        setStatus('failure')
      } else {
        const result = await api.simulatePayment(session.data.id)
        log(`Payment simulation: SUCCESS (card ending in ${cardNumber.slice(-4)})`)
        setStatus('success')
      }
    } catch (err) {
      setErrorMsg('Payment processing error (simulated)')
      setStep('payment')
      return
    }

    setStep('receipt')
  }

  const formatCard = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 16)
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ')
  }

  if (!demo) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--gradient-bg)' }}>
        <div className="card text-center max-w-md">
          <h1 className="text-2xl font-black mb-3">Demo Mode Required</h1>
          <p className="text-muted mb-6">Enable demo mode via the login page to access the payment simulator.</p>
          <Link href="/login" className="btn-primary">Go to Login</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 px-4" style={{ background: 'var(--gradient-bg)' }}>
      <div className="max-w-2xl mx-auto">
        {/* Back link */}
        <Link href="/test-dashboard" className="text-muted text-sm hover:text-white mb-6 inline-block">
          ← Back to Test Dashboard
        </Link>

        <h1 className="text-3xl font-black mb-2">Payment Simulator</h1>
        <p className="text-muted-fg mb-8">Test the payment flow with a simulated checkout experience.</p>

        {/* Step indicator */}
        <div className="flex gap-2 mb-8">
          {[{ id: 'plan', label: 'Plan' }, { id: 'payment', label: 'Payment' }, { id: 'processing', label: 'Processing' }, { id: 'receipt', label: 'Receipt' }].map((s, i) => {
            const order = ['plan', 'payment', 'processing', 'receipt']
            const stepIdx = order.indexOf(step)
            const sIdx = order.indexOf(s.id)
            const isDone = stepIdx > sIdx
            const isCurrent = step === s.id
            return (
              <div key={s.id} className="flex-1 text-center">
                <div className={`h-2 rounded-full mb-1 ${isDone ? 'bg-success' : isCurrent ? 'bg-primary' : 'bg-border'}`} />
                <p className={`text-xs font-semibold ${isDone ? 'text-success' : isCurrent ? 'text-primary' : 'text-subtle'}`}>{s.label}</p>
              </div>
            )
          })}
        </div>

        {/* Step: Plan Selection */}
        {step === 'plan' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-primary mb-4">Choose a Service Plan</h2>
            <div className="grid gap-4">
              {PLANS.map(plan => (
                <button
                  key={plan.id}
                  onClick={() => selectPlan(plan)}
                  className="card text-left hover:border-primary/50 transition-colors cursor-pointer w-full"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-lg mb-1">{plan.name}</h3>
                      <p className="text-muted text-sm">{plan.desc}</p>
                    </div>
                    <div className="text-2xl font-black text-primary">${plan.price}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step: Payment Details */}
        {step === 'payment' && selectedPlan && (
          <div className="card space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <h2 className="text-xl font-bold text-primary">Payment Details</h2>
              <div className="text-right">
                <p className="text-xs text-subtle">Total</p>
                <p className="text-2xl font-black">${selectedPlan.price}</p>
              </div>
            </div>

            <div className="bg-bg-elevated border border-border rounded-lg p-4">
              <p className="text-xs text-subtle font-semibold mb-2">Order Summary</p>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted">{selectedPlan.name}</span>
                <span className="text-text font-semibold">${selectedPlan.price}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="label">Card Number</label>
                <input
                  className="input"
                  placeholder="4242 4242 4242 4242"
                  value={cardNumber}
                  onChange={e => setCardNumber(formatCard(e.target.value))}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Expiry Date</label>
                  <input className="input" placeholder="12/28" value={cardExp} onChange={e => setCardExp(e.target.value.replace(/\D/g, '').slice(0, 4).replace(/^(\d{2})/, '$1/').replace(/\/$/, ''))} />
                </div>
                <div>
                  <label className="label">CVC</label>
                  <input className="input" placeholder="123" value={cardCvc} onChange={e => setCardCvc(e.target.value.replace(/\D/g, '').slice(0, 3))} />
                </div>
              </div>
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 text-xs text-muted">
              <p className="font-semibold text-primary mb-1">🔬 Demo Mode</p>
              <p>Test with any card number (16 digits). Use the &quot;Simulate Failure&quot; button to test declined payment handling.</p>
            </div>

            {errorMsg && <p className="text-danger text-sm">{errorMsg}</p>}

            <div className="flex gap-3 pt-2">
              <button onClick={() => setStep('plan')} className="btn-secondary flex-1">Back</button>
              <button onClick={() => handlePayment(false)} className="btn-primary flex-1">Pay ${selectedPlan.price}</button>
              <button onClick={() => handlePayment(true)} className="bg-danger/20 hover:bg-danger/30 text-danger font-bold py-3 px-4 rounded-lg transition-colors text-sm">
                Simulate Failure
              </button>
            </div>
          </div>
        )}

        {/* Step: Processing */}
        {step === 'processing' && (
          <div className="card text-center py-16">
            <div className="text-5xl mb-4 animate-pulse">⏳</div>
            <h2 className="text-2xl font-black mb-3">Processing Payment...</h2>
            <p className="text-muted">Please wait while we process your payment.</p>
            <div className="mt-6 w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        )}

        {/* Step: Receipt */}
        {step === 'receipt' && (
          <div className="card space-y-6">
            {status === 'success' ? (
              <>
                <div className="text-center py-6">
                  <div className="text-6xl mb-4">✓</div>
                  <h2 className="text-2xl font-black text-success mb-2">Payment Successful!</h2>
                  <p className="text-muted">Your payment has been processed.</p>
                </div>
                <div className="bg-bg-elevated border border-border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Session ID</span>
                    <span className="text-text font-mono text-xs">{sessionId}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Amount</span>
                    <span className="text-text font-bold">${selectedPlan?.price}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Service</span>
                    <span className="text-text">{selectedPlan?.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Payment Method</span>
                    <span className="text-text">Visa ending in {cardNumber.slice(-4)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Receipt #</span>
                    <span className="text-text font-mono text-xs">RCP-{sessionId.slice(-6).toUpperCase()}</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="text-center py-6">
                  <div className="text-6xl mb-4">✕</div>
                  <h2 className="text-2xl font-black text-danger mb-2">Payment Declined</h2>
                  <p className="text-muted">The card was declined. This is a simulated failure — try again with the success flow.</p>
                </div>
                <div className="bg-danger/5 border border-danger/30 rounded-lg p-4 text-sm text-danger">
                  <p className="font-semibold mb-1">Declined: simulated_card_declined</p>
                  <p className="text-xs text-muted">Your card was declined. Please try a different payment method or contact your bank.</p>
                </div>
              </>
            )}

            <div className="flex gap-3 pt-2">
              <button onClick={() => { setStep('plan'); setSelectedPlan(null); setCardNumber(''); setCardExp(''); setCardCvc(''); setErrorMsg('') }} className="btn-secondary flex-1">
                {status === 'success' ? 'New Payment' : 'Try Again'}
              </button>
              <Link href="/test-dashboard" className="btn-primary flex-1 text-center">
                Back to Dashboard
              </Link>
            </div>
          </div>
        )}

        {/* Activity Log */}
        <div className="card mt-6">
          <h3 className="font-bold text-sm mb-3">API Activity Log</h3>
          {logs.length === 0 ? (
            <p className="text-subtle text-xs">No API calls yet.</p>
          ) : (
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {logs.map((l, i) => (
                <p key={i} className="text-xs text-muted font-mono">{l}</p>
              ))}
            </div>
          )}
        </div>

        {/* Test Card Reference */}
        <div className="card mt-4 bg-bg-elevated">
          <h3 className="font-bold text-sm mb-2">🧪 Test Cards (for demo only)</h3>
          <div className="text-xs text-muted space-y-1">
            <p><span className="font-mono text-text">4242 4242 4242 4242</span> — Visa (success)</p>
            <p><span className="font-mono text-text">4000 0000 0000 0002</span> — Visa (declined, use Simulate Failure)</p>
            <p>Any 16-digit number works. Expiry and CVC are not validated.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
