import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import {
  sendDeadlineAlert48hSMS,
  sendPaymentReceivedSMS,
  sendSubmissionDecisionSMS,
} from '@/lib/sms-service'
import { notificationSMSSchema } from '@/lib/validation'
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

    const parsed = notificationSMSSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const { type, phoneNumber, citationNumber, deadline, amount, submissionType, decision } = parsed.data
    let success = false

    switch (type) {
      case 'deadline_alert_48h':
        success = await sendDeadlineAlert48hSMS(phoneNumber, citationNumber!, deadline!)
        break

      case 'payment_received':
        success = await sendPaymentReceivedSMS(phoneNumber, citationNumber!, amount ?? 0)
        break

      case 'submission_decision':
        success = await sendSubmissionDecisionSMS(
          phoneNumber,
          citationNumber!,
          submissionType!,
          decision!
        )
        break
    }

    return NextResponse.json(
      { success, message: success ? 'SMS sent' : 'SMS delivery failed' },
      { status: success ? 200 : 500 }
    )
  } catch (error) {
    console.error('SMS Notification API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
