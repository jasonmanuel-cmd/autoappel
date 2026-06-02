'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const PLANS = [
  { id: 'basic', name: 'Basic Filing', price: 49, desc: 'Standard citation paperwork processing' },
  { id: 'premium', name: 'Premium Review', price: 99, desc: 'Expedited review with attorney consultation' },
  { id: 'full', name: 'Full Representation', price: 249, desc: 'Complete legal handling of your citation' },
];

export default function PaymentPage() {
  const router = useRouter();
  const [step, setStep] = useState<'plan' | 'payment' | 'processing' | 'receipt'>('plan');
  const [selectedPlan, setSelectedPlan] = useState<typeof PLANS[0] | null>(null);
  const [status, setStatus] = useState<'idle' | 'success' | 'failure'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [squareUrl, setSquareUrl] = useState('');

  const selectPlan = async (plan: typeof PLANS[0]) => {
    setSelectedPlan(plan);
    setStep('payment');

    // Create Square checkout session
    try {
      const res = await fetch('/api/payment/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: plan.id, amount: plan.price }),
      });
      const data = await res.json();
      if (data.url) {
        setSquareUrl(data.url);
      }
    } catch (err) {
      console.error('Checkout error:', err);
    }
  };

  const handleSquareRedirect = () => {
    if (squareUrl) {
      window.location.href = squareUrl;
    } else {
      setErrorMsg('Payment link not ready. Please try again.');
    }
  };

  return (
    <div className="min-h-screen py-12 px-4" style={{ background: 'var(--gradient-bg)' }}>
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-muted text-sm hover:text-white mb-6 inline-block">
          ← Back to Home
        </Link>

        <h1 className="text-3xl font-black mb-2">Complete Your Payment</h1>
        <p className="text-muted-fg mb-8">Secure payment powered by Square.</p>

        {/* Step indicator */}
        <div className="flex gap-2 mb-8">
          {[{ id: 'plan', label: 'Plan' }, { id: 'payment', label: 'Payment' }, { id: 'processing', label: 'Processing' }, { id: 'receipt', label: 'Receipt' }].map((s) => {
            const order = ['plan', 'payment', 'processing', 'receipt'];
            const stepIdx = order.indexOf(step);
            const sIdx = order.indexOf(s.id);
            return (
              <div key={s.id} className="flex-1 text-center">
                <div className={`h-2 rounded-full mb-1 ${stepIdx > sIdx ? 'bg-success' : step === s.id ? 'bg-primary' : 'bg-border'}`} />
                <p className={`text-xs font-semibold ${stepIdx > sIdx ? 'text-success' : step === s.id ? 'text-primary' : 'text-subtle'}`}>{s.label}</p>
              </div>
            );
          })}
        </div>

        {/* Plan Selection */}
        {step === 'plan' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-primary mb-4">Choose a Service</h2>
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

        {/* Payment Step */}
        {step === 'payment' && selectedPlan && (
          <div className="card space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <h2 className="text-xl font-bold text-primary">Secure Payment</h2>
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

            <div className="bg-success/5 border border-success/20 rounded-lg p-4 text-sm">
              <p className="font-semibold text-success mb-1">🔒 Secure Checkout via Square</p>
              <p className="text-muted text-xs">You will be redirected to Square's secure payment page to complete your purchase. We never store your card details.</p>
            </div>

            {errorMsg && <p className="text-danger text-sm">{errorMsg}</p>}

            <div className="flex gap-3 pt-2">
              <button onClick={() => setStep('plan')} className="btn-secondary flex-1">Back</button>
              <button onClick={handleSquareRedirect} className="btn-primary flex-1">
                Pay ${selectedPlan.price} via Square
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
