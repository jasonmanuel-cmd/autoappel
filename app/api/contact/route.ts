import { NextResponse } from 'next/server'
import { serverStore } from '@/lib/server-store'
import { verifyTurnstile } from '@/lib/turnstile'

export async function POST(request: Request) {
  // Note: No auth here — contact form must be public.
  // Add rate limiting in production (e.g., Upstash Ratelimit, Vercel KV, or similar).
  try {
    const body = await request.json()
    const { name, email, subject, message } = body

    const token = body.turnstileToken
    if (!token) {
      return NextResponse.json({ success: false, error: 'Security check required' }, { status: 400 })
    }
    const valid = await verifyTurnstile(token)
    if (!valid) {
      return NextResponse.json({ success: false, error: 'Security check failed' }, { status: 400 })
    }

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ success: false, error: 'All fields are required' }, { status: 400 })
    }

    if (!email.includes('@')) {
      return NextResponse.json({ success: false, error: 'Invalid email address' }, { status: 400 })
    }

    const entry = await serverStore.addContact({ name, email, subject, message })

    return NextResponse.json({
      success: true,
      data: { id: entry.id, message: entry.message },
    })
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request body' }, { status: 400 })
  }
}

export async function GET() {
  const contacts = await serverStore.getContacts()
  return NextResponse.json({ success: true, data: contacts })
}
