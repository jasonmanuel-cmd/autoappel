import { database, checkDatabase, ApiError } from './auth-server'
import { verifyPayment } from './payments'
import { generateStrategyPDFAndSend } from './pdf-generator'
export async function fulfillCitation(c: Record<string, any>) {
  const db = database()
  const payment = await verifyPayment(c.id)
  if (payment.fulfillment === 'sent') return { success: true, paid: true }
  // Atomic claim prevents concurrent tabs from sending duplicates. Crashed claims
  // are retried after 5 minutes, with the same provider idempotency key.
  const { data: claim, error: claimError } = await db.from('service_payments').update({ fulfillment: 'sending', fulfillment_started_at: new Date().toISOString() }).eq('id', payment.id)
    .or(`fulfillment.eq.pending,and(fulfillment.eq.sending,fulfillment_started_at.lt.${new Date(Date.now()-300000).toISOString()})`).select('id').maybeSingle()
  checkDatabase(claimError)
  if (!claim) throw new ApiError(409, 'Your document is being prepared. Please retry shortly.')
  const result = await generateStrategyPDFAndSend({ firstName: c.first_name, lastName: c.last_name, citationNumber: c.citation_number,
    violationType: c.violation_type || 'N/A', county: c.county || 'N/A', court: c.court || 'N/A', jurisdiction: c.jurisdiction || 'N/A',
    responseDeadline: c.response_deadline || '', citationDate: c.citation_date || '', email: c.email,
  }, payment.id)
  if (!result.success) {
    await db.from('service_payments').update({ fulfillment: 'pending' }).eq('id', payment.id)
    throw new ApiError(502, 'Payment confirmed, but document delivery failed. Please retry or contact support; do not pay again.')
  }
  const { error: finishError } = await db.from('service_payments').update({ fulfillment: 'sent' }).eq('id', payment.id)
  checkDatabase(finishError)
  return { success: true, paid: true }
}
