import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { serverStore } from '@/lib/server-store'
import { verifyTurnstile } from '@/lib/turnstile'
import { contactSchema } from '@/lib/validation'
import { contactLimiter } from '@/lib/rate-limiter'

function getClientIp(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1'
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request)
    const check = contactLimiter.check(ip)
    if (!check.allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }

    const body = await request.json()

    const parsed = contactSchema.safeParse(body)
    if (!parsed.success) {
      const errors = parsed.error.issues.map(i => i.message).join(', ')
      return NextResponse.json({ success: false, error: errors }, { status: 400 })
    }

    const { name, email, subject, message, turnstileToken: token } = parsed.data

    if (!token) {
      return NextResponse.json({ success: false, error: 'Security check required' }, { status: 400 })
    }
    const valid = await verifyTurnstile(token)
    if (!valid) {
      return NextResponse.json({ success: false, error: 'Security check failed' }, { status: 400 })
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
