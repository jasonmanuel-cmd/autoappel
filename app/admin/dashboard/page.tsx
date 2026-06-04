'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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

function daysUntilDeadline(deadline: string): number {
  const now = new Date()
  const deadlineDate = new Date(deadline)
  const diffMs = deadlineDate.getTime() - now.getTime()
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24))
}

export default function AdminDashboard() {
  const router = useRouter()
  const [citations, setCitations] = useState<Citation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterRisk, setFilterRisk] = useState<string>('all')
  const [searchEmail, setSearchEmail] = useState('')

  useEffect(() => {
    const loadCitations = async () => {
      const supabase = createClientSupabase()
      if (!supabase) {
        setError('Service unavailable')
        setLoading(false)
        return
      }

      try {
        // Fetch ALL citations (admin view)
        const { data, error: queryError } = await supabase
          .from('citations')
          .select('*')
          .order('response_deadline', { ascending: true })

        if (queryError) {
          console.error('Query error:', queryError)
          setError('Failed to load citations')
          setLoading(false)
          return
        }

        // Transform database rows to Citation format
        const transformed: Citation[] = (data as CitationRow[]).map((row) => ({
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
        }))

        setCitations(transformed)
      } catch (err) {
        console.error('Load error:', err)
        setError('An error occurred while loading citations')
      } finally {
        setLoading(false)
      }
    }

    loadCitations()
  }, [])

  // Filter citations
  const filteredCitations = citations.filter((c) => {
    if (filterStatus !== 'all' && c.status !== filterStatus) return false
    if (filterRisk !== 'all' && c.riskLevel !== filterRisk) return false
    if (searchEmail && !c.email.toLowerCase().includes(searchEmail.toLowerCase())) return false
    return true
  })

  const handleLogout = async () => {
    const supabase = createClientSupabase()
    if (supabase) await supabase.auth.signOut()
    router.push('/admin/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen" style={{ background: 'var(--gradient-bg)' }}>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-black">Loading...</h1>
            <button onClick={handleLogout} className="btn-secondary">
              Sign Out
            </button>
          </div>
          <div className="card">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
            <p className="text-muted mt-4">Fetching all citations...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--gradient-bg)' }}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black">Admin Dashboard</h1>
            <p className="text-muted mt-1">All citations and submissions</p>
          </div>
          <button onClick={handleLogout} className="btn-secondary">
            Sign Out
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="card bg-danger/10 border border-danger/20 mb-6">
            <p className="text-danger">{error}</p>
          </div>
        )}

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="card">
            <p className="text-muted text-sm">Total Citations</p>
            <p className="text-3xl font-black mt-2">{citations.length}</p>
          </div>
          <div className="card">
            <p className="text-muted text-sm">Pending</p>
            <p className="text-3xl font-black mt-2">
              {citations.filter(c => c.status === 'pending').length}
            </p>
          </div>
          <div className="card">
            <p className="text-muted text-sm">In Review</p>
            <p className="text-3xl font-black mt-2">
              {citations.filter(c => c.status === 'in_review').length}
            </p>
          </div>
          <div className="card">
            <p className="text-muted text-sm">Critical (Red)</p>
            <p className="text-3xl font-black mt-2 text-danger">
              {citations.filter(c => c.riskLevel === 'red').length}
            </p>
          </div>
          <div className="card">
            <p className="text-muted text-sm">Urgent (Orange)</p>
            <p className="text-3xl font-black mt-2 text-orange-500">
              {citations.filter(c => c.riskLevel === 'orange').length}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="card mb-6 p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="label text-sm">Filter by Status</label>
              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className="input"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="in_review">In Review</option>
                <option value="appealing">Appealing</option>
                <option value="resolved">Resolved</option>
                <option value="expired">Expired</option>
              </select>
            </div>
            <div>
              <label className="label text-sm">Filter by Risk Level</label>
              <select
                value={filterRisk}
                onChange={e => setFilterRisk(e.target.value)}
                className="input"
              >
                <option value="all">All Risk Levels</option>
                <option value="green">Green</option>
                <option value="yellow">Yellow</option>
                <option value="orange">Orange</option>
                <option value="red">Red</option>
                <option value="expired">Expired</option>
              </select>
            </div>
            <div>
              <label className="label text-sm">Search by Email</label>
              <input
                type="email"
                value={searchEmail}
                onChange={e => setSearchEmail(e.target.value)}
                placeholder="customer@example.com"
                className="input"
              />
            </div>
          </div>
        </div>

        {/* Citations Table */}
        {filteredCitations.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-muted text-lg">No citations found.</p>
            {(filterStatus !== 'all' || filterRisk !== 'all' || searchEmail) && (
              <p className="text-muted text-sm mt-2">Try adjusting your filters.</p>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredCitations.map((citation) => {
              const daysLeft = daysUntilDeadline(citation.responseDeadline)

              return (
                <Link
                  key={citation.id}
                  href={`/admin/citations/${citation.id}`}
                  className="card hover:shadow-lg transition-shadow cursor-pointer p-4"
                >
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    {/* Citation Number + Type */}
                    <div className="flex-1 min-w-max">
                      <p className="font-bold text-base">{citation.citationNumber}</p>
                      <p className="text-muted text-sm">{citation.violationType}</p>
                    </div>

                    {/* Customer */}
                    <div className="flex-1 min-w-max">
                      <p className="text-sm">{citation.firstName} {citation.lastName}</p>
                      <p className="text-muted text-xs">{citation.email}</p>
                    </div>

                    {/* Jurisdiction */}
                    <div className="flex-1 min-w-max">
                      <p className="text-sm">{citation.jurisdiction}</p>
                      <p className="text-muted text-xs">{citation.court}</p>
                    </div>

                    {/* Risk Badge */}
                    <div>
                      <span className={`text-xs font-semibold px-2 py-1 rounded border ${getRiskColor(citation.riskLevel)}`}>
                        {citation.riskLevel.toUpperCase()}
                      </span>
                    </div>

                    {/* Status Badge */}
                    <div>
                      <span className={`text-xs font-semibold px-2 py-1 rounded border ${getStatusColor(citation.status)}`}>
                        {citation.status.toUpperCase()}
                      </span>
                    </div>

                    {/* Deadline */}
                    <div className="text-right min-w-max">
                      <p className="text-sm font-semibold">{formatDate(citation.responseDeadline)}</p>
                      <p className={`text-xs ${daysLeft <= 3 && citation.status !== 'resolved' ? 'text-danger font-bold' : 'text-muted'}`}>
                        {daysLeft} days left
                      </p>
                    </div>

                    {/* Payment Status */}
                    <div className="text-right min-w-max">
                      <span className={`text-xs font-semibold px-2 py-1 rounded ${citation.paymentStatus === 'paid' ? 'bg-success/10 text-success' : citation.paymentStatus === 'waived' ? 'bg-warning/10 text-warning' : 'bg-muted/10 text-muted'}`}>
                        {citation.paymentStatus.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-border text-center">
          <p className="text-muted text-sm">
            <span>{filteredCitations.length} citation(s) shown</span>
            {' | '}
            <Link href="/contact" className="text-primary hover:underline">Contact support</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
