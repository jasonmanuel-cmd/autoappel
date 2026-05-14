import Link from 'next/link'

export default function HoustonLanding() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--gradient-bg)' }}>
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block bg-primary text-white text-xs font-black px-4 py-2 rounded-full mb-6 uppercase tracking-widest">
            ✓ Professional Citation Filing Service
          </div>

          <h1 className="text-5xl md:text-6xl font-black mb-4 leading-tight">
            Don't Pay That <span className="text-primary">Traffic Ticket</span>
          </h1>

          <p className="text-xl text-muted-fg mb-4 max-w-2xl mx-auto leading-relaxed">
            Let AutoAppeal™ handle your traffic citation paperwork. Fast, professional, and hassle-free service in the Houston metro area.
          </p>

          <p className="text-muted mb-10 text-lg">
            We assist drivers with preparing and filing citation paperwork through our streamlined platform.
          </p>

          <Link href="/intake" className="btn-primary text-lg px-8 py-4 inline-block hover:scale-105 transition-transform">
            Start My Free Review →
          </Link>

          <p className="text-subtle text-sm">
            Takes less than 5 minutes. No obligation. Free consultation.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-bg-elevated/50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-12">How It Works</h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {[
              { step: '1', title: 'Upload Your Citation', desc: 'Submit your ticket details in minutes', icon: '📋' },
              { step: '2', title: 'We Review Your Case', desc: 'Our legal team analyzes your appeal options', icon: '⚖️' },
              { step: '3', title: 'We File Your Appeal', desc: 'We handle all court filings and deadlines', icon: '📤' },
              { step: '4', title: 'Track & Update', desc: 'Receive updates on your case status', icon: '✓' },
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
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-12">Why Choose AutoAppeal™?</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { icon: '⚡', title: 'Fast Service', desc: 'Most cases handled within 24 hours' },
              { icon: '✓', title: 'Proven Process', desc: 'Streamlined citation filing and tracking system' },
              { icon: '🔒', title: 'Secure & Private', desc: 'Your data is encrypted and protected' },
              { icon: '💰', title: 'Affordable', desc: 'Competitive pricing, flexible payment options' },
              { icon: '📱', title: '24/7 Tracking', desc: 'Monitor your appeal status anytime' },
              { icon: '👨‍⚖️', title: 'Expert Team', desc: 'Experienced legal professionals' },
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

      {/* Stats */}
      <section className="py-16 px-4 bg-bg-elevated/50">
        <div className="max-w-5xl mx-auto">
          <div className="card mb-6 text-center">
            <p className="text-sm text-muted">Individual results vary. We handle each citation on a case-by-case basis.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            {[
              { stat: '500+', label: 'Citations Filed' },
              { stat: 'Thousands', label: 'Happy Drivers' },
              { stat: '24hr', label: 'Typical Response Time' },
              { stat: '4.8/5', label: 'Client Rating' },
            ].map((item, i) => (
              <div key={i} className="card">
                <p className="text-4xl font-black text-primary mb-2">{item.stat}</p>
                <p className="text-muted">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Areas */}
      <section className="py-16 px-4">
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
            Not sure if we cover your area? <Link href="/contact" className="text-primary hover:underline">Contact us</Link> to confirm.
          </p>
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="py-16 px-4 bg-bg-elevated/50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-12">Common Questions</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {[
              { q: 'Will you guarantee dismissal?', a: 'We\'ll do our best, but outcomes depend on court decisions. Every case is different and results vary.' },
              { q: 'How much does it cost?', a: 'Pricing varies by citation complexity. We\'ll give you a quote after reviewing your case details.' },
              { q: 'What if I miss my deadline?', a: 'Contact us immediately. There may still be legal options available, but they become more limited.' },
              { q: 'Do I need to go to court?', a: 'Usually not. Our team handles most cases entirely on your behalf without requiring your presence.' },
            ].map((item, i) => (
              <div key={i} className="card">
                <h3 className="font-bold text-text mb-2">{item.q}</h3>
                <p className="text-muted text-sm">{item.a}</p>
              </div>
            ))}
          </div>

          <p className="text-center">
            <Link href="/faq" className="text-primary hover:underline font-semibold">View all FAQs →</Link>
          </p>
        </div>
      </section>

      {/* Security Notice */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="card bg-primary/10 border-primary/30 text-center">
            <p className="text-lg text-primary font-bold mb-2">🔒 Your Privacy is Protected</p>
            <p className="text-muted">
              We use bank-level encryption to secure all your personal and citation information. Read our <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link> for details.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4" style={{ background: 'linear-gradient(to bottom, var(--gray-900), var(--gray-800))' }}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-black mb-4">Ready to Fight Your Ticket?</h2>
          <p className="text-muted-fg text-lg mb-8">
            Stop paying for traffic citations you might be able to beat.
          </p>
          <Link href="/intake" className="btn-primary text-lg px-8 py-4 inline-block hover:scale-105 transition-transform">
            Start Your Free Review Now
          </Link>
          <p className="text-subtle text-sm mt-4">
            No credit card required. Free consultation. Takes 5 minutes.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <p className="font-black text-primary mb-4">AutoAppeal™</p>
              <p className="text-muted text-sm">Professional traffic citation appeal service for Houston.</p>
            </div>
            <div>
              <p className="font-semibold text-text mb-3">Company</p>
              <ul className="space-y-2 text-muted text-sm">
                <li><Link href="/" className="hover:text-white">Home</Link></li>
                <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-text mb-3">Legal</p>
              <ul className="space-y-2 text-muted text-sm">
                <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-text mb-3">Contact</p>
              <ul className="space-y-2 text-muted text-sm">
                <li><a href="tel:+17135550100" className="hover:text-white">(713) 555-0100</a></li>
                <li><a href="mailto:support@autoappeal.com" className="hover:text-white">support@autoappeal.com</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-8 text-center text-subtle text-sm">
            <p>© 2026 AutoAppeal™. All rights reserved. | Houston Metro Area</p>
            <p className="mt-2">This website does not constitute legal advice. Consult with an attorney for specific legal matters.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
