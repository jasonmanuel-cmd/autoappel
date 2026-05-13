'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { store } from '@/lib/store'
import type { Citation } from '@/lib/types'
import Link from 'next/link'
import { Suspense } from 'react'

function ConfirmationContent() {
  const params = useSearchParams()
  const id = params.get('id')
  const [citation, setCitation] = useState<Citation | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      const c = store.getCitationById(id)
      setCitation(c || null)
    }
    setLoading(false)
  }, [id])

  if (loading) {
    return <div className="p-12 text-center text-[#5b7fa6]">Loading...</div>
  }

  if (!citation) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="card text-center">
          <p className="text-[#5b7fa6] mb-4">Appeal not found</p>
          <Link href="/intake" className="btn-primary">Start New Appeal</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#070d18] to-[#0d1b2e] py-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* Success Message */}
        <div className="card text-center mb-8 border-l-4" style={{ borderLeftColor: '#4ade80' }}>
          <div className="text-6xl mb-4 animate-bounce">✓</div>
          <h1 className="text-4xl font-black mb-2 text-[#4ade80]">Appeal Submitted!</h1>
          <p className="text-[#8aafd4] text-lg">We've received your citation information and are reviewing your appeal.</p>
        </div>

        {/* Citation Summary */}
        <div className="card space-y-6 mb-8">
          <h2 className="text-2xl font-bold text-[#1d6ef3]">What Happens Next</h2>
          
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-[#1d6ef3] text-white font-bold">1</div>
              <div>
                <h3 className="font-bold text-white mb-1">Review in Progress</h3>
                <p className="text-[#5b7fa6] text-sm">Our team is analyzing your citation for appeal eligibility and building your defense strategy.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-[#1d6ef3] text-white font-bold">2</div>
              <div>
                <h3 className="font-bold text-white mb-1">Status Updates</h3>
                <p className="text-[#5b7fa6] text-sm">We'll send you updates via {citation.preferredContact === 'sms' ? 'text message' : citation.preferredContact === 'both' ? 'email and text' : 'email'} as your case progresses.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-[#1d6ef3] text-white font-bold">3</div>
              <div>
                <h3 className="font-bold text-white mb-1">Deadline Monitoring</h3>
                <p className="text-[#5b7fa6] text-sm">We're tracking all critical dates. You can monitor your appeal anytime in your account.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-[#4ade80] text-white font-bold">✓</div>
              <div>
                <h3 className="font-bold text-white mb-1">Resolution</h3>
                <p className="text-[#5b7fa6] text-sm">We'll work with the court on your behalf and keep you informed of the outcome.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Your Information */}
        <div className="card space-y-4 mb-8">
          <h2 className="text-xl font-bold text-[#1d6ef3]">Your Appeal Details</h2>
          
          <div className="bg-[#08111e] rounded-lg p-4 space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-[#27415e] font-semibold">Appeal ID</p>
                <p className="text-[#e8f1ff] font-mono text-sm">{citation.id.substring(0, 8)}...</p>
              </div>
              <div>
                <p className="text-xs text-[#27415e] font-semibold">Status</p>
                <p className="text-[#e8f1ff] capitalize">{citation.status.replace('_', ' ')}</p>
              </div>
              <div>
                <p className="text-xs text-[#27415e] font-semibold">Citation #</p>
                <p className="text-[#e8f1ff]">{citation.citationNumber}</p>
              </div>
              <div>
                <p className="text-xs text-[#27415e] font-semibold">Violation</p>
                <p className="text-[#e8f1ff]">{citation.violationType}</p>
              </div>
            </div>

            <div className="border-t border-[#1a3355] pt-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-[#27415e] font-semibold">Citation Date</p>
                  <p className="text-[#e8f1ff]">{new Date(citation.citationDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-xs text-[#27415e] font-semibold">Response Deadline</p>
                  <p className="text-[#e8f1ff]">{citation.responseDeadline ? new Date(citation.responseDeadline).toLocaleDateString() : 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-xs text-[#27415e] font-semibold">County</p>
                  <p className="text-[#e8f1ff]">{citation.county}, TX</p>
                </div>
                <div>
                  <p className="text-xs text-[#27415e] font-semibold">Court</p>
                  <p className="text-[#e8f1ff]">{citation.court}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="card bg-[#1d6ef3]/5 border-[#1d6ef3]/20 mb-8">
          <h2 className="text-xl font-bold text-[#1d6ef3] mb-4">Confirmation Sent</h2>
          <p className="text-[#5b7fa6] mb-4">A confirmation email has been sent to <strong>{citation.email}</strong></p>
          <p className="text-sm text-[#27415e]">Keep this confirmation for your records. You can track your appeal status anytime from your account.</p>
        </div>

        {/* Important Information */}
        <div className="card border-orange-500/20 mb-8">
          <h2 className="text-lg font-bold text-orange-400 mb-4">⚠️ Important</h2>
          <ul className="text-[#5b7fa6] text-sm space-y-2 list-disc list-inside">
            <li>Do not ignore any official court communications</li>
            <li>Make sure your contact information stays up to date</li>
            <li>Check your spam folder if you don't receive emails</li>
            <li>Never respond to the court without consulting us first</li>
          </ul>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
          <Link href="/track" className="btn-primary flex-1 sm:flex-none">
            Track Your Appeal
          </Link>
          <Link href="/" className="btn-secondary flex-1 sm:flex-none">
            Return Home
          </Link>
        </div>

        {/* Support */}
        <div className="text-center">
          <p className="text-[#5b7fa6] text-sm mb-2">Have questions?</p>
          <div className="flex gap-3 justify-center flex-wrap text-sm">
            <a href="/faq" className="text-[#1d6ef3] hover:underline">View FAQ</a>
            <span className="text-[#27415e]">•</span>
            <a href="/contact" className="text-[#1d6ef3] hover:underline">Contact Support</a>
            <span className="text-[#27415e]">•</span>
            <a href="/terms" className="text-[#1d6ef3] hover:underline">Terms of Service</a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-[#5b7fa6]">Loading...</div>}>
      <ConfirmationContent />
    </Suspense>
  )
}
