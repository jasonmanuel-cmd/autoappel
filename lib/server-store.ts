import { createServerSupabase } from './supabase'

/* ── Types ──────────────────────────────────── */
type CitationStatus = 'pending' | 'in_review' | 'accepted' | 'rejected' | 'flagged' | 'expired' | 'resolved'

interface CitationRecord {
  id: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  preferred_contact?: string
  citation_number: string
  citation_date?: string
  response_deadline?: string
  county?: string
  court?: string
  jurisdiction?: string
  violation_type?: string
  upload_path?: string
  ambassador_id?: string
  referral_source?: string
  risk_level?: string
  status: CitationStatus
  payment_status?: string
  notes?: string
  created_at: string
  updated_at: string
}

interface ContactRecord {
  id: string
  name: string
  email: string
  subject: string
  message: string
  read: boolean
  created_at: string
}

/* ── In-memory fallback store ───────────────── */
const memCitations = new Map<string, CitationRecord>()
const memContacts: ContactRecord[] = []

function memId(): string {
  return `svr_${crypto.randomUUID().slice(0, 12)}`
}

/* ── Shared helpers ─────────────────────────── */
function now(): string {
  return new Date().toISOString()
}

/* ── Export interface ───────────────────────── */
export const serverStore = {
  /* ── Citations ──────────────────────────── */
  addCitation: async (data: Record<string, unknown>): Promise<{ id: string; status: string; message: string }> => {
    const supabase = createServerSupabase()
    const record: Omit<CitationRecord, 'id' | 'created_at' | 'updated_at'> = {
      first_name: data.firstName as string,
      last_name: data.lastName as string,
      email: data.email as string,
      phone: data.phone as string,
      preferred_contact: (data.preferredContact as string) || 'email',
      citation_number: data.citationNumber as string,
      citation_date: data.citationDate as string,
      response_deadline: data.responseDeadline as string,
      county: data.county as string,
      court: data.court as string,
      jurisdiction: data.jurisdiction as string,
      violation_type: data.violationType as string,
      upload_path: data.uploadPath as string,
      ambassador_id: data.ambassadorId as string,
      referral_source: data.referralSource as string,
      risk_level: (data.riskLevel as string) || 'green',
      status: 'pending',
      payment_status: 'unpaid',
      notes: (data.notes as string) || '',
    }

    if (supabase) {
      const { data: inserted, error } = await supabase
        .from('citations')
        .insert(record)
        .select('id, status')
        .single()
      if (error) throw new Error(`Supabase insert error: ${error.message}`)
      return { id: inserted.id, status: inserted.status, message: 'Citation submitted successfully.' }
    }

    const id = memId()
    const entry: CitationRecord = { ...record, id, created_at: now(), updated_at: now() }
    memCitations.set(id, entry)
    return { id, status: 'pending', message: 'Citation submitted successfully.' }
  },

  getCitation: async (id: string): Promise<CitationRecord | null> => {
    const supabase = createServerSupabase()
    if (supabase) {
      const { data } = await supabase.from('citations').select('*').eq('id', id).single()
      return data
    }
    return memCitations.get(id) || null
  },

  getCitations: async (): Promise<CitationRecord[]> => {
    const supabase = createServerSupabase()
    if (supabase) {
      const { data } = await supabase.from('citations').select('*').order('created_at', { ascending: false })
      return data || []
    }
    return Array.from(memCitations.values()).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  },

  updateCitationStatus: async (id: string, status: CitationStatus, notes?: string): Promise<boolean> => {
    const supabase = createServerSupabase()
    if (supabase) {
      const update: Partial<CitationRecord> = { status, updated_at: now() }
      if (notes !== undefined) update.notes = notes
      const { error } = await supabase.from('citations').update(update).eq('id', id)
      return !error
    }
    const entry = memCitations.get(id)
    if (!entry) return false
    entry.status = status
    entry.updated_at = now()
    if (notes !== undefined) entry.notes = notes
    return true
  },

  getCitationStats: async () => {
    const all = await serverStore.getCitations()
    const count = (s: string) => all.filter(c => c.status === s).length
    return {
      total: all.length,
      new: count('pending'),
      inReview: count('in_review'),
      accepted: count('accepted'),
      rejected: count('rejected'),
      flagged: count('flagged'),
    }
  },

  getCitationsByStatus: async (status: CitationStatus): Promise<CitationRecord[]> => {
    const all = await serverStore.getCitations()
    return all.filter(c => c.status === status)
  },

  /* ── Contacts ────────────────────────────── */
  addContact: async (data: { name: string; email: string; subject: string; message: string }): Promise<{ id: string; message: string }> => {
    const supabase = createServerSupabase()
    if (supabase) {
      const { data: inserted, error } = await supabase
        .from('contacts')
        .insert({ name: data.name, email: data.email, subject: data.subject, message: data.message, read: false })
        .select('id')
        .single()
      if (error) throw new Error(`Supabase insert error: ${error.message}`)
      return { id: inserted.id, message: 'Message received. We will get back to you within 24 hours.' }
    }
    const id = memId()
    memContacts.unshift({ ...data, id, read: false, created_at: now() })
    return { id, message: 'Message received. We will get back to you within 24 hours.' }
  },

  getContacts: async (): Promise<ContactRecord[]> => {
    const supabase = createServerSupabase()
    if (supabase) {
      const { data } = await supabase.from('contacts').select('*').order('created_at', { ascending: false })
      return data || []
    }
    return memContacts
  },

  markContactRead: async (id: string): Promise<boolean> => {
    const supabase = createServerSupabase()
    if (supabase) {
      const { error } = await supabase.from('contacts').update({ read: true }).eq('id', id)
      return !error
    }
    const idx = memContacts.findIndex(c => c.id === id)
    if (idx === -1) return false
    memContacts[idx].read = true
    return true
  },
}
