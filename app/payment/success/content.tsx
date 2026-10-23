'use client'
import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
export default function SuccessContent() {
  const citationId = useSearchParams().get('citation_id')
  const [state, setState] = useState<'checking'|'sent'|'error'>('checking')
  const [message, setMessage] = useState('')
  const verify = useCallback(async () => {
    if (!citationId) { setState('error'); setMessage('Choose a citation from your dashboard.'); return }
    setState('checking')
    try {
      const response = await fetch('/api/citations/generate-strategy', { method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify({ citationId }) })
      const data = await response.json()
      if (!response.ok || !data.success) throw new Error(data.error || 'Unable to confirm payment')
      setState('sent')
    } catch (e) { setState('error'); setMessage(e instanceof Error ? e.message : 'Please retry later') }
  }, [citationId])
  useEffect(() => { void verify() }, [verify])
  return <section className="max-w-2xl mx-auto p-8"><div className="card text-center">
    <h1 className="text-3xl font-bold mb-4">{state === 'sent' ? 'Payment confirmed — strategy sent' : 'Confirming your service payment'}</h1>
    {state === 'checking' && <p role="status">Checking payment and preparing your strategy document…</p>}
    {state === 'sent' && <p>Your strategy PDF has been sent to your account email. Check your inbox and spam folder.</p>}
    {state === 'error' && <><p role="alert" className="mb-4">{message}</p><button className="btn-primary" onClick={verify}>Retry verification / delivery</button></>}
    <p className="mt-6"><Link href="/dashboard" className="text-primary">Return to dashboard</Link></p>
  </div></section>
}
