import { NextResponse } from 'next/server'
import { api, authenticated, database, ApiError, checkDatabase } from '@/lib/auth-server'
import { validatePromoSchema } from '@/lib/validation'
export const POST = api(async req => {
  await authenticated(req)
  const parsed = validatePromoSchema.safeParse(await req.json())
  if (!parsed.success || parsed.data.code.trim().toUpperCase() !== 'LAUNCH5') throw new ApiError(400, 'Invalid promotion')
  const { data, error } = await database().from('promo_campaigns').select('uses,max_uses').eq('code','LAUNCH5').single()
  checkDatabase(error)
  if (!data) throw new ApiError(503, 'Promotion unavailable')
  const remaining = Math.max(0, data.max_uses - data.uses)
  return NextResponse.json({ valid: remaining > 0, ...(remaining ? { promo: { label: 'Founding Launch — Free Strategy', discountPercent: 100, remaining, isFree: true } } : { error: 'Promotion exhausted' }) })
})
