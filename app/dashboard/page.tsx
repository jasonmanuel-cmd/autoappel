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

export default function CustomerDashboard() {
  const router = useRouter()
  const [citations, setCitations] = useState<Citation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [user, setUser] = useState<{ email: string; name: string } | null>(null)

  useEffect(() => {
    const loadCitations = async () => {
      const supabase = createClientSupabase()
      if (!supabase) {
        setError('Service unavailable')
        setLoading(false)
        return
      }

      try {
        // Get current user
        const { data: { user: authUser } } = await supabase.auth.getUser()
        if (!authUser?.email) {
          setError('Not authenticated')
          setLoading(false)
          return
        }

        setUser({
          email: authUser.email,
          name: authUser.user_metadata?.full_name || authUser.email.split('@')[0],
        })

        // Fetch citations for this customer from the active_citations_dashboard view
        const { data, error: queryError } = await supabase
          .from('active_citations_dashboard')
          .select('*')
          .eq('email', authUser.email)
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

  const handleLogout = async () => {
    const supabase = createClientSupabase()
    if (supabase) await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen" style={{ background: 'var(--gradient-bg)' }}>
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-black">Loading...</h1>
            <button onClick={handleLogout} className="btn-secondary">
              Sign Out
            </button>
          </div>
          <div className="card">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
            <p className="text-muted mt-4">Fetching your citations...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--gradient-bg)' }}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black">My Citations</h1>
            <p className="text-muted mt-1">
              {user && `Welcome, ${user.name}`}
            </p>
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

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
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
            <p className="text-muted text-sm">Resolved</p>
            <p className="text-3xl font-black mt-2">
              {citations.filter(c => c.status === 'resolved').length}
            </p>
          </div>
        </div>

        {/* Citations List */}
        {citations.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-muted text-lg">No citations found.</p>
            <p className="text-muted text-sm mt-2">
              Upload a citation to get started.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {citations.map((citation) => {
              const daysLeft = daysUntilDeadline(citation.responseDeadline)
              const isUrgent = daysLeft <= 3 && citation.status !== 'resolved'

              return (
                <Link
                  key={citation.id}
                  href={`/dashboard/citations/${citation.id}`}
                  className="card hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-4">
                    {/* Left: Citation Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold">{citation.citationNumber}</h3>
                        <span className={`text-xs font-semibold px-2 py-1 rounded border ${getRiskColor(citation.riskLevel)}`}>
                          {citation.riskLevel.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-muted text-sm mb-3">
                        {citation.violationType} • {citation.jurisdiction}
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted">Citation Date</p>
                          <p className="font-semibold">{formatDate(citation.citationDate)}</p>
                        </div>
                        <div>
                          <p className="text-muted">Deadline</p>
                          <p className="font-semibold">{formatDate(citation.responseDeadline)}</p>
                        </div>
                        <div>
                          <p className="text-muted">Status</p>
                          <p className="font-semibold capitalize">{citation.status}</p>
                        </div>
                        <div>
                          <p className="text-muted">Payment</p>
                          <p className="font-semibold capitalize">{citation.paymentStatus}</p>
                        </div>
                      </div>
                    </div>

                    {/* Right: Deadline Indicator */}
                    <div className="text-right">
                      {citation.status === 'resolved' ? (
                        <div className="text-success text-lg">✓ Resolved</div>
                      ) : citation.status === 'expired' ? (
                        <div className="text-muted">Expired</div>
                      ) : (
                        <div className={isUrgent ? 'text-danger' : 'text-muted'}>
                          <p className="text-sm">{daysLeft} days left</p>
                          <p className={`text-2xl font-black ${isUrgent ? 'text-danger' : ''}`}>
                            {daysLeft}
                          </p>
                        </div>
                      )}
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
            Questions? <Link href="/contact" className="text-primary hover:underline">Contact support</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
