import Link from 'next/link'

export default function FAQPage() {
  const faqs = [
    {
      q: 'How does the appeal process work?',
      a: 'You submit your citation details through our form, and our legal team reviews it for appeal eligibility. If eligible, we draft and file your appeal with the appropriate court. We handle all communications and keep you updated throughout the process.',
    },
    {
      q: 'How much does it cost?',
      a: 'Pricing varies based on the complexity of your citation and location. Contact us for a personalized quote after submitting your citation details.',
    },
    {
      q: 'Will you guarantee a dismissal?',
      a: 'We cannot guarantee any specific outcome, as court decisions depend on many factors. However, our legal team will work to build the strongest possible appeal based on the details of your case.',
    },
    {
      q: 'What if I miss my response deadline?',
      a: 'Missing a deadline can complicate your case. It\'s important to contact us immediately if you realize you\'ve missed a deadline. There may still be options available, but they become more limited.',
    },
    {
      q: 'How will you keep me updated?',
      a: 'We\'ll send you updates via your preferred contact method (email, text, or both). You can also log in anytime to check your appeal status in real-time.',
    },
    {
      q: 'Do I need to appear in court?',
      a: 'This depends on your specific case and citation type. Our team will advise you on whether an in-person appearance is necessary. Many appeals can be handled entirely on your behalf.',
    },
    {
      q: 'What information do I need to submit?',
      a: 'You\'ll need your citation number, the date you received it, the violation type, your response deadline (if visible), the county/court information, and your contact details. If you have the citation photo or PDF, that\'s helpful too.',
    },
    {
      q: 'How long does the appeal process take?',
      a: 'The timeline varies depending on the court and complexity of your case. Most cases resolve within 2-6 months, but some may take longer. We\'ll keep you informed of the expected timeline.',
    },
    {
      q: 'Can I submit multiple citations?',
      a: 'Yes! You can submit as many citations as you need. Each one will be reviewed and handled separately.',
    },
    {
      q: 'What if I don\'t hear from you?',
      a: 'Check your spam/junk email folder. If you still haven\'t heard from us within 2 business days, please contact our support team immediately.',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#070d18] to-[#0d1b2e] py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-12">
          <h1 className="text-4xl font-black mb-3">Frequently Asked Questions</h1>
          <p className="text-[#8aafd4] text-lg">Find answers to common questions about our appeal process.</p>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, i) => (
            <details
              key={i}
              className="card cursor-pointer group hover:border-[#1d6ef3]/50 transition-colors"
            >
              <summary className="font-bold text-lg text-white flex items-center justify-between">
                {faq.q}
                <span className="text-[#1d6ef3] group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-[#5b7fa6] mt-4 leading-relaxed">{faq.a}</p>
            </details>
          ))}
        </div>

        {/* CTA */}
        <div className="card bg-[#1d6ef3]/10 border-[#1d6ef3]/30 mt-12 text-center">
          <h2 className="text-2xl font-bold mb-3">Still have questions?</h2>
          <p className="text-[#8aafd4] mb-6">Our support team is here to help.</p>
          <Link href="/contact" className="btn-primary">
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  )
}
