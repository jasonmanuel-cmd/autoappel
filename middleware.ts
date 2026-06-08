import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { rateLimit } from '@/lib/rate-limit'

const adminRoutes = [
  '/admin/dashboard',
  '/control-panel', '/ambassadors', '/treasury', '/red-vault', '/qa',
]

const customerRoutes = [
  '/dashboard',
  '/verify-email',
]

const protectedRoutes = [...adminRoutes, ...customerRoutes]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const clientIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
  const rateLimitResult = rateLimit(clientIp)

  if (!rateLimitResult.allowed) {
    return new NextResponse('Too many requests', { status: 429 })
  }

  const isProtectedRoute = protectedRoutes.some(route => pathname === route || pathname.startsWith(`${route}/`))
  if (!isProtectedRoute) return NextResponse.next()

  if (process.env.NODE_ENV === 'production') {
    const demoCookie = request.cookies.get('aa_demo')?.value
    if (demoCookie === 'true') {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  if (pathname === '/verify-email') {
    return NextResponse.next()
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
    '/admin/dashboard/:path*',
    '/control-panel/:path*',
    '/ambassadors/:path*',
    '/treasury/:path*',
    '/red-vault/:path*',
    '/qa/:path*',
  ],
}
