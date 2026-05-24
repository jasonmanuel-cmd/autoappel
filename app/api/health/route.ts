import { NextResponse } from 'next/server'
import { supabaseConfig } from '@/lib/supabase'

export async function GET() {
  const services = {
    status: 'operational',
    timestamp: new Date().toISOString(),
    services: {
      app: { status: 'ok' },
      database: supabaseConfig.configured ? { status: 'configured' } : { status: 'mock', message: 'Supabase env vars not set' },
      email: process.env.RESEND_API_KEY && !process.env.RESEND_API_KEY.startsWith('PASTE_') ? { status: 'configured' } : { status: 'mock' },
      sms: process.env.TWILIO_ACCOUNT_SID && !process.env.TWILIO_ACCOUNT_SID.startsWith('PASTE_') ? { status: 'configured' } : { status: 'mock' },
      hubspot: process.env.HUBSPOT_ACCESS_TOKEN && !process.env.HUBSPOT_ACCESS_TOKEN.startsWith('PASTE_') ? { status: 'configured' } : { status: 'mock' },
    },
  }

  return NextResponse.json({ success: true, data: services })
}
