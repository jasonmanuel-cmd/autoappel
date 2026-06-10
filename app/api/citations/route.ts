import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { serverStore } from '@/lib/server-store'
import { sendConfirmationEmail, sendCitationVerificationEmail } from '@/lib/resend'
import { pushLeadToHubSpot } from '@/lib/hubspot'
import { validateCitationFormat, getCountyHint } from '@/lib/citation-validator'

export async function POST(request: NextRequest) {
  try {
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

    const required = ['firstName', 'lastName', 'email', 'citationNumber', 'county', 'violationType']
    const missing = required.filter(f => !body[f] || !String(body[f]).trim())
    if (missing.length > 0) {
      return NextResponse.json({ success: false, error: `Missing required fields: ${missing.join(', ')}` }, { status: 400 })
    }

    const result = await serverStore.addCitation(body)

    sendConfirmationEmail(body.email, body.citationNumber).catch(() => {})

    const validation = validateCitationFormat(body.citationNumber, body.county)
    if (!validation.valid || validation.confidence === 'low') {
      const expectedHint = getCountyHint(body.county)
      sendCitationVerificationEmail({
        email: body.email,
        citationNumber: body.citationNumber,
        county: body.county,
        firstName: body.firstName,
        expectedFormat: expectedHint || 'TX-XX-YYYY-NNNNN',
      }).catch(() => {})
    }

    pushLeadToHubSpot(body as Record<string, unknown>).catch(() => {})

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
