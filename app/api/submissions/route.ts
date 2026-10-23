import { NextResponse } from 'next/server'
import { z } from 'zod'
import { api, authenticated, database, assertOwner, ApiError, checkDatabase } from '@/lib/auth-server'
import { sendSubmissionReceivedEmail } from '@/lib/email-service'
const schema = z.object({ citationId: z.string().uuid(), type: z.enum(['appeal','dismissal','payment_plan']), reason: z.string().max(2000).optional(), details: z.string().min(1).max(10000) })
export const POST = api(async req => {
  const user = await authenticated(req)
  const parsed = schema.safeParse(await req.json())
  if (!parsed.success) throw new ApiError(400, 'A citation, request type and details are required')
  const db = database(), input = parsed.data
  const { data: citation, error } = await db.from('citations').select('*').eq('id',input.citationId).maybeSingle()
  checkDatabase(error); assertOwner(user,citation)
  const { data: submission, error: insertError } = await db.from('submissions').insert({ citation_id: citation.id, customer_email: user.email, submission_type: input.type, reason: input.reason || '', details: input.details, status: 'pending' }).select('id').single()
  checkDatabase(insertError)
  await sendSubmissionReceivedEmail(user.email!,citation.first_name,citation.citation_number,input.type)
  return NextResponse.json({ success:true, data:submission }, { status:201 })
})
