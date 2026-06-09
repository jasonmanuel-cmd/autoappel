export default function TermsPage() {
  return (
    <div className="min-h-screen py-12" style={{ background: 'var(--gradient-bg)' }}>
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-black mb-8">Terms of Service</h1>
        <p className="text-muted-fg mb-8 text-sm">Last updated: May 12, 2026</p>

        <div className="space-y-8">
          {[
            { title: '1. Acceptance of Terms', content: 'By accessing and using the AppealMyTickets.com website and services, you accept and agree to be bound by the terms of this agreement. If you do not agree to abide by the above, please do not use this service.' },
            { title: '2. Service Description', content: 'AppealMyTickets.com provides traffic citation appeal assistance services. We help customers prepare the documentation needed to appeal traffic citations in the Houston metro area. Our services are subject to applicable laws and regulations.' },
            { title: '3. User Responsibilities', content: 'You agree to:', list: ['Provide accurate and complete information', 'Maintain confidentiality of your account', 'Not use our services for any illegal purpose', 'Not interfere with the operation of our website', 'Respond to our communications in a timely manner', 'Notify us of any changes to your information'] },
            { title: '4. Fees and Payment', content: 'Our service fee is a flat $149 per citation submission. Payment is due before services begin. All payments are processed securely through our payment provider. Fees are non-refundable once services have been rendered, unless otherwise specified. We do not offer tiered pricing or hidden fees.' },
            { title: '5. No Guarantee of Outcome', content: 'We cannot guarantee any specific outcome or result. Court decisions depend on many factors beyond our control. We provide our best professional efforts in preparing and filing your appeal, but the final decision rests with the court.' },
            { title: '6. Limitation of Liability', content: 'In no event shall AppealMyTickets.com, its employees, or agents be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, arising from or in connection with your use of our services.' },
            { title: '7. Intellectual Property', content: 'All content on our website, including text, graphics, logos, and images, are the property of AppealMyTickets.com or our content suppliers and are protected by copyright laws. You may not reproduce or distribute any content without permission.' },
            { title: '8. Confidentiality', content: 'All information provided to us regarding your citation and case is kept confidential. We will not disclose your information except as required by law or with your explicit consent.' },
            { title: '9. Termination', content: 'We reserve the right to terminate service to any user who violates these terms or engages in conduct harmful to our business or other users. You may terminate service at any time by contacting us in writing.' },
            { title: '10. Modifications to Terms', content: 'We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting to our website. Your continued use of our services following any modifications constitutes acceptance of the updated terms.' },
            { title: '11. Governing Law', content: 'These terms and conditions are governed by and construed in accordance with the laws of the State of Texas, and you irrevocably submit to the exclusive jurisdiction of the courts located in Harris County, Texas.' },
          ].map((s, i) => (
            <div key={i} className="card">
              <h2 className="text-2xl font-bold text-primary mb-4">{s.title}</h2>
              {s.content && <p className="text-muted mb-3">{s.content}</p>}
              {s.list && (
                <ul className="text-muted space-y-2 list-disc list-inside">
                  {s.list.map((item, j) => <li key={j}>{item}</li>)}
                </ul>
              )}
            </div>
          ))}

          {/* Contact */}
          <div className="card bg-primary/10 border-primary/30">
            <h2 className="text-2xl font-bold text-primary mb-4">12. Contact Us</h2>
            <p className="text-muted">If you have any questions about these Terms of Service, please contact us at{' '}
              <a href="mailto:info@lagnafnetwork.com" className="text-primary hover:underline inline-block py-2">info@lagnafnetwork.com</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
