import { NextResponse } from 'next/server'
import { serverStore } from '@/lib/server-store'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, subject, message } = body

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ success: false, error: 'All fields are required' }, { status: 400 })
    }

    if (!email.includes('@')) {
      return NextResponse.json({ success: false, error: 'Invalid email address' }, { status: 400 })
    }

    const entry = serverStore.addContact({ name, email, subject, message })

    return NextResponse.json({
      success: true,
      data: { id: entry.id, message: 'Message received. We will get back to you within 24 hours.' },
    })
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request body' }, { status: 400 })
  }
}

export async function GET() {
  const contacts = serverStore.getContacts()
  return NextResponse.json({ success: true, data: contacts })
}
