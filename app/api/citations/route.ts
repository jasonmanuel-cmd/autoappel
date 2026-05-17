import { NextResponse } from 'next/server'
import { serverStore } from '@/lib/server-store'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const required = ['firstName', 'lastName', 'email', 'citationNumber', 'county', 'violationType']
    const missing = required.filter(f => !body[f] || !String(body[f]).trim())
    if (missing.length > 0) {
      return NextResponse.json({ success: false, error: `Missing required fields: ${missing.join(', ')}` }, { status: 400 })
    }

    const entry = serverStore.addCitation(body)

    return NextResponse.json({
      success: true,
      data: { id: entry.id, status: entry.status, message: 'Citation submitted successfully.' },
    })
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request body' }, { status: 400 })
  }
}

export async function GET() {
  const stats = serverStore.getCitationStats()
  const citations = serverStore.getCitations()
  return NextResponse.json({ success: true, data: { stats, citations } })
}
