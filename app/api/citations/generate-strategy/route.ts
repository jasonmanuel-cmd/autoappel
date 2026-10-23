import { NextResponse } from 'next/server'
import { api, authenticated, database, assertOwner, ApiError, checkDatabase } from '@/lib/auth-server'
import { generateStrategySchema } from '@/lib/validation'
import { fulfillCitation } from '@/lib/fulfillment'

export const POST = api(async req => {
  const user = await authenticated(req)
  const parsed = generateStrategySchema.safeParse(await req.json())
  if (!parsed.success) throw new ApiError(400, 'Citation ID required')
  const db = database()
  const { data: c, error } = await db.from('citations').select('*').eq('id', parsed.data.citationId).maybeSingle()
  checkDatabase(error); assertOwner(user, c)
  return NextResponse.json(await fulfillCitation(c))
})
