import { ApiError, database, checkDatabase } from './auth-server'
export const SERVICE_PLAN = 'Citation Appeal Service'
export const SERVICE_CENTS = 7999
export function squareBase() {
  if (!['sandbox','production'].includes(process.env.SQUARE_ENV || '')) throw new ApiError(503, 'Payment environment is not configured')
  return process.env.SQUARE_ENV === 'production' ? 'https://connect.squareup.com/v2' : 'https://connect.squareupsandbox.com/v2'
}
export async function square(path: string, body?: unknown) {
  if (!process.env.SQUARE_ACCESS_TOKEN || !process.env.SQUARE_LOCATION_ID) throw new ApiError(503, 'Payments are not configured')
  const response = await fetch(`${squareBase()}${path}`, {
    method: body ? 'POST' : 'GET',
    headers: { Authorization: `Bearer ${process.env.SQUARE_ACCESS_TOKEN}`, 'Content-Type': 'application/json', 'Square-Version': '2025-01-23' },
    ...(body ? { body: JSON.stringify(body) } : {}), signal: AbortSignal.timeout(15000), cache: 'no-store',
  })
  const result = await response.json()
  if (!response.ok || result.errors) throw new ApiError(502, 'Payment provider is temporarily unavailable')
  return result
}
export function validProviderPayment(payment: { status?: string; order_id?: string; location_id?: string; amount_money?: { amount?: number; currency?: string }; refunded_money?: { amount?: number } }, orderId: string, location: string) {
  return payment.status === 'COMPLETED' && payment.order_id === orderId && payment.location_id === location &&
    payment.amount_money?.currency === 'USD' && Number(payment.amount_money.amount) === SERVICE_CENTS && Number(payment.refunded_money?.amount || 0) === 0
}
export async function verifyPayment(citationId: string) {
  const db = database()
  const { data: payments, error } = await db.from('service_payments').select('*').eq('citation_id', citationId).order('created_at', { ascending: false })
  checkDatabase(error)
  // Even a saved Square payment is rechecked before first fulfillment. A promo is
  // trusted only because the service-only SQL function atomically recorded it.
  for (const row of payments || []) {
    if (row.state === 'paid' && row.promo_code === 'LAUNCH5' && row.amount_cents === 0) return row
    if (!row.provider_order_id || row.amount_cents !== SERVICE_CENTS) continue
    const { order } = await square(`/orders/${encodeURIComponent(row.provider_order_id)}`)
    if (!order || order.location_id !== process.env.SQUARE_LOCATION_ID || order.state !== 'COMPLETED') continue
    for (const tender of order.tenders || []) {
      if (!tender.payment_id) continue
      const { payment } = await square(`/payments/${encodeURIComponent(tender.payment_id)}`)
      if (!payment || !validProviderPayment(payment, row.provider_order_id, process.env.SQUARE_LOCATION_ID!)) continue
      const { error: saveError } = await db.rpc('confirm_service_payment', { p_id: row.id, p_provider_payment: payment.id })
      checkDatabase(saveError)
      return { ...row, state: 'paid' }
    }
  }
  throw new ApiError(402, 'Payment has not been confirmed yet. If you just paid, please wait a moment and retry.')
}
