import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase'
export async function GET() {
  const db = createServerSupabase()
  let database = 'unavailable'
  if (db) {
    try { const { error } = await db.from('citations').select('id', { head: true, count: 'exact' }); if (!error) database = 'ok' } catch {}
  }
  const configured = (name: string) => !!process.env[name] && !process.env[name]?.startsWith('PASTE_')
  const ready = database === 'ok' && ['RESEND_API_KEY','TURNSTILE_SECRET_KEY','NEXT_PUBLIC_TURNSTILE_SITE_KEY','SQUARE_ACCESS_TOKEN','SQUARE_LOCATION_ID','SQUARE_ENV','SQUARE_WEBHOOK_SIGNATURE_KEY','SQUARE_WEBHOOK_URL','NEXT_PUBLIC_APP_URL','CRON_SECRET'].every(configured)
  return NextResponse.json({ status: ready ? 'ready' : 'degraded', database, note: 'Readiness checks configuration and database connectivity, not provider delivery.' }, { status: ready ? 200 : 503 })
}
