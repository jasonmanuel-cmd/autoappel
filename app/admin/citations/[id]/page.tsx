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

export default function AdminCitationDetailPage() {
  const router = useRouter()
  const params = useParams()
  const citationId = params.id as string

  const [citation, setCitation] = useState<Citation | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updating, setUpdating] = useState(false)
  const [updateError, setUpdateError] = useState('')

  useEffect(() => {
    const loadCitation = async () => {
      const supabase = createClientSupabase()
      if (!supabase) {
        setError('Service unavailable')
        setLoading(false)
        return
      }

      try {
        const { data, error: queryError } = await supabase
          .from('citations')
          .select('*')
          .eq('id', citationId)
          .single()

        if (queryError) {
          console.error('Query error:', queryError)
          setError('Citation not found')
          setLoading(false)
          return
        }

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

  const updateStatus = async (newStatus: string) => {
    if (!citation) return

    setUpdating(true)
    setUpdateError('')

    const supabase = createClientSupabase()
    if (!supabase) {
      setUpdateError('Service unavailable')
      setUpdating(false)
      return
    }

    const { error } = await supabase
      .from('citations')
      .update({
        status: newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq('id', citation.id)

    setUpdating(false)

    if (error) {
      setUpdateError(error.message)
    } else {
      setCitation({ ...citation, status: newStatus as any })
    }
  }

  const updatePaymentStatus = async (newPaymentStatus: string) => {
    if (!citation) return

    setUpdating(true)
    setUpdateError('')

    const supabase = createClientSupabase()
    if (!supabase) {
      setUpdateError('Service unavailable')
      setUpdating(false)
      return
    }

    const { error } = await supabase
      .from('citations')
      .update({
        payment_status: newPaymentStatus,
        updated_at: new Date().toISOString(),
      })
      .eq('id', citation.id)

    setUpdating(false)

    if (error) {
      setUpdateError(error.message)
    } else {
      setCitation({ ...citation, paymentStatus: newPaymentStatus as any })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen" style={{ background: 'var(--gradient-bg)' }}>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Link href="/admin/dashboard" className="text-primary hover:underline mb-6 inline-block">
            ← Back to Dashboard
          </Link>
          <div className="card">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
            <p className="text-muted mt-4">Loading citation...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !citation) {
    return (
      <div className="min-h-screen" style={{ background: 'var(--gradient-bg)' }}>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Link href="/admin/dashboard" className="text-primary hover:underline mb-6 inline-block">
            ← Back to Dashboard
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

  return (
    <div className="min-h-screen" style={{ background: 'var(--gradient-bg)' }}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/admin/dashboard" className="text-primary hover:underline mb-6 inline-block">
          ← Back to Dashboard
        </Link>

        {/* Header */}
        <div className="card mb-6">
          <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
            <div>
              <h1 className="text-3xl font-black mb-2">{citation.citationNumber}</h1>
              <p className="text-muted">{citation.violationType} • {citation.jurisdiction}</p>
            </div>
            <div className="text-right">
              <span className={`text-sm font-semibold px-3 py-1 rounded border block mb-2 ${getRiskColor(citation.riskLevel)}`}>
                {citation.riskLevel.toUpperCase()}
              </span>
              <span className={`text-sm font-semibold px-3 py-1 rounded border block ${getStatusColor(citation.status)}`}>
                {citation.status.toUpperCase()}
              </span>
            </div>
          </div>

          {isUrgent && (
            <div className="p-3 bg-danger/10 border border-danger/20 rounded">
              <p className="text-danger font-semibold text-sm">
                ⚠️ URGENT: {daysLeft} day{daysLeft === 1 ? '' : 's'} left!
              </p>
            </div>
          )}
        </div>

        {/* Admin Error */}
        {updateError && (
          <div className="card bg-danger/10 border border-danger/20 mb-6">
            <p className="text-danger text-sm">{updateError}</p>
          </div>
        )}

        {/* Two Column */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Citation Info */}
            <div className="card">
              <h2 className="text-lg font-bold mb-4">Citation Details</h2>
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
                  <p className="text-muted text-sm">Violation</p>
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

            {/* Customer Info */}
            <div className="card">
              <h2 className="text-lg font-bold mb-4">Customer Information</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-muted text-sm">Name</p>
                  <p className="font-semibold mt-1">{citation.firstName} {citation.lastName}</p>
                </div>
                <div>
                  <p className="text-muted text-sm">Email</p>
                  <p className="font-mono text-sm mt-1">{citation.email}</p>
                </div>
                <div>
                  <p className="text-muted text-sm">Phone</p>
                  <p className="font-mono mt-1">{citation.phone}</p>
                </div>
                <div>
                  <p className="text-muted text-sm">Preferred Contact</p>
                  <p className="capitalize font-semibold mt-1">{citation.preferredContact}</p>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="card">
              <h2 className="text-lg font-bold mb-4">Timeline</h2>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="w-3 h-3 rounded-full bg-success mt-1 flex-shrink-0"></div>
                  <div>
                    <p className="text-sm font-semibold">Created</p>
                    <p className="text-xs text-muted">{formatDateTime(citation.createdAt)}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className={`w-3 h-3 rounded-full ${citation.status !== 'pending' ? 'bg-primary' : 'bg-muted'} mt-1 flex-shrink-0`}></div>
                  <div>
                    <p className="text-sm font-semibold capitalize">{citation.status}</p>
                    <p className="text-xs text-muted">{formatDateTime(citation.updatedAt)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar: Admin Controls */}
          <div className="space-y-4">
            {/* Status Management */}
            <div className="card">
              <h2 className="text-lg font-bold mb-3">Manage Status</h2>
              <div className="space-y-2">
                {(['pending', 'in_review', 'appealing', 'resolved', 'expired'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => updateStatus(st)}
                    disabled={updating || citation.status === st}
                    className={`w-full text-sm font-semibold px-3 py-2 rounded border transition-colors ${
                      citation.status === st
                        ? getStatusColor(st)
                        : 'bg-muted/5 border-border hover:bg-muted/10'
                    }`}
                  >
                    {st.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Management */}
            <div className="card">
              <h2 className="text-lg font-bold mb-3">Manage Payment</h2>
              <div className="space-y-2">
                {(['unpaid', 'paid', 'waived'] as const).map((ps) => (
                  <button
                    key={ps}
                    onClick={() => updatePaymentStatus(ps)}
                    disabled={updating || citation.paymentStatus === ps}
                    className={`w-full text-sm font-semibold px-3 py-2 rounded border transition-colors ${
                      citation.paymentStatus === ps
                        ? ps === 'paid'
                          ? 'bg-success/10 text-success border-success/20'
                          : ps === 'waived'
                          ? 'bg-warning/10 text-warning border-warning/20'
                          : 'bg-muted/10 text-muted border-muted/20'
                        : 'bg-muted/5 border-border hover:bg-muted/10'
                    }`}
                  >
                    {ps.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Deadline Info */}
            <div className="card">
              <h2 className="text-lg font-bold mb-3">Deadline</h2>
              <p className="text-2xl font-black mb-1">{formatDate(citation.responseDeadline)}</p>
              <p className={`text-sm font-semibold ${isUrgent ? 'text-danger' : 'text-muted'}`}>
                {daysLeft} day{daysLeft === 1 ? '' : 's'} remaining
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
