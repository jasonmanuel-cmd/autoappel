import { NextResponse } from 'next/server'
import { serverStore } from '@/lib/server-store'

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const citation = serverStore.getCitation(params.id)
  if (!citation) {
    return NextResponse.json({ success: false, error: 'Citation not found' }, { status: 404 })
  }
  return NextResponse.json({ success: true, data: citation })
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { status, notes } = body

    if (!status || !['new', 'in_review', 'accepted', 'rejected', 'flagged'].includes(status)) {
      return NextResponse.json({ success: false, error: 'Invalid status value' }, { status: 400 })
    }

    const updated = serverStore.updateCitationStatus(params.id, status, notes)
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Citation not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: serverStore.getCitation(params.id) })
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request body' }, { status: 400 })
  }
}
