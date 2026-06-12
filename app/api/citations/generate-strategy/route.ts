import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { serverStore } from '@/lib/server-store'
import { generateStrategyPDFAndSend } from '@/lib/pdf-generator'
import { generateStrategySchema } from '@/lib/validation'
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

    const parsed = generateStrategySchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'citationId required' }, { status: 400 })
    }

    const { citationId } = parsed.data

    const citation = await serverStore.getCitation(citationId)
    if (!citation) {
      return NextResponse.json({ error: 'Citation not found' }, { status: 404 })
    }

    const result = await generateStrategyPDFAndSend({
      firstName: citation.first_name,
      lastName: citation.last_name,
      citationNumber: citation.citation_number,
      violationType: citation.violation_type || 'N/A',
      county: citation.county || 'N/A',
      court: citation.court || 'N/A',
      jurisdiction: citation.jurisdiction || 'N/A',
      responseDeadline: citation.response_deadline || 'N/A',
      citationDate: citation.citation_date || 'N/A',
      email: citation.email,
    })

    if (result.success) {
      await serverStore.updateCitationPayment(citationId, 'paid')
      await serverStore.updateCitationStatus(citationId, 'in_review', 'Strategy document generated and sent')
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Strategy generation error:', error)
    return NextResponse.json({ success: false, error: 'Strategy generation failed' }, { status: 500 })
  }
}
