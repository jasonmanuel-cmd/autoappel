import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { to, subject } = body

    if (!to || !subject) {
      return NextResponse.json({ success: false, error: 'Missing required fields: to, subject' }, { status: 400 })
    }

    console.log(`[MOCK EMAIL] To: ${to} | Subject: ${subject} | Sent at: ${new Date().toISOString()}`)

    return NextResponse.json({
      success: true,
      data: { messageId: `msg_${crypto.randomUUID().slice(0, 8)}`, message: 'Email queued successfully.' },
    })
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request body' }, { status: 400 })
  }
}
