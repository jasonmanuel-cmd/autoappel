import Link from 'next/link'

export default function HoustonLanding() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#070d18] via-[#0d1b2e] to-[#070d18]">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block bg-[#1d6ef3] text-white text-xs font-black px-4 py-2 rounded-full mb-6 uppercase tracking-widest">
            ✓ Professional Traffic Appeal Service
          </div>
          
          <h1 className="text-5xl md:text-6xl font-black mb-4 leading-tight">
            Don't Pay That <span className="text-[#1d6ef3]">Traffic Ticket</span>
          </h1>
          
          <p className="text-xl text-[#8aafd4] mb-4 max-w-2xl mx-auto leading-relaxed">
            Let AutoAppeal™ fight your traffic citation for you. Fast, professional, and proven results in the Houston metro area.
          </p>
          
          <p className="text-[#5b7fa6] mb-10 text-lg">
            Our legal team has helped hundreds of drivers get their citations dismissed or reduced.
          </p>

          <Link href="/intake" className="btn-primary text-lg px-8 py-4 inline-block mb-8 hover:scale-105 transition-transform">
            Start My Free Review →
          </Link>

          <p className="text-[#27415e] text-sm">
            Takes less than 5 minutes. No obligation. Free consultation.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-[#08111e]/50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-12">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {[
              { step: '1', title: 'Upload Your Citation', desc: 'Submit your ticket details in minutes', icon: '📋' },
              { step: '2', title: 'We Review Your Case', desc: 'Our legal team analyzes your appeal options', icon: '⚖️' },
              { step: '3', title: 'We File Your Appeal', desc: 'We handle all court filings and deadlines', icon: '📤' },
              { step: '4', title: 'Track & Update', desc: 'Receive updates on your case status', icon: '✓' },
            ].map((item, i) => (
              <div key={i} className="card text-center hover:border-[#1d6ef3]/50 transition-colors">
                <div className="text-4xl mb-3">{item.icon}</div>
                <p className="text-[#1d6ef3] font-black mb-2">Step {item.step}</p>
                <h3 className="font-bold mb-2">{item.title}</h3>
                <p className="text-[#5b7fa6] text-sm">{item.desc}</p>
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
              { icon: '✓', title: 'Success Rate', desc: 'High dismissal and reduction rate' },
              { icon: '🔒', title: 'Secure & Private', desc: 'Your data is encrypted and protected' },
              { icon: '💰', title: 'Affordable', desc: 'Competitive pricing, flexible payment options' },
              { icon: '📱', title: '24/7 Tracking', desc: 'Monitor your appeal status anytime' },
              { icon: '👨‍⚖️', title: 'Expert Team', desc: 'Experienced legal professionals' },
            ].map((item, i) => (
              <div key={i} className="card">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-lg mb-2 text-white">{item.title}</h3>
                <p className="text-[#5b7fa6]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4 bg-[#08111e]/50">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            {[
              { stat: '500+', label: 'Citations Handled' },
              { stat: '78%', label: 'Dismissal Rate' },
              { stat: '24hr', label: 'Average Response' },
              { stat: '5/5', label: 'Average Rating' },
            ].map((item, i) => (
              <div key={i} className="card">
                <p className="text-4xl font-black text-[#1d6ef3] mb-2">{item.stat}</p>
                <p className="text-[#5b7fa6]">{item.label}</p>
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
            <p className="text-[#5b7fa6] mb-4">We serve the greater Houston area including:</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              {['Houston', 'Harris County', 'Fort Bend County', 'Montgomery County', 'Galveston County', 'Brazoria County', 'Chambers County', 'Spring'].map(area => (
                <div key={area} className="bg-[#08111e] rounded p-2 border border-[#1a3355]">
                  <p className="text-[#8aafd4]">{area}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-center text-[#5b7fa6]">
            Not sure if we cover your area? <Link href="/contact" className="text-[#1d6ef3] hover:underline">Contact us</Link> to confirm.
          </p>
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="py-16 px-4 bg-[#08111e]/50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-12">Common Questions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {[
              { q: 'Will you guarantee dismissal?', a: 'We\'ll do our best, but outcomes depend on court decisions. Most of our cases are dismissed or significantly reduced.' },
              { q: 'How much does it cost?', a: 'Pricing varies by citation complexity. We\'ll give you a quote after reviewing your case details.' },
              { q: 'What if I miss my deadline?', a: 'Contact us immediately. There may still be legal options available, but they become more limited.' },
              { q: 'Do I need to go to court?', a: 'Usually not. Our team handles most cases entirely on your behalf without requiring your presence.' },
            ].map((item, i) => (
              <div key={i} className="card">
                <h3 className="font-bold text-white mb-2">{item.q}</h3>
                <p className="text-[#5b7fa6] text-sm">{item.a}</p>
              </div>
            ))}
          </div>

          <p className="text-center">
            <Link href="/faq" className="text-[#1d6ef3] hover:underline font-semibold">View all FAQs →</Link>
          </p>
        </div>
      </section>

      {/* Security Notice */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="card bg-[#1d6ef3]/10 border-[#1d6ef3]/30 text-center">
            <p className="text-lg text-[#1d6ef3] font-bold mb-2">🔒 Your Privacy is Protected</p>
            <p className="text-[#5b7fa6]">
              We use bank-level encryption to secure all your personal and citation information. Read our <Link href="/privacy" className="text-[#1d6ef3] hover:underline">Privacy Policy</Link> for details.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-gradient-to-b from-[#070d18] to-[#0d1b2e]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-black mb-4">Ready to Fight Your Ticket?</h2>
          <p className="text-[#8aafd4] text-lg mb-8">
            Stop paying for traffic citations you might be able to beat.
          </p>
          <Link href="/intake" className="btn-primary text-lg px-8 py-4 inline-block hover:scale-105 transition-transform">
            Start Your Free Review Now
          </Link>
          <p className="text-[#27415e] text-sm mt-4">
            No credit card required. Free consultation. Takes 5 minutes.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1a3355] py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <p className="font-black text-[#1d6ef3] mb-4">AutoAppeal™</p>
              <p className="text-[#5b7fa6] text-sm">Professional traffic citation appeal service for Houston.</p>
            </div>
            <div>
              <p className="font-semibold text-white mb-3">Company</p>
              <ul className="space-y-2 text-[#5b7fa6] text-sm">
                <li><Link href="/" className="hover:text-white">Home</Link></li>
                <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-white mb-3">Legal</p>
              <ul className="space-y-2 text-[#5b7fa6] text-sm">
                <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-white mb-3">Contact</p>
              <ul className="space-y-2 text-[#5b7fa6] text-sm">
                <li><a href="tel:+17135550100" className="hover:text-white">(713) 555-0100</a></li>
                <li><a href="mailto:support@autoappeal.com" className="hover:text-white">support@autoappeal.com</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-[#1a3355] pt-8 text-center text-[#27415e] text-sm">
            <p>© 2026 AutoAppeal™. All rights reserved. | Houston Metro Area</p>
            <p className="mt-2">This website does not constitute legal advice. Consult with an attorney for specific legal matters.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
