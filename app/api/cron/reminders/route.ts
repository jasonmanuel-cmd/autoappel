import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase'
import { sendDeadlineAlertEmail } from '@/lib/email-service'
import { sendDeadlineAlert48hSMS } from '@/lib/sms-service'

export const maxDuration = 60

export async function GET() {
  const results: string[] = []
  const errors: string[] = []

  try {
    const supabase = createServerSupabase()
    if (!supabase) {
      results.push('Supabase not configured — skipping reminder check')
      return NextResponse.json({ ok: true, results, errors })
    }

    const { data: citations, error } = await supabase
      .from('citations')
      .select('*')
      .in('status', ['pending', 'in_review', 'appealing'])

    if (error) {
      errors.push(`DB query failed: ${error.message}`)
      return NextResponse.json({ ok: false, errors }, { status: 500 })
    }

    const now = Date.now()

    for (const c of citations || []) {
      if (!c.response_deadline) continue

      const diffMs = new Date(c.response_deadline).getTime() - now
      const daysRemaining = Math.ceil(diffMs / 86400000)

      if (daysRemaining <= 7 && daysRemaining > 0) {
        try {
          await sendDeadlineAlertEmail(
            c.email,
            c.first_name || 'Valued Customer',
            c.citation_number,
            c.response_deadline,
            daysRemaining,
          )
          results.push(`Email reminder sent to ${c.email} for ${c.citation_number} (${daysRemaining}d remaining)`)
        } catch (e) {
          errors.push(`Email failed for ${c.citation_number}: ${e}`)
        }
      }

      if (daysRemaining <= 2 && daysRemaining > 0 && c.phone) {
        try {
          await sendDeadlineAlert48hSMS(c.phone, c.citation_number, c.response_deadline)
          results.push(`SMS reminder sent to ${c.phone} for ${c.citation_number}`)
        } catch (e) {
          errors.push(`SMS failed for ${c.citation_number}: ${e}`)
        }
      }
    }
  } catch (e) {
    errors.push(`Cron error: ${e}`)
  }

  return NextResponse.json({ ok: errors.length === 0, results, errors })
}
