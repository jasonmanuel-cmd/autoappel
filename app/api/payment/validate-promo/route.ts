import { NextRequest, NextResponse } from 'next/server'
import { getPromo, isFree } from '@/lib/promo'
import { createServerSupabase } from '@/lib/supabase'
import { validatePromoSchema } from '@/lib/validation'
import { apiLimiter } from '@/lib/rate-limiter'

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1'
  const check = apiLimiter.check(ip)
  if (!check.allowed) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  try {
    const body = await req.json()
    const parsed = validatePromoSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ valid: false, error: 'No promo code provided' })
    }
    const { code, citationId } = parsed.data

    const supabase = createServerSupabase()
    if (supabase) {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
    }

    const promo = getPromo(code)
    if (!promo) {
      return NextResponse.json({ valid: false, error: 'Invalid promo code' })
    }

    let usageCount = 0

    if (supabase) {
      try {
        const { count } = await supabase
          .from('citations')
          .select('*', { count: 'exact', head: true })
          .eq('promo_code', promo.code)
        usageCount = count ?? 0
      } catch {
        usageCount = 0
      }
    }

    const remaining = Math.max(0, promo.maxUses - usageCount)

    if (remaining <= 0) {
      return NextResponse.json({ valid: false, error: 'This promo code has reached its maximum uses' })
    }

    return NextResponse.json({
      valid: true,
      promo: {
        code: promo.code,
        label: promo.label,
        discountPercent: promo.discountPercent,
        maxUses: promo.maxUses,
        remaining,
        isFree: isFree(promo),
      },
    })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
