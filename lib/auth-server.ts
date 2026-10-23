import { createServerClient, type CookieOptions } from '@supabase/ssr'
import type { User } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from './supabase'
import { apiLimiter } from './rate-limiter'

const refreshedCookies = new WeakMap<NextRequest, { name: string; value: string; options: CookieOptions }[]>()

export class ApiError extends Error {
  constructor(public status: number, message: string) { super(message) }
}
export const isAdmin = (user: Pick<User, 'app_metadata'>) => user.app_metadata?.role === 'admin'
export function assertOwner(user: User, citation: { user_id?: string | null } | null) {
  if (!citation || (!isAdmin(user) && citation.user_id !== user.id)) throw new ApiError(404, 'Citation not found')
}
export function assertSameOrigin(request: NextRequest) {
  const origin = request.headers.get('origin')
  if (!origin) return // non-browser clients still require authentication
  const expected = process.env.NEXT_PUBLIC_APP_URL
  if (!expected || new URL(expected).origin !== origin) throw new ApiError(403, 'Untrusted origin')
}
export async function authenticated(request: NextRequest, admin = false) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key || key.startsWith('PASTE_')) throw new ApiError(503, 'Authentication is not configured')
  const auth = createServerClient(url, key, { cookies: { getAll: () => request.cookies.getAll(), setAll: cookies => { refreshedCookies.set(request, cookies); cookies.forEach(({name,value}) => request.cookies.set(name,value)) } } })
  const { data: { user }, error } = await auth.auth.getUser()
  if (error || !user) throw new ApiError(401, 'Please sign in')
  if (!user.email_confirmed_at) throw new ApiError(403, 'Please verify your email')
  if (admin && !isAdmin(user)) throw new ApiError(403, 'Administrator access required')
  return user
}
export function database() {
  const db = createServerSupabase()
  if (!db) throw new ApiError(503, 'Database is not configured')
  return db
}
export function api(handler: (request: NextRequest) => Promise<Response>) {
  return async (request: NextRequest) => {
    let response: Response
    try {
      const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
      if (!apiLimiter.check(ip).allowed) throw new ApiError(429, 'Too many requests')
      if (!['GET', 'HEAD'].includes(request.method)) assertSameOrigin(request)
      response = await handler(request)
    } catch (error) {
      if (error instanceof ApiError) response = NextResponse.json({ success: false, error: error.message }, { status: error.status })
      else if (error instanceof SyntaxError) response = NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
      else {
        console.error('API operation failed', error instanceof Error ? error.message : 'Unknown error')
        response = NextResponse.json({ success: false, error: 'Service temporarily unavailable. Please try again.' }, { status: 503 })
      }
    }
    for (const {name,value,options} of refreshedCookies.get(request) || []) {
      if (response instanceof NextResponse) response.cookies.set(name,value,options)
    }
    response.headers.set('Cache-Control', 'private, no-store')
    return response
  }
}
export function checkDatabase(error: { message: string } | null) {
  if (error) throw new Error(error.message)
}
