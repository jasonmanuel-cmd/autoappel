import { createClient } from '@supabase/supabase-js'

function missing(key: string): boolean {
  const v = process.env[key]
  return !v || v.startsWith('PASTE_') || v === ''
}

function isConfigured(): boolean {
  return !missing('NEXT_PUBLIC_SUPABASE_URL') && !missing('NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

export function createServerSupabase() {
  if (!isConfigured()) return null
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  return createClient(url, key, { auth: { persistSession: false } })
}

export function createClientSupabase() {
  if (!isConfigured()) return null
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  return createClient(url, key)
}

export const supabaseConfig = { configured: isConfigured() }
