'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { createClientSupabase } from '@/lib/supabase'
import type { Citation } from '@/lib/types'

type RiskLevel = 'green' | 'yellow' | 'orange' | 'red' | 'expired'

interface CitationRow {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  preferred_contact: 'email' | 'sms' | 'both'
  citation_number: string
  citation_date: string
  response_deadline: string
  county: string
  court: string
  jurisdiction: string
  violation_type: string
  risk_level: RiskLevel
  status: 'pending' | 'in_review' | 'appealing' | 'resolved' | 'expired'
  payment_status: 'unpaid' | 'paid' | 'waived'
  created_at: string
  updated_at: string
}

function getRiskColor(level: RiskLevel): string {
  switch (level) {
    case 'green':
      return 'bg-success/10 text-success border-success/20'
    case 'yellow':
      return 'bg-warning/10 text-warning border-warning/20'
    case 'orange':
      return 'bg-orange-500/10 text-orange-500 border-orange-500/20'
    case 'red':
      return 'bg-danger/10 text-danger border-danger/20'
    case 'expired':
      return 'bg-muted/10 text-muted border-muted/20'
    default:
      return 'bg-muted/10 text-muted border-muted/20'
  }
}

function getStatusColor(
  status: 'pending' | 'in_review' | 'appealing' | 'resolved' | 'expired'
): string {
  switch (status) {
    case 'pending':
      return 'bg-warning/10 text-warning border-warning/20'
    case 'in_review':
      return 'bg-primary/10 text-primary border-primary/20'
    case 'appealing':
      return 'bg-orange-500/10 text-orange-500 border-orange-500/20'
    case 'resolved':
      return 'bg-success/10 text-success border-success/20'
    case 'expired':
      return 'bg-muted/10 text-muted border-muted/20'
    default:
      return 'bg-muted/10 text-muted border-muted/20'
  }
}

function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatDateTime(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function daysUntilDeadline(deadline: string): number {
  const now = new Date()
  const deadlineDate = new Date(deadline)
  const diffMs = deadlineDate.getTime() - now.getTime()
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24))
}

