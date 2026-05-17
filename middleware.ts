import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const adminRoutes = [
  '/control-panel', '/ambassadors', '/treasury', '/red-vault', '/qa',
  '/test-dashboard', '/demo-payment',
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isAdminRoute = adminRoutes.some(route => pathname === route || pathname.startsWith(`${route}/`))
  if (!isAdminRoute) return NextResponse.next()

  const demoCookie = request.cookies.get('aa_demo')
  if (demoCookie?.value === 'true') return NextResponse.next()

  return NextResponse.redirect(new URL('/login', request.url))
}

export const config = {
  matcher: [
    '/control-panel/:path*', '/ambassadors/:path*', '/treasury/:path*',
    '/red-vault/:path*', '/qa/:path*', '/test-dashboard/:path*', '/demo-payment/:path*',
  ],
}
