import { NextResponse } from 'next/server'
import { sendSms } from '@/lib/twilio'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { to, message } = body

    if (!to || !message) {
      return NextResponse.json({ success: false, error: 'Missing required fields: to, message' }, { status: 400 })
    }

    const result = await sendSms(to, message)

    return NextResponse.json({
      success: true,
      data: { sid: result.sid, message: 'SMS sent successfully.' },
    })
  } catch (err) {
    return NextResponse.json({ success: false, error: err instanceof Error ? err.message : 'Failed to send SMS' }, { status: 500 })
  }
}
