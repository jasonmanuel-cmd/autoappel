import { NextResponse } from 'next/server'
import { sendEmail } from '@/lib/resend'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { to, subject, html } = body

    if (!to || !subject) {
      return NextResponse.json({ success: false, error: 'Missing required fields: to, subject' }, { status: 400 })
    }

    const result = await sendEmail(to, subject, html || '')

    return NextResponse.json({
      success: true,
      data: { messageId: result.messageId, message: 'Email sent successfully.' },
    })
  } catch (err) {
    return NextResponse.json({ success: false, error: err instanceof Error ? err.message : 'Failed to send email' }, { status: 500 })
  }
}
