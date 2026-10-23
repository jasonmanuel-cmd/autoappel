import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'
export async function GET(request: NextRequest) {
  const base = process.env.NEXT_PUBLIC_APP_URL
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!base || !url || !key) return NextResponse.json({ error: 'Authentication unavailable' }, { status: 503 })
  const next = request.nextUrl.searchParams.get('next')
  const destination = next === '/reset-password' ? next : '/dashboard'
  const response = NextResponse.redirect(new URL(destination, base))
  const supabase = createServerClient(url,key,{ cookies: {
    getAll: () => request.cookies.getAll(),
    setAll: cookies => cookies.forEach(({ name,value,options }) => response.cookies.set(name,value,options)),
  } })
  const code = request.nextUrl.searchParams.get('code')
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) return response
  }
  return NextResponse.redirect(new URL('/login?error=invalid_auth_link', base))
}
