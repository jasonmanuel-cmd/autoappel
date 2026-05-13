export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#070d18] to-[#0d1b2e] py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-black mb-8">Terms of Service</h1>
        <p className="text-[#8aafd4] mb-8 text-sm">Last updated: May 12, 2026</p>

        <div className="space-y-8">
          {/* Section 1 */}
          <div className="card">
            <h2 className="text-2xl font-bold text-[#1d6ef3] mb-4">1. Acceptance of Terms</h2>
            <p className="text-[#5b7fa6]">
              By accessing and using the AutoAppeal™ website and services, you accept and agree to be bound by the terms of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </div>

          {/* Section 2 */}
          <div className="card">
            <h2 className="text-2xl font-bold text-[#1d6ef3] mb-4">2. Service Description</h2>
            <p className="text-[#5b7fa6]">
              AutoAppeal™ provides legal assistance services for traffic citation appeals. We help customers prepare and file appeals to traffic citations in the Houston metro area. Our services are subject to applicable laws and regulations.
            </p>
          </div>

          {/* Section 3 */}
          <div className="card">
            <h2 className="text-2xl font-bold text-[#1d6ef3] mb-4">3. User Responsibilities</h2>
            <p className="text-[#5b7fa6] mb-3">You agree to:</p>
            <ul className="text-[#5b7fa6] space-y-2 list-disc list-inside">
              <li>Provide accurate and complete information</li>
              <li>Maintain confidentiality of your account</li>
              <li>Not use our services for any illegal purpose</li>
              <li>Not interfere with the operation of our website</li>
              <li>Respond to our communications in a timely manner</li>
              <li>Notify us of any changes to your information</li>
            </ul>
          </div>

          {/* Section 4 */}
          <div className="card">
            <h2 className="text-2xl font-bold text-[#1d6ef3] mb-4">4. Fees and Payment</h2>
            <p className="text-[#5b7fa6]">
              We will provide you with a fee quote before beginning work on your appeal. Payment terms and conditions will be detailed in your service agreement. Fees are non-refundable once services have been rendered, unless otherwise specified.
            </p>
          </div>

          {/* Section 5 */}
          <div className="card">
            <h2 className="text-2xl font-bold text-[#1d6ef3] mb-4">5. No Guarantee of Outcome</h2>
            <p className="text-[#5b7fa6]">
              We cannot guarantee any specific outcome or result. Court decisions depend on many factors beyond our control. We provide our best professional efforts in preparing and filing your appeal, but the final decision rests with the court.
            </p>
          </div>

          {/* Section 6 */}
          <div className="card">
            <h2 className="text-2xl font-bold text-[#1d6ef3] mb-4">6. Limitation of Liability</h2>
            <p className="text-[#5b7fa6]">
              In no event shall AutoAppeal™, its employees, or agents be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, arising from or in connection with your use of our services.
            </p>
          </div>

          {/* Section 7 */}
          <div className="card">
            <h2 className="text-2xl font-bold text-[#1d6ef3] mb-4">7. Intellectual Property</h2>
            <p className="text-[#5b7fa6]">
              All content on our website, including text, graphics, logos, and images, are the property of AutoAppeal™ or our content suppliers and are protected by copyright laws. You may not reproduce or distribute any content without permission.
            </p>
          </div>

          {/* Section 8 */}
          <div className="card">
            <h2 className="text-2xl font-bold text-[#1d6ef3] mb-4">8. Confidentiality</h2>
            <p className="text-[#5b7fa6]">
              All information provided to us regarding your citation and case is kept confidential and treated as attorney work product where applicable. We will not disclose your information except as required by law or with your explicit consent.
            </p>
          </div>

          {/* Section 9 */}
          <div className="card">
            <h2 className="text-2xl font-bold text-[#1d6ef3] mb-4">9. Termination</h2>
            <p className="text-[#5b7fa6]">
              We reserve the right to terminate service to any user who violates these terms or engages in conduct harmful to our business or other users. You may terminate service at any time by contacting us in writing.
            </p>
          </div>

          {/* Section 10 */}
          <div className="card">
            <h2 className="text-2xl font-bold text-[#1d6ef3] mb-4">10. Modifications to Terms</h2>
            <p className="text-[#5b7fa6]">
              We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting to our website. Your continued use of our services following any modifications constitutes acceptance of the updated terms.
            </p>
          </div>

          {/* Section 11 */}
          <div className="card">
            <h2 className="text-2xl font-bold text-[#1d6ef3] mb-4">11. Governing Law</h2>
            <p className="text-[#5b7fa6]">
              These terms and conditions are governed by and construed in accordance with the laws of the State of Texas, and you irrevocably submit to the exclusive jurisdiction of the courts located in Harris County, Texas.
            </p>
          </div>

          {/* Contact */}
          <div className="card bg-[#1d6ef3]/10 border-[#1d6ef3]/30">
            <h2 className="text-2xl font-bold text-[#1d6ef3] mb-4">12. Contact Us</h2>
            <p className="text-[#5b7fa6]">
              If you have any questions about these Terms of Service, please contact us at{' '}
              <a href="mailto:legal@autoappeal.com" className="text-[#1d6ef3] hover:underline">
                legal@autoappeal.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
