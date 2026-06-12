import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { serverStore } from '@/lib/server-store'
import { citationStatusSchema } from '@/lib/validation'
import { apiLimiter } from '@/lib/rate-limiter'

function getClientIp(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1'
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() { return request.cookies.getAll() },
    },
  })
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const citation = await serverStore.getCitation(params.id)
  if (!citation) {
    return NextResponse.json({ success: false, error: 'Citation not found' }, { status: 404 })
  }
  return NextResponse.json({ success: true, data: citation })
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
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

    const parsed = citationStatusSchema.safeParse(body)
    if (!parsed.success) {
      const errors = parsed.error.issues.map(i => i.message).join(', ')
      return NextResponse.json({ success: false, error: errors }, { status: 400 })
    }

    const { status, notes } = parsed.data

    const updated = await serverStore.updateCitationStatus(params.id, status, notes)
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Citation not found' }, { status: 404 })
    }

    const citation = await serverStore.getCitation(params.id)
    return NextResponse.json({ success: true, data: citation })
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request body' }, { status: 400 })
  }
}
