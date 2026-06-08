import { NextRequest, NextResponse } from 'next/server'
import { pushLeadToHubSpot } from '@/lib/hubspot'
import { sendWelcomeEmail } from '@/lib/email-service'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 })
    }

    const firstName = email.split('@')[0]

    pushLeadToHubSpot({ email, firstName }).catch(() => {})

    sendWelcomeEmail(email, firstName).catch(() => {})

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Signup webhook error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
