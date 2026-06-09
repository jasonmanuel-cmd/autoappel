import Link from 'next/link'

export default function HoustonLanding() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--gradient-bg)' }}>
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <img src="/appealmytickets-logo.png" alt="AppealMyTickets.com" className="h-16 sm:h-20 w-auto" />
          </div>

          <div className="inline-block bg-primary text-white text-xs font-black px-4 py-2 rounded-full mb-6 uppercase tracking-widest">
            ✓ Traffic Citation Assistance — Flat $149
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black mb-4 leading-tight">
            Received a Citation? <span className="text-primary">Get Your Appeal Strategy.</span>
          </h1>

          <p className="text-xl text-muted-fg mb-4 max-w-2xl mx-auto leading-relaxed">
            <strong className="text-white">From Ticket to Strategy in Minutes.</strong> AppealMyTicket<span className="text-primary">S</span>.com generates a professional, court-specific appeal strategy document to guide you through submitting your own citation appeal — all for a flat <strong className="text-white">$149</strong> per ticket.
          </p>

          <p className="text-muted mb-10 text-lg">
            We are not a law firm. We do not provide legal advice or legal representation. We provide professionally formatted strategy documents to help you prepare your own appeal submission.
          </p>

          <Link href="/intake" className="btn-primary text-lg px-8 py-4 inline-block hover:scale-105 transition-transform">
            Get Your Strategy — $149 →
          </Link>

          <p className="text-subtle text-sm">
            Takes less than 5 minutes. $149 flat fee per citation. No hidden charges. PDF delivered by email.
          </p>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 px-4 bg-bg-elevated/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-4">Simple, Transparent Pricing</h2>
          <p className="text-muted text-center mb-12 max-w-2xl mx-auto">One flat rate. No tiers. No upsells. No surprises.</p>

          <div className="max-w-md mx-auto">
            <div className="card text-center border-primary/30 bg-primary/5">
              <p className="text-subtle text-sm font-semibold uppercase tracking-widest mb-2">Per Citation</p>
              <p className="text-6xl font-black text-primary mb-2">$149</p>
              <p className="text-muted mb-6">One-time fee — includes your strategy document</p>
              <ul className="text-left text-sm text-muted space-y-3 mb-8">
                <li className="flex items-start gap-3">✓ Personalized appeal strategy document (PDF)</li>
                <li className="flex items-start gap-3">✓ Step-by-step DIY appeal instructions</li>
                <li className="flex items-start gap-3">✓ Court-specific filing guidance</li>
                <li className="flex items-start gap-3">✓ Deadline tracking and monitoring</li>
                <li className="flex items-start gap-3">✓ Real-time dashboard access</li>
                <li className="flex items-start gap-3">✓ Email and SMS deadline reminders</li>
              </ul>
              <Link href="/intake" className="btn-primary w-full inline-block">
                Get Your Strategy — $149
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Houston Founding Launch Banner */}
      <section className="py-8 px-4 bg-primary/10 border-y border-primary/30">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block bg-primary text-white text-xs font-black px-3 py-1 rounded-full mb-3 uppercase tracking-widest">
            🚀 Houston Founding Launch
          </div>
          <p className="text-lg font-bold text-white mb-1">Limited Founding Participant Availability</p>
          <p className="text-sm text-muted-fg">
            Houston-area drivers may qualify for <strong className="text-white">early-access pricing</strong> during our founding launch window. Flat $149 per citation — lock in your rate today.
          </p>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-10 px-4 border-y border-border/50">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-2xl mb-1">🔒</p>
              <p className="font-semibold text-sm">Bank-Level Encryption</p>
              <p className="text-subtle text-xs">Your personal data is encrypted in transit and at rest</p>
            </div>
            <div>
              <p className="text-2xl mb-1">📅</p>
              <p className="font-semibold text-sm">Deadline Tracking</p>
              <p className="text-subtle text-xs">Monitor key dates through your personal dashboard</p>
            </div>
            <div>
              <p className="text-2xl mb-1">💰</p>
              <p className="font-semibold text-sm">Flat $149 Pricing</p>
              <p className="text-subtle text-xs">No hidden fees, no surprises, no tiers</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-4">How It Works</h2>
          <p className="text-muted text-center mb-12 max-w-2xl mx-auto">A simple, transparent process to get your personalized appeal strategy document.</p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {[
              { step: '1', title: 'Submit Your Citation', desc: 'Tell us about your ticket — takes 5 minutes', icon: '📋' },
              { step: '2', title: 'Pay $149', desc: 'One flat fee covers everything', icon: '💳' },
              { step: '3', title: 'Get Your Strategy Document', desc: 'We generate a professional appeal strategy PDF tailored to your citation and court', icon: '📄' },
              { step: '4', title: 'Submit Your Appeal', desc: 'Follow the step-by-step guide to file your own appeal with the court', icon: '✓' },
            ].map((item, i) => (
              <div key={i} className="card text-center hover:border-primary/50 transition-colors">
                <div className="text-4xl mb-3">{item.icon}</div>
                <p className="text-primary font-black mb-2">Step {item.step}</p>
                <h3 className="font-bold mb-2">{item.title}</h3>
                <p className="text-muted text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 px-4 bg-bg-elevated/50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-12">Why Choose AppealMyTicket<span className="text-primary">S</span>.com?</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { icon: '⚡', title: 'Fast Delivery', desc: 'Most strategy documents delivered within minutes of payment' },
              { icon: '💰', title: 'Flat $149 Fee', desc: 'One price, no hidden costs, no tiered plans' },
              { icon: '🔒', title: 'Secure & Private', desc: 'Your data is encrypted and never shared without consent' },
              { icon: '📱', title: '24/7 Dashboard', desc: 'Access your strategy document and citation status anytime' },
              { icon: '📄', title: 'Professional PDF', desc: 'Court-specific strategy document with step-by-step instructions' },
              { icon: '📋', title: 'DIY Appeal Guide', desc: 'Everything you need to submit your own appeal with confidence' },
            ].map((item, i) => (
              <div key={i} className="card">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-lg mb-2 text-text">{item.title}</h3>
                <p className="text-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Response Time */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="card mb-6 text-center">
            <p className="text-sm text-muted">Your strategy document is generated after payment and delivered by email as a PDF.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="card">
              <p className="text-4xl font-black text-primary mb-2">Instant</p>
              <p className="text-muted">Strategy Document Delivery</p>
            </div>
            <div className="card">
              <p className="text-4xl font-black text-primary mb-2">$149</p>
              <p className="text-muted">Flat Fee Per Citation</p>
            </div>
            <div className="card">
              <p className="text-4xl font-black text-primary mb-2">🔒</p>
              <p className="text-muted">Encrypted Submission</p>
            </div>
          </div>
        </div>
      </section>

      {/* Service Areas */}
      <section className="py-16 px-4 bg-bg-elevated/50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-12">Houston Metro Service Areas</h2>

          <div className="card mb-8">
            <p className="text-muted mb-4">We serve the greater Houston area including:</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              {['Houston', 'Harris County', 'Fort Bend County', 'Montgomery County', 'Galveston County', 'Brazoria County', 'Chambers County', 'Spring'].map(area => (
                <div key={area} className="bg-bg-elevated rounded p-2 border border-border">
                  <p className="text-muted-fg">{area}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-center text-muted">
            Not sure if we cover your area? <Link href="/contact" className="text-primary hover:underline inline-block py-2">Contact us</Link> to confirm.
          </p>
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-12">Common Questions</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {[
              { q: 'What do I get for $149?', a: 'You receive a professionally formatted appeal strategy document (PDF) with step-by-step instructions tailored to your citation and court.' },
              { q: 'Do you file the appeal for me?', a: 'No. We provide a strategy document that guides you through filing your own appeal. We are not a law firm and do not provide legal representation.' },
              { q: 'How is the strategy document delivered?', a: 'Immediately after payment, we email the PDF directly to your inbox with detailed instructions.' },
              { q: 'What if I miss my deadline?', a: 'Contact us immediately. There may still be options available, but they become more limited.' },
            ].map((item, i) => (
              <div key={i} className="card">
                <h3 className="font-bold text-text mb-2">{item.q}</h3>
                <p className="text-muted text-sm">{item.a}</p>
              </div>
            ))}
          </div>

          <p className="text-center">
            <Link href="/faq" className="text-primary hover:underline font-semibold inline-block py-2">View all FAQs →</Link>
          </p>
        </div>
      </section>

      {/* Security Notice */}
      <section className="py-16 px-4 bg-bg-elevated/50">
        <div className="max-w-5xl mx-auto">
          <div className="card bg-primary/10 border-primary/30 text-center">
            <p className="text-lg text-primary font-bold mb-2">🔒 Your Privacy is Protected</p>
            <p className="text-muted mb-4">
              We use bank-level encryption to secure all your personal and citation information. Read our <Link href="/privacy" className="text-primary hover:underline inline-block py-2">Privacy Policy</Link> for details.
            </p>
            <p className="text-sm text-subtle">
              Your information is never sold. We only use your citation data to generate your personalized strategy document. Flat $149 fee, no surprises.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4" style={{ background: 'var(--gradient-bg)' }}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-black mb-4">Ready to Get Your Strategy?</h2>
          <p className="text-muted-fg text-lg mb-8">
            Get a professional appeal strategy document tailored to your citation. Just $149 per citation, one-time fee.
          </p>
          <Link href="/intake" className="btn-primary text-lg px-8 py-4 inline-block hover:scale-105 transition-transform">
            Get Your Strategy — $149
          </Link>
          <p className="text-subtle text-sm mt-4">
            Takes 5 minutes. Flat $149. PDF delivered by email.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src="/appealmytickets-logo.png" alt="AppealMyTickets.com" className="h-8 w-auto" />
              </div>
              <p className="text-muted text-sm">Traffic citation appeal strategy platform for Houston drivers. Flat $149 per citation. <a href="https://AppealMyTickets.com" className="text-primary hover:underline">AppealMyTicket<span className="text-primary">S</span>.com</a></p>
            </div>
            <div>
              <p className="font-semibold text-text mb-3">Company</p>
              <ul className="text-muted text-sm">
                <li><Link href="/" className="block hover:text-white py-3">Home</Link></li>
                <li><Link href="/faq" className="block hover:text-white py-3">FAQ</Link></li>
                <li><Link href="/contact" className="block hover:text-white py-3">Contact</Link></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-text mb-3">Legal</p>
              <ul className="text-muted text-sm">
                <li><Link href="/terms" className="block hover:text-white py-3">Terms of Service</Link></li>
                <li><Link href="/privacy" className="block hover:text-white py-3">Privacy Policy</Link></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-text mb-3">Contact</p>
              <ul className="text-muted text-sm">
                <li><a href="tel:+19493508804" className="block hover:text-white py-3">(949) 350-8804</a></li>
                <li><a href="mailto:info@lagnafnetwork.com" className="block hover:text-white py-3">info@lagnafnetwork.com</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-8 text-center text-subtle text-sm">
            <p>© 2026 AppealMyTicket<span className="text-primary">S</span>.com. All rights reserved. | Houston Metro Area</p>
            <p className="mt-2">AppealMyTicket<span className="text-primary">S</span>.com generates appeal strategy documents to guide users through self-representation. We are not a law firm and do not provide legal representation or legal advice.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
