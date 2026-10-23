import { createHmac, timingSafeEqual } from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'
import { database, checkDatabase } from '@/lib/auth-server'
import { fulfillCitation } from '@/lib/fulfillment'
// Webhooks are authenticated by Square signatures, not user cookies/origin.
export async function POST(request: NextRequest) {
  const key = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY
  const url = process.env.SQUARE_WEBHOOK_URL
  if (!key || !url) return NextResponse.json({ error: 'Webhook not configured' }, { status: 503 })
  const body = await request.text()
  const expected = Buffer.from(createHmac('sha256',key).update(url+body).digest('base64'))
  const supplied = Buffer.from(request.headers.get('x-square-hmacsha256-signature') || '')
  if (expected.length !== supplied.length || !timingSafeEqual(expected,supplied)) return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  try {
    const event = JSON.parse(body)
    if (!['payment.created','payment.updated'].includes(event.type)) return NextResponse.json({ received:true })
    if (event.data?.object?.payment?.status !== 'COMPLETED') return NextResponse.json({ received:true })
    const order = event.data?.object?.payment?.order_id
    if (!order) return NextResponse.json({ received:true })
    const db = database()
    const { data: payment, error } = await db.from('service_payments').select('citation_id').eq('provider_order_id',order).maybeSingle()
    checkDatabase(error)
    if (!payment) return NextResponse.json({ received:true })
    const { data: citation, error: citationError } = await db.from('citations').select('*').eq('id',payment.citation_id).single()
    checkDatabase(citationError)
    // Re-fetch payment from Square: a signed event alone is not our payment ledger.
    await fulfillCitation(citation)
    return NextResponse.json({ received:true })
  } catch {
    // Non-2xx asks Square to retry; the durable claim and Resend key deduplicate.
    return NextResponse.json({ error: 'Payment reconciliation pending' }, { status: 503 })
  }
}
