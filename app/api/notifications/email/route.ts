import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase'
import { sendWelcomeEmail, sendVerificationEmail } from '@/lib/email-service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, email, firstName, ...rest } = body

    if (!type || !email || !firstName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    let success = false

    switch (type) {
      case 'welcome':
        success = await sendWelcomeEmail(email, firstName)
        break

      case 'verification':
        success = await sendVerificationEmail(email, firstName, rest.verificationUrl)
        break

      default:
        return NextResponse.json(
          { error: 'Unknown notification type' },
          { status: 400 }
        )
    }

    return NextResponse.json(
      { success, message: success ? 'Email sent' : 'Email delivery failed' },
      { status: success ? 200 : 500 }
    )
  } catch (error) {
    console.error('Notification API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
