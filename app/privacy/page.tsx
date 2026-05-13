export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#070d18] to-[#0d1b2e] py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-black mb-8">Privacy Policy</h1>
        <p className="text-[#8aafd4] mb-8 text-sm">Last updated: May 12, 2026</p>

        <div className="space-y-8">
          {/* Section 1 */}
          <div className="card">
            <h2 className="text-2xl font-bold text-[#1d6ef3] mb-4">1. Introduction</h2>
            <p className="text-[#5b7fa6]">
              AutoAppeal™ is committed to protecting your privacy and ensuring you have a positive experience on our website and when using our services. This Privacy Policy outlines what information we collect, how we use it, and how we protect it.
            </p>
          </div>

          {/* Section 2 */}
          <div className="card">
            <h2 className="text-2xl font-bold text-[#1d6ef3] mb-4">2. Information We Collect</h2>
            <div className="text-[#5b7fa6] space-y-3">
              <p><strong className="text-white">Personal Information:</strong> When you submit an appeal, we collect your name, email address, phone number, and citation details.</p>
              <p><strong className="text-white">Usage Information:</strong> We may collect information about how you interact with our website, including IP address, browser type, and pages visited.</p>
              <p><strong className="text-white">Location Data:</strong> We collect county and jurisdiction information related to your citation.</p>
            </div>
          </div>

          {/* Section 3 */}
          <div className="card">
            <h2 className="text-2xl font-bold text-[#1d6ef3] mb-4">3. How We Use Your Information</h2>
            <ul className="text-[#5b7fa6] space-y-2 list-disc list-inside">
              <li>To process and handle your citation appeal</li>
              <li>To communicate with you about your case status</li>
              <li>To send you deadline reminders and important updates</li>
              <li>To improve our website and services</li>
              <li>To comply with legal obligations</li>
              <li>To prevent fraud and abuse</li>
            </ul>
          </div>

          {/* Section 4 */}
          <div className="card">
            <h2 className="text-2xl font-bold text-[#1d6ef3] mb-4">4. Data Security</h2>
            <p className="text-[#5b7fa6]">
              We implement industry-standard security measures to protect your personal information from unauthorized access, alteration, and disclosure. All data is encrypted both in transit and at rest. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </div>

          {/* Section 5 */}
          <div className="card">
            <h2 className="text-2xl font-bold text-[#1d6ef3] mb-4">5. Information Sharing</h2>
            <p className="text-[#5b7fa6] mb-3">
              We do not sell, trade, or rent your personal information to third parties. We may share your information only when:
            </p>
            <ul className="text-[#5b7fa6] space-y-2 list-disc list-inside">
              <li>Required by law or court order</li>
              <li>Necessary to process your appeal with courts and legal authorities</li>
              <li>With our trusted service providers who help us operate our website</li>
              <li>You explicitly consent to the sharing</li>
            </ul>
          </div>

          {/* Section 6 */}
          <div className="card">
            <h2 className="text-2xl font-bold text-[#1d6ef3] mb-4">6. Cookies and Tracking</h2>
            <p className="text-[#5b7fa6]">
              Our website may use cookies and similar tracking technologies to enhance your experience. You can control cookie settings in your browser. Disabling cookies may affect some functionality on our website.
            </p>
          </div>

          {/* Section 7 */}
          <div className="card">
            <h2 className="text-2xl font-bold text-[#1d6ef3] mb-4">7. Your Rights</h2>
            <p className="text-[#5b7fa6] mb-3">You have the right to:</p>
            <ul className="text-[#5b7fa6] space-y-2 list-disc list-inside">
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your information</li>
              <li>Opt-out of marketing communications</li>
              <li>File a complaint with privacy authorities</li>
            </ul>
          </div>

          {/* Section 8 */}
          <div className="card">
            <h2 className="text-2xl font-bold text-[#1d6ef3] mb-4">8. Changes to This Policy</h2>
            <p className="text-[#5b7fa6]">
              We may update this Privacy Policy from time to time. We will notify you of any significant changes by email or by posting the new policy on our website with an updated "Last Updated" date.
            </p>
          </div>

          {/* Contact */}
          <div className="card bg-[#1d6ef3]/10 border-[#1d6ef3]/30">
            <h2 className="text-2xl font-bold text-[#1d6ef3] mb-4">9. Contact Us</h2>
            <p className="text-[#5b7fa6]">
              If you have questions about this Privacy Policy or our privacy practices, please contact us at{' '}
              <a href="mailto:privacy@autoappeal.com" className="text-[#1d6ef3] hover:underline">
                privacy@autoappeal.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
