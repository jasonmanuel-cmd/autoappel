import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { sendWelcomeEmail, sendVerificationEmail } from '@/lib/email-service'
import { notificationEmailSchema } from '@/lib/validation'
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

    const parsed = notificationEmailSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const { type, email, firstName, verificationUrl } = parsed.data
    let success = false

    switch (type) {
      case 'welcome':
        success = await sendWelcomeEmail(email, firstName)
        break

      case 'verification':
        success = await sendVerificationEmail(email, firstName, verificationUrl!)
        break
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
