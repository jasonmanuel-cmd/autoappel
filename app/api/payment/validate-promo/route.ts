import { NextRequest, NextResponse } from 'next/server'
import { getPromo, isFree } from '@/lib/promo'
import { createServerSupabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const { code, citationId } = await req.json()
    if (!code) {
      return NextResponse.json({ valid: false, error: 'No promo code provided' })
    }

    const promo = getPromo(code)
    if (!promo) {
      return NextResponse.json({ valid: false, error: 'Invalid promo code' })
    }

    const supabase = createServerSupabase()
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