export default function CitationDetailPage() {
  const router = useRouter()
  const params = useParams()
  const citationId = params.id as string

  const [citation, setCitation] = useState<Citation | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadCitation = async () => {
      const supabase = createClientSupabase()
      if (!supabase) {
        setError('Service unavailable')
        setLoading(false)
        return
      }

      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user?.email) {
          setError('Not authenticated')
          setLoading(false)
          return
        }

        // Fetch single citation
        const { data, error: queryError } = await supabase
          .from('citations')
          .select('*')
          .eq('id', citationId)
          .eq('email', user.email)
          .single()

        if (queryError) {
          console.error('Query error:', queryError)
          setError('Citation not found or you do not have access')
          setLoading(false)
          return
        }

        // Transform database row to Citation format
        const row = data as CitationRow
        const transformed: Citation = {
          id: row.id,
          firstName: row.first_name,
          lastName: row.last_name,
          email: row.email,
          phone: row.phone,
          preferredContact: row.preferred_contact,
          citationNumber: row.citation_number,
          citationDate: row.citation_date,
          responseDeadline: row.response_deadline,
          county: row.county,
          court: row.court,
          jurisdiction: row.jurisdiction,
          violationType: row.violation_type,
          riskLevel: row.risk_level,
          status: row.status,
          paymentStatus: row.payment_status,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
        }

        setCitation(transformed)
      } catch (err) {
        console.error('Load error:', err)
        setError('An error occurred while loading the citation')
      } finally {
        setLoading(false)
      }
    }

    loadCitation()
  }, [citationId])

  if (loading) {
    return (
      <div className="min-h-screen" style={{ background: 'var(--gradient-bg)' }}>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Link href="/dashboard" className="text-primary hover:underline mb-6 inline-block">
            ← Back to Citations
          </Link>
          <div className="card">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
            <p className="text-muted mt-4">Loading citation details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !citation) {
    return (
      <div className="min-h-screen" style={{ background: 'var(--gradient-bg)' }}>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Link href="/dashboard" className="text-primary hover:underline mb-6 inline-block">
            ← Back to Citations
          </Link>
          <div className="card bg-danger/10 border border-danger/20">
            <p className="text-danger">{error || 'Citation not found'}</p>
          </div>
        </div>
      </div>
    )
  }

  const daysLeft = daysUntilDeadline(citation.responseDeadline)
  const isUrgent = daysLeft <= 3 && citation.status !== 'resolved' && citation.status !== 'expired'
  const isExpired = citation.status === 'expired' || daysLeft <= 0

  return (
    <div className="min-h-screen" style={{ background: 'var(--gradient-bg)' }}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link href="/dashboard" className="text-primary hover:underline mb-6 inline-block">
          ← Back to Citations
        </Link>

        {/* Header Card */}
        <div className="card mb-6">
          <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
            <div>
              <h1 className="text-3xl font-black mb-2">{citation.citationNumber}</h1>
              <p className="text-muted">{citation.violationType} • {citation.jurisdiction}</p>
            </div>
            <div className="text-right">
              <span className={`text-sm font-semibold px-3 py-1 rounded border block mb-2 ${getRiskColor(citation.riskLevel)}`}>
                {citation.riskLevel.toUpperCase()} RISK
              </span>
              <span className={`text-sm font-semibold px-3 py-1 rounded border block ${getStatusColor(citation.status)}`}>
                {citation.status.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Urgent Banner */}
          {isUrgent && (
            <div className="p-3 bg-danger/10 border border-danger/20 rounded mb-4">
              <p className="text-danger font-semibold text-sm">
                ⚠️ URGENT: Only {daysLeft} day{daysLeft === 1 ? '' : 's'} left to respond!
              </p>
            </div>
          )}

          {/* Expired Banner */}
          {isExpired && (
            <div className="p-3 bg-muted/10 border border-muted/20 rounded mb-4">
              <p className="text-muted font-semibold text-sm">
                ⏰ This citation has expired or is no longer actionable.
              </p>
            </div>
          )}
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Citation Information */}
            <div className="card">
              <h2 className="text-lg font-bold mb-4">Citation Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-muted text-sm">Citation Number</p>
                  <p className="font-mono font-semibold mt-1">{citation.citationNumber}</p>
                </div>
                <div>
                  <p className="text-muted text-sm">Citation Date</p>
                  <p className="font-semibold mt-1">{formatDate(citation.citationDate)}</p>
                </div>
                <div>
                  <p className="text-muted text-sm">Violation Type</p>
                  <p className="font-semibold mt-1">{citation.violationType}</p>
                </div>
                <div>
                  <p className="text-muted text-sm">County</p>
                  <p className="font-semibold mt-1">{citation.county}</p>
                </div>
                <div>
                  <p className="text-muted text-sm">Court</p>
                  <p className="font-semibold mt-1">{citation.court}</p>
                </div>
                <div>
                  <p className="text-muted text-sm">Jurisdiction</p>
                  <p className="font-semibold mt-1">{citation.jurisdiction}</p>
                </div>
              </div>
            </div>

            {/* Deadline & Status */}
            <div className="card">
              <h2 className="text-lg font-bold mb-4">Deadline & Status</h2>
              <div className="space-y-4">
                <div className="p-4 bg-muted/5 rounded border border-border">
                  <p className="text-muted text-sm mb-1">Response Deadline</p>
                  <p className="text-2xl font-black">{formatDate(citation.responseDeadline)}</p>
                  <p className={`text-sm mt-2 font-semibold ${isUrgent ? 'text-danger' : isExpired ? 'text-muted' : 'text-success'}`}>
                    {isExpired ? '⏰ Expired' : isUrgent ? `⚠️ ${daysLeft} day${daysLeft === 1 ? '' : 's'} remaining` : `✓ ${daysLeft} day${daysLeft === 1 ? '' : 's'} remaining`}
                  </p>
                </div>

                <div>
                  <p className="text-muted text-sm mb-2">Current Status</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="inline-block w-3 h-3 rounded-full bg-success"></span>
                      <span className="text-sm">Created {formatDateTime(citation.createdAt)}</span>
                    </div>
                    {citation.status !== 'pending' && (
                      <div className="flex items-center gap-2">
                        <span className={`inline-block w-3 h-3 rounded-full ${citation.status === 'pending' ? 'bg-muted' : 'bg-primary'}`}></span>
                        <span className="text-sm">
                          Status changed to <strong className="capitalize">{citation.status}</strong> {formatDateTime(citation.updatedAt)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-muted text-sm mb-2">Payment Status</p>
                  <p className={`text-sm font-semibold px-2 py-1 rounded inline-block ${
                    citation.paymentStatus === 'paid' ? 'bg-success/10 text-success' :
                    citation.paymentStatus === 'waived' ? 'bg-warning/10 text-warning' :
                    'bg-muted/10 text-muted'
                  }`}>
                    {citation.paymentStatus.toUpperCase()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar: Actions */}
          <div className="space-y-4">
            <div className="card">
              <h2 className="text-lg font-bold mb-4">Next Steps</h2>

              {citation.status === 'resolved' ? (
                <div className="p-4 bg-success/10 border border-success/20 rounded text-center">
                  <p className="text-success font-semibold">✓ This citation is resolved</p>
                </div>
              ) : citation.status === 'expired' || isExpired ? (
                <div className="p-4 bg-muted/10 border border-muted/20 rounded text-center">
                  <p className="text-muted font-semibold">⏰ This citation has expired</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <Link
                    href={`/dashboard/citations/${citation.id}/appeal`}
                    className="btn-primary w-full text-center block"
                  >
                    Submit Appeal
                  </Link>

                  <Link
                    href={`/dashboard/citations/${citation.id}/payment-plan`}
                    className="btn-secondary w-full text-center block"
                  >
                    Request Payment Plan
                  </Link>

                  <Link
                    href={`/dashboard/citations/${citation.id}/dismissal`}
                    className="btn-secondary w-full text-center block"
                  >
                    Request Dismissal
                  </Link>

                  {citation.paymentStatus === 'unpaid' && (
                    <Link
                      href={`/payment?citation_id=${citation.id}`}
                      className="btn-primary w-full text-center block"
                    >
                      Pay Now
                    </Link>
                  )}
                </div>
              )}
            </div>

            {/* Contact Info */}
            <div className="card">
              <h2 className="text-lg font-bold mb-3">Your Information</h2>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-muted text-xs mb-1">Name</p>
                  <p className="font-semibold">{citation.firstName} {citation.lastName}</p>
                </div>
                <div>
                  <p className="text-muted text-xs mb-1">Email</p>
                  <p className="font-mono text-xs break-all">{citation.email}</p>
                </div>
                <div>
                  <p className="text-muted text-xs mb-1">Phone</p>
                  <p className="font-mono">{citation.phone}</p>
                </div>
                <div>
                  <p className="text-muted text-xs mb-1">Preferred Contact</p>
                  <p className="capitalize font-semibold">{citation.preferredContact}</p>
                </div>
              </div>
            </div>

            {/* Help */}
            <div className="card">
              <p className="text-muted text-sm">
                Questions? <Link href="/contact" className="text-primary hover:underline">Contact support</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
