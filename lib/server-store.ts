type SubmissionStatus = 'new' | 'in_review' | 'accepted' | 'rejected' | 'flagged'

interface CitationSubmission {
  id: string
  status: SubmissionStatus
  data: Record<string, unknown>
  createdAt: string
  updatedAt: string
  notes?: string
}

interface ContactSubmission {
  id: string
  name: string
  email: string
  subject: string
  message: string
  createdAt: string
  read: boolean
}

const citations = new Map<string, CitationSubmission>()
const contacts: ContactSubmission[] = []

function serverId(): string {
  return `svr_${crypto.randomUUID().slice(0, 12)}`
}

export const serverStore = {
  addCitation: (data: Record<string, unknown>): CitationSubmission => {
    const entry: CitationSubmission = {
      id: serverId(),
      status: 'new',
      data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    citations.set(entry.id, entry)
    return entry
  },

  getCitation: (id: string): CitationSubmission | undefined => citations.get(id),

  getCitations: (): CitationSubmission[] => Array.from(citations.values()).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),

  updateCitationStatus: (id: string, status: SubmissionStatus, notes?: string): boolean => {
    const entry = citations.get(id)
    if (!entry) return false
    entry.status = status
    entry.updatedAt = new Date().toISOString()
    if (notes !== undefined) entry.notes = notes
    return true
  },

  getCitationsByStatus: (status: SubmissionStatus): CitationSubmission[] => serverStore.getCitations().filter(c => c.status === status),

  getCitationStats: () => {
    const all = serverStore.getCitations()
    return {
      total: all.length,
      new: all.filter(c => c.status === 'new').length,
      inReview: all.filter(c => c.status === 'in_review').length,
      accepted: all.filter(c => c.status === 'accepted').length,
      rejected: all.filter(c => c.status === 'rejected').length,
      flagged: all.filter(c => c.status === 'flagged').length,
    }
  },

  addContact: (data: Omit<ContactSubmission, 'id' | 'createdAt' | 'read'>): ContactSubmission => {
    const entry: ContactSubmission = { ...data, id: serverId(), createdAt: new Date().toISOString(), read: false }
    contacts.unshift(entry)
    return entry
  },

  getContacts: (): ContactSubmission[] => contacts,

  markContactRead: (id: string): boolean => {
    const idx = contacts.findIndex(c => c.id === id)
    if (idx === -1) return false
    contacts[idx].read = true
    return true
  },
}
