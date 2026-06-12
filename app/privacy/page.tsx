import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | AppealMyTickets.com',
  description: 'Privacy Policy for AppealMyTickets.com — how we collect, use, and protect your personal information.',
  alternates: { canonical: 'https://AppealMyTickets.com/privacy' },
  robots: { index: true, follow: true },
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen py-12" style={{ background: 'var(--gradient-bg)' }}>
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-black mb-8">Privacy Policy</h1>
        <p className="text-muted-fg mb-8 text-sm">Last updated: May 12, 2026</p>

        <div className="space-y-8">
          {/* Section 1 */}
          <div className="card">
            <h2 className="text-2xl font-bold text-primary mb-4">1. Introduction</h2>
            <p className="text-muted">AppealMyTicket<span className="text-primary">S</span>.com is committed to protecting your privacy and ensuring you have a positive experience on our website and when using our services. This Privacy Policy outlines what information we collect, how we use it, and how we protect it.</p>
          </div>

          {/* Section 2 */}
          <div className="card">
            <h2 className="text-2xl font-bold text-primary mb-4">2. Information We Collect</h2>
            <div className="text-muted space-y-3">
              <p><strong className="text-text">Personal Information:</strong> When you submit an appeal, we collect your name, email address, phone number, and citation details.</p>
              <p><strong className="text-text">Usage Information:</strong> We may collect information about how you interact with our website, including IP address, browser type, and pages visited.</p>
              <p><strong className="text-text">Location Data:</strong> We collect county and jurisdiction information related to your citation.</p>
            </div>
          </div>

          {/* Section 3 - 8 */}
          {[
            { title: '3. How We Use Your Information', list: ['To process and handle your citation appeal', 'To communicate with you about your case status', 'To send you deadline reminders and important updates', 'To improve our website and services', 'To comply with legal obligations', 'To prevent fraud and abuse'] },
            { title: '4. Data Security', content: 'We implement industry-standard security measures to protect your personal information from unauthorized access, alteration, and disclosure. All data is encrypted both in transit and at rest. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.' },
            { title: '5. Information Sharing', content: 'We do not sell, trade, or rent your personal information to third parties. We may share your information only when:', list: ['Required by law or court order', 'Necessary to process your citation with courts and legal authorities', 'With our trusted service providers who help us operate our website', 'You explicitly consent to the sharing'] },
            { title: '6. Cookies and Tracking', content: 'Our website may use cookies and similar tracking technologies to enhance your experience. You can control cookie settings in your browser. Disabling cookies may affect some functionality on our website.' },
            { title: '7. Your Rights Under TDPSA', content: 'If you are a Texas resident, the Texas Data Privacy and Security Act (TDPSA) provides you with specific rights regarding your personal data:' },
            { title: '7a. Right to Access', content: 'You have the right to confirm whether we are processing your personal data and to access that data, limited to two requests per 12-month period.' },
            { title: '7b. Right to Correction', content: 'You may request correction of inaccurate personal data we hold about you.' },
            { title: '7c. Right to Deletion', content: 'You may request deletion of personal data we have collected about you, subject to certain exceptions (e.g., legal compliance, fraud prevention).' },
            { title: '7d. Right to Data Portability', content: 'You have the right to obtain a copy of your personal data in a portable, readily usable format.' },
            { title: '7e. Right to Opt Out', content: 'You have the right to opt out of the processing of your personal data for targeted advertising and the sale of personal data. We do not sell your personal data or engage in targeted advertising at this time.' },
            { title: '7f. How to Exercise Your Rights', content: 'To exercise any of the above rights, submit a request via email to info@lagnafnetwork.com or through our contact page. We will respond within 45 days. If we deny your request, you may appeal by contacting us with the reason for the denial.' },
            { title: '7g. Non-Discrimination', content: 'We will not discriminate against you for exercising any of your TDPSA rights, including by denying services, charging different prices, or providing a different level of service.' },
            { title: '8. Changes to This Policy', content: 'We may update this Privacy Policy from time to time. We will notify you of any significant changes by email or by posting the new policy on our website with an updated "Last Updated" date.' },
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
            <h2 className="text-2xl font-bold text-primary mb-4">9. Contact Us</h2>
            <p className="text-muted">If you have questions about this Privacy Policy or our privacy practices, please contact us at{' '}
              <a href="mailto:info@lagnafnetwork.com" className="text-primary hover:underline">info@lagnafnetwork.com</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
