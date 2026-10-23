import Link from 'next/link'
export default function PaymentPage() {
  return <section className="max-w-xl mx-auto p-8"><h1 className="text-2xl font-bold">Secure payments</h1><p className="my-4">We only collect the strategy service fee through Square hosted checkout. Pay court fines directly to your court; we do not collect court fines or card details.</p><Link className="btn-primary" href="/dashboard">View your citations</Link></section>
}
