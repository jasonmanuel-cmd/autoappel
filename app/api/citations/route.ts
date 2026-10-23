import { NextResponse } from 'next/server'
import { api, authenticated, database, isAdmin, ApiError, checkDatabase } from '@/lib/auth-server'
import { citationSchema } from '@/lib/validation'
import { verifyTurnstile } from '@/lib/turnstile'
import { sendConfirmationEmail } from '@/lib/resend'

export const POST = api(async request => {
  const user = await authenticated(request)
  const parsed = citationSchema.safeParse(await request.json())
  if (!parsed.success) throw new ApiError(400, parsed.error.issues.map(i => i.message).join(', '))
  const c = parsed.data
  if (!c.turnstileToken || !await verifyTurnstile(c.turnstileToken)) throw new ApiError(400, 'Security check failed. Please complete it again.')
  if (c.email.toLowerCase() !== user.email?.toLowerCase()) throw new ApiError(400, 'Use the email address associated with your account')
  const { data, error } = await database().from('citations').insert({
    user_id: user.id, email: user.email, first_name: c.firstName, last_name: c.lastName,
    phone: c.phone, preferred_contact: c.preferredContact, citation_number: c.citationNumber,
    citation_date: c.citationDate || null, response_deadline: c.responseDeadline || null,
    county: c.county, court: c.court, jurisdiction: c.jurisdiction, violation_type: c.violationType,
    status: 'pending', payment_status: 'unpaid', service_fee_status: 'unpaid',
  }).select('id, status').single()
  checkDatabase(error)
  // Wait for the attempt; delivery failure must not discard an already persisted citation.
  await sendConfirmationEmail(user.email!, c.citationNumber).catch(() => {})
  return NextResponse.json({ success: true, data }, { status: 201 })
})
export const GET = api(async request => {
  const user = await authenticated(request)
  let query = database().from('citations').select('*').order('created_at', { ascending: false })
  if (!isAdmin(user)) query = query.eq('user_id', user.id)
  const { data, error } = await query
  checkDatabase(error)
  const citations = data || []
  const count = (status: string) => citations.filter(c => c.status === status).length
  return NextResponse.json({ success: true, data: { citations, stats: { total: citations.length, new: count('pending'), inReview: count('in_review'), accepted: count('accepted'), rejected: count('rejected'), flagged: count('flagged') } } })
})
