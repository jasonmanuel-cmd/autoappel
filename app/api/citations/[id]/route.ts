import { NextRequest, NextResponse } from 'next/server'
import { api, authenticated, database, assertOwner, ApiError, checkDatabase } from '@/lib/auth-server'
import { citationStatusSchema } from '@/lib/validation'

type Context = { params: Promise<{ id: string }> }
export async function GET(request: NextRequest, context: Context) {
  return api(async req => {
    const user = await authenticated(req)
    const { id } = await context.params
    const { data, error } = await database().from('citations').select('*').eq('id', id).maybeSingle()
    checkDatabase(error)
    assertOwner(user, data)
    return NextResponse.json({ success: true, data })
  })(request)
}
export async function PATCH(request: NextRequest, context: Context) {
  return api(async req => {
    await authenticated(req, true)
    const { id } = await context.params
    const parsed = citationStatusSchema.safeParse(await req.json())
    if (!parsed.success) throw new ApiError(400, 'Invalid status')
    const { data, error } = await database().from('citations').update({ ...parsed.data, updated_at: new Date().toISOString() }).eq('id', id).select('*').maybeSingle()
    checkDatabase(error)
    if (!data) throw new ApiError(404, 'Citation not found')
    return NextResponse.json({ success: true, data })
  })(request)
}
