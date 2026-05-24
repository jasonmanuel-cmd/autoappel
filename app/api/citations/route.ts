import { NextResponse } from 'next/server'
import { serverStore } from '@/lib/server-store'
import { sendConfirmationEmail } from '@/lib/resend'
import { pushLeadToHubSpot } from '@/lib/hubspot'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const required = ['firstName', 'lastName', 'email', 'citationNumber', 'county', 'violationType']
    const missing = required.filter(f => !body[f] || !String(body[f]).trim())
    if (missing.length > 0) {
      return NextResponse.json({ success: false, error: `Missing required fields: ${missing.join(', ')}` }, { status: 400 })
    }

    const result = await serverStore.addCitation(body)

    sendConfirmationEmail(body.email, body.citationNumber).catch(() => {})

    pushLeadToHubSpot(body as Record<string, unknown>).catch(() => {})

    return NextResponse.json({ success: true, data: result })
  } catch (err) {
    return NextResponse.json({ success: false, error: err instanceof Error ? err.message : 'Invalid request body' }, { status: 400 })
  }
}

export async function GET() {
  const [stats, citations] = await Promise.all([
    serverStore.getCitationStats(),
    serverStore.getCitations(),
  ])
  return NextResponse.json({ success: true, data: { stats, citations } })
}
