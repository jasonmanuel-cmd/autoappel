import { NextResponse } from 'next/server'
import { pushLeadToHubSpot } from '@/lib/hubspot'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const result = await pushLeadToHubSpot(body)
    return NextResponse.json({ success: true, data: result })
  } catch (err) {
    return NextResponse.json({ success: false, error: err instanceof Error ? err.message : 'HubSpot integration failed' }, { status: 500 })
  }
}
