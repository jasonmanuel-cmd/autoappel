import { NextResponse } from 'next/server'
export async function POST() {
  return NextResponse.json({ error: 'Direct card processing is disabled. Use secure hosted checkout.' }, { status: 410 })
}
