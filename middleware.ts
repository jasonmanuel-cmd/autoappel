import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerSupabase } from '@/lib/supabase'
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

  // Apply rate limiting to all requests
  const clientIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
  const rateLimitResult = rateLimit(clientIp)

  if (!rateLimitResult.allowed) {
    return new NextResponse('Too many requests', { status: 429 })
  }

  // Only check protected routes
  const isProtectedRoute = protectedRoutes.some(route => pathname === route || pathname.startsWith(`${route}/`))
  if (!isProtectedRoute) return NextResponse.next()

  // PRODUCTION: Block all demo mode access
  if (process.env.NODE_ENV === 'production') {
    const demoCookie = request.cookies.get('aa_demo')?.value
    if (demoCookie === 'true') {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Check Supabase auth
  const supabase = createServerSupabase()
  if (!supabase) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  const token = request.cookies.get('sb-access-token')?.value
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  const { data: { user }, error } = await supabase.auth.getUser(token)
  if (error || !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Verify email for customer routes (unless already on /verify-email)
  if (customerRoutes.some(route => pathname === route || pathname.startsWith(`${route}/`))) {
    if (pathname !== '/verify-email' && !user.email_confirmed_at) {
      return NextResponse.redirect(new URL('/verify-email', request.url))
    }
  }

  // TODO: Add role-based access control for admin routes
  // For now, allow all authenticated users to access admin routes
  // This should be updated to check a user.role or admin_users table

  return NextResponse.next()
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
