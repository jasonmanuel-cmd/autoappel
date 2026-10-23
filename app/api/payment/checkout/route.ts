import { NextResponse } from 'next/server'
import { api, authenticated, database, assertOwner, ApiError, checkDatabase } from '@/lib/auth-server'
import { checkoutSchema } from '@/lib/validation'
import { SERVICE_CENTS, SERVICE_PLAN, square } from '@/lib/payments'

export const POST = api(async req => {
  const user = await authenticated(req)
  const parsed = checkoutSchema.safeParse(await req.json())
  if (!parsed.success || !parsed.data.citation_id || parsed.data.plan !== SERVICE_PLAN) throw new ApiError(400, 'A citation and valid service plan are required')
  const { citation_id: id, promoCode } = parsed.data
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY.startsWith('PASTE_')) throw new ApiError(503, 'Document delivery is not configured; checkout is unavailable')
  const db = database()
  const { data: citation, error } = await db.from('citations').select('id,user_id').eq('id', id).maybeSingle()
  checkDatabase(error); assertOwner(user, citation)
  const app = process.env.NEXT_PUBLIC_APP_URL
  if (!app) throw new ApiError(503, 'Application URL is not configured')
  const success = `${new URL(app).origin}/payment/success?citation_id=${encodeURIComponent(id)}`
  if (promoCode) {
    if (promoCode.trim().toUpperCase() !== 'LAUNCH5') throw new ApiError(400, 'Invalid promotion')
    const { error: promoError } = await db.rpc('redeem_launch_promo', { p_citation: id, p_user: user.id })
    if (promoError) throw new ApiError(409, 'Promotion unavailable. Refresh and try without a promo code.')
    return NextResponse.json({ url: success, free: true })
  }
  if (!process.env.SQUARE_WEBHOOK_SIGNATURE_KEY || !process.env.SQUARE_WEBHOOK_URL) throw new ApiError(503, 'Payment reconciliation is not configured')
  const { data: paymentId, error: reserveError } = await db.rpc('reserve_service_checkout', { p_citation: id, p_user: user.id })
  checkDatabase(reserveError)
  const { data: row, error: rowError } = await db.from('service_payments').select('*').eq('id', paymentId).single()
  checkDatabase(rowError)
  if (!row) throw new ApiError(503, 'Unable to create checkout')
  if (row.state === 'paid') return NextResponse.json({ url: success })
  if (row.checkout_url) return NextResponse.json({ url: row.checkout_url, id: row.id })
  const result = await square('/online-checkout/payment-links', {
    idempotency_key: row.id,
    quick_pay: { name: `AppealMyTickets.com — ${SERVICE_PLAN}`, price_money: { amount: SERVICE_CENTS, currency: 'USD' }, location_id: process.env.SQUARE_LOCATION_ID },
    checkout_options: { redirect_url: success, ask_for_shipping_address: false, enable_coupon: false, enable_loyalty: false },
    payment_note: `Strategy service ${row.id}`,
  })
  const link = result.payment_link
  if (!link?.url || !link.order_id) throw new ApiError(502, 'Invalid checkout response')
  const { error: saveError } = await db.from('service_payments').update({ provider_order_id: link.order_id, checkout_url: link.url }).eq('id', row.id)
  checkDatabase(saveError)
  return NextResponse.json({ url: link.url, id: row.id })
})
