import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { rateLimit } from '@/lib/rate-limit'

const adminRoutes = [
  '/admin',
  '/control-panel', '/ambassadors', '/treasury', '/red-vault', '/qa',
]

const customerRoutes = [
  '/dashboard',
  '/verify-email',
]

const protectedRoutes = [...adminRoutes, ...customerRoutes]

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const clientIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
  const rateLimitResult = rateLimit(clientIp)

  if (!rateLimitResult.allowed) {
    return new NextResponse('Too many requests', { status: 429 })
  }

  const isProtectedRoute = protectedRoutes.some(route => pathname === route || pathname.startsWith(`${route}/`))
  if (!isProtectedRoute) return NextResponse.next()

  if (pathname === '/admin/login' || pathname === '/verify-email') return NextResponse.next()
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.startsWith('PASTE_')) {
    return NextResponse.redirect(new URL('/login?error=service_unavailable', request.url))
  }

  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    }
  )

  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (adminRoutes.some(route => pathname === route || pathname.startsWith(`${route}/`)) && user.app_metadata?.role !== 'admin') {
    return new NextResponse('Administrator access required', { status: 403 })
  }

  if (customerRoutes.some(route => pathname === route || pathname.startsWith(`${route}/`))) {
    if (!user.email_confirmed_at) {
      return NextResponse.redirect(new URL('/verify-email', request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/verify-email/:path*',
    '/admin/:path*',
    '/control-panel/:path*',
    '/ambassadors/:path*',
    '/treasury/:path*',
    '/red-vault/:path*',
    '/qa/:path*',
  ],
}
