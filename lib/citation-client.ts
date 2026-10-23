import { computeRisk } from './deadlines'
import type { Citation } from './types'
// One mapper for server/database rows, shared by tracking and checkout screens.
export function citationFromRow(row: Record<string, any>): Citation {
  return { id: row.id, firstName: row.first_name, lastName: row.last_name, email: row.email,
    phone: row.phone || '', preferredContact: row.preferred_contact || 'email', citationNumber: row.citation_number,
    citationDate: row.citation_date || '', responseDeadline: row.response_deadline || '', county: row.county || '',
    court: row.court || '', jurisdiction: row.jurisdiction || '', violationType: row.violation_type || '',
    riskLevel: computeRisk(row.response_deadline || ''), status: row.status, paymentStatus: row.payment_status,
    serviceFeeStatus: row.service_fee_status, createdAt: row.created_at, updatedAt: row.updated_at }
}
