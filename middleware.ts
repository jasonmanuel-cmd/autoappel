import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerSupabase } from '@/lib/supabase'

const adminRoutes = [
  '/control-panel', '/ambassadors', '/treasury', '/red-vault', '/qa',
  ...(process.env.NODE_ENV === 'production' ? [] : ['/test-dashboard', '/demo-payment']),
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isAdminRoute = adminRoutes.some(route => pathname === route || pathname.startsWith(`${route}/`))
  if (!isAdminRoute) return NextResponse.next()

  // Only allow demo cookie in development
  const demoCookie = request.cookies.get('aa_demo')
  if (process.env.NODE_ENV !== 'production' && demoCookie?.value === 'true') {
    return NextResponse.next()
  }

  const supabase = createServerSupabase()
  if (supabase) {
    const token = request.cookies.get('sb-access-token')?.value
    if (token) {
      const { data: { user } } = await supabase.auth.getUser(token)
      if (user) return NextResponse.next()
    }
  }

  return NextResponse.redirect(new URL('/login', request.url))
}

export const config = {
  matcher: [
    '/control-panel/:path*', '/ambassadors/:path*', '/treasury/:path*',
    '/red-vault/:path*', '/qa/:path*', '/test-dashboard/:path*', '/demo-payment/:path*',
  ],
}
