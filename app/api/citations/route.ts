import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { serverStore } from '@/lib/server-store'
import { sendConfirmationEmail, sendCitationVerificationEmail } from '@/lib/resend'
import { pushLeadToHubSpot } from '@/lib/hubspot'
import { validateCitationFormat, getCountyHint } from '@/lib/citation-validator'
import { verifyTurnstile } from '@/lib/turnstile'
import { citationSchema } from '@/lib/validation'
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

    const parsed = citationSchema.safeParse(body)
    if (!parsed.success) {
      const errors = parsed.error.issues.map(i => i.message).join(', ')
      return NextResponse.json({ success: false, error: errors }, { status: 400 })
    }

    const token = parsed.data.turnstileToken
    if (!token) {
      return NextResponse.json({ success: false, error: 'Security check required' }, { status: 400 })
    }
    const valid = await verifyTurnstile(token)
    if (!valid) {
      return NextResponse.json({ success: false, error: 'Security check failed' }, { status: 400 })
    }

    const result = await serverStore.addCitation(parsed.data)

    sendConfirmationEmail(parsed.data.email, parsed.data.citationNumber).catch(() => {})

    const validation = validateCitationFormat(parsed.data.citationNumber, parsed.data.county)
    if (!validation.valid || validation.confidence === 'low') {
      const expectedHint = getCountyHint(parsed.data.county)
      sendCitationVerificationEmail({
        email: parsed.data.email,
        citationNumber: parsed.data.citationNumber,
        county: parsed.data.county,
        firstName: parsed.data.firstName,
        expectedFormat: expectedHint || 'TX-XX-YYYY-NNNNN',
      }).catch(() => {})
    }

    pushLeadToHubSpot(parsed.data as Record<string, unknown>).catch(() => {})

    return NextResponse.json({ success: true, data: result, validation: { valid: validation.valid, confidence: validation.confidence, message: validation.message } })
  } catch (err) {
    return NextResponse.json({ success: false, error: err instanceof Error ? err.message : 'Invalid request body' }, { status: 400 })
  }
}

export async function GET(request: NextRequest) {
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() { return request.cookies.getAll() },
    },
  })
  const { data: { user } } = await supabase.auth.getUser()
  const isDemo = request.cookies.get('demo_mode')?.value === 'true'
  if (!user && !isDemo) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const [stats, citations] = await Promise.all([
    serverStore.getCitationStats(),
    serverStore.getCitations(),
  ])
  return NextResponse.json({ success: true, data: { stats, citations } })
}
