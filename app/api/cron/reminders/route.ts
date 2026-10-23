import { timingSafeEqual } from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase'
import { sendDeadlineAlertEmail } from '@/lib/email-service'
import { sendDeadlineAlert48hSMS } from '@/lib/sms-service'
export const maxDuration = 60
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET
  if (!secret) return NextResponse.json({ error: 'Reminder service is not configured' }, { status: 503 })
  const actual = Buffer.from(request.headers.get('authorization') || '')
  const expected = Buffer.from(`Bearer ${secret}`)
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const db = createServerSupabase()
  if (!db) return NextResponse.json({ error: 'Database unavailable' }, { status: 503 })
  let sent = 0, failed = 0, skipped = 0
  try {
    const { data, error } = await db.from('citations').select('id,email,phone,first_name,citation_number,response_deadline,preferred_contact').in('status',['pending','in_review','appealing'])
      .gt('response_deadline',new Date().toISOString()).lte('response_deadline',new Date(Date.now()+7*86400000).toISOString())
    if (error) throw error
    for (const c of data || []) {
      const days = Math.ceil((new Date(c.response_deadline).getTime()-Date.now())/86400000)
      for (const channel of ['email','sms']) {
        if (channel === 'sms' && (days > 2 || !c.phone || !['sms','both'].includes(c.preferred_contact))) continue
        if (channel === 'email' && !['email','both'].includes(c.preferred_contact || 'email')) continue
        const key = { citation_id: c.id, deadline: c.response_deadline, channel, day: new Date().toISOString().slice(0,10) }
        const { error: claimError } = await db.from('reminder_deliveries').insert(key)
        if (claimError?.code === '23505') { skipped++; continue }
        if (claimError) throw claimError
        const ok = channel === 'email'
          ? await sendDeadlineAlertEmail(c.email,c.first_name,c.citation_number,c.response_deadline,days)
          : await sendDeadlineAlert48hSMS(c.phone,c.citation_number,c.response_deadline)
        const { error: saveError } = await db.from('reminder_deliveries').update({ state: ok ? 'sent' : 'failed' }).match(key)
        if (saveError) throw saveError
        if (ok) sent++; else failed++
      }
    }
    return NextResponse.json({ ok: failed===0, sent, failed, skipped }, { status: failed ? 502 : 200 })
  } catch { return NextResponse.json({ error: 'Reminder run failed', sent, failed, skipped }, { status: 503 }) }
}
