import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { pushLeadToHubSpot } from '@/lib/hubspot'
import { hubspotLeadSchema } from '@/lib/validation'
import { apiLimiter } from '@/lib/rate-limiter'

function getClientIp(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1'
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request)
    const check = apiLimiter.check(ip)
    if (!check.allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }

    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
      cookies: {
        getAll() { return request.cookies.getAll() },
      },
    })
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    const parsed = hubspotLeadSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: 'Invalid lead data' }, { status: 400 })
    }

    const result = await pushLeadToHubSpot(parsed.data as Record<string, unknown>)
    return NextResponse.json({ success: true, data: result })
  } catch (err) {
    return NextResponse.json({ success: false, error: err instanceof Error ? err.message : 'HubSpot integration failed' }, { status: 500 })
  }
}
