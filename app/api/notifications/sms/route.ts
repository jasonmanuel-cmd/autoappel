import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase'
import {
  sendDeadlineAlert48hSMS,
  sendPaymentReceivedSMS,
  sendSubmissionDecisionSMS,
} from '@/lib/sms-service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, phoneNumber, ...rest } = body

    if (!type || !phoneNumber) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    let success = false

    switch (type) {
      case 'deadline_alert_48h':
        success = await sendDeadlineAlert48hSMS(phoneNumber, rest.citationNumber, rest.deadline)
        break

      case 'payment_received':
        success = await sendPaymentReceivedSMS(phoneNumber, rest.citationNumber, rest.amount)
        break

      case 'submission_decision':
        success = await sendSubmissionDecisionSMS(
          phoneNumber,
          rest.citationNumber,
          rest.submissionType,
          rest.decision
        )
        break

      default:
        return NextResponse.json(
          { error: 'Unknown notification type' },
          { status: 400 }
        )
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
