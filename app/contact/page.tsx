'use client'

import { useState } from 'react'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Simulate sending message
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSubmitted(true)
      setForm({ name: '', email: '', subject: '', message: '' })
      setTimeout(() => setSubmitted(false), 5000)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-12" style={{ background: 'var(--gradient-bg)' }}>
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-12">
          <h1 className="text-4xl font-black mb-3">Contact Us</h1>
          <p className="text-muted-fg text-lg">Get in touch with our support team for assistance with your appeal.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Email */}
          <div className="card text-center">
            <div className="text-3xl mb-3">📧</div>
            <h3 className="font-bold text-lg mb-2">Email</h3>
            <p className="text-muted text-sm mb-3">For non-urgent inquiries</p>
            <a href="mailto:support@autoappeal.com" className="text-primary font-semibold hover:underline">
              support@autoappeal.com
            </a>
          </div>

          {/* Phone */}
          <div className="card text-center">
            <div className="text-3xl mb-3">📞</div>
            <h3 className="font-bold text-lg mb-2">Phone</h3>
            <p className="text-muted text-sm mb-3">Mon-Fri, 9AM-6PM CST</p>
            <a href="tel:+17135550100" className="text-primary font-semibold hover:underline">
              (713) 555-0100
            </a>
          </div>

          {/* Hours */}
          <div className="card text-center">
            <div className="text-3xl mb-3">🕐</div>
            <h3 className="font-bold text-lg mb-2">Business Hours</h3>
            <p className="text-muted text-sm">
              Monday - Friday<br/>
              9:00 AM - 6:00 PM CST<br/>
              <span className="text-xs">Closed weekends & holidays</span>
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="max-w-2xl mx-auto">
          <div className="card">
            <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>

            {submitted && (
              <div className="bg-success/10 border border-success/30 rounded-lg p-4 mb-6">
                <p className="text-success">✓ Message sent successfully! We'll get back to you soon.</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Your Name</label>
                  <input
                    type="text"
                    className="input"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    required
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="label">Email Address</label>
                  <input
                    type="email"
                    className="input"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label className="label">Subject</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g., Question about my appeal status"
                  value={form.subject}
                  onChange={e => setForm({ ...form, subject: e.target.value })}
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="label">Message</label>
                <textarea
                  className="input resize-none"
                  rows={6}
                  placeholder="Tell us how we can help..."
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  required
                  disabled={loading}
                />
              </div>

              <button type="submit" className="btn-primary w-full" disabled={loading}>
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>

          {/* Additional Info */}
          <div className="mt-8 card bg-primary/5 border-primary/20">
            <h3 className="font-bold text-primary mb-3">Response Time</h3>
            <p className="text-muted text-sm">
              We aim to respond to all inquiries within 24 business hours. For urgent matters regarding deadlines, please call us immediately.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
