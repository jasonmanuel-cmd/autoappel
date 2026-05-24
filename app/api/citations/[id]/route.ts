import { NextResponse } from 'next/server'
import { serverStore } from '@/lib/server-store'

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const citation = await serverStore.getCitation(params.id)
  if (!citation) {
    return NextResponse.json({ success: false, error: 'Citation not found' }, { status: 404 })
  }
  return NextResponse.json({ success: true, data: citation })
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { status, notes } = body

    const valid = ['pending', 'in_review', 'accepted', 'rejected', 'flagged', 'expired', 'resolved']
    if (!status || !valid.includes(status)) {
      return NextResponse.json({ success: false, error: 'Invalid status value' }, { status: 400 })
    }

    const updated = await serverStore.updateCitationStatus(params.id, status, notes)
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Citation not found' }, { status: 404 })
    }

    const citation = await serverStore.getCitation(params.id)
    return NextResponse.json({ success: true, data: citation })
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request body' }, { status: 400 })
  }
}
