import { NextRequest, NextResponse } from 'next/server'
import { serverStore } from '@/lib/server-store'
import { generateStrategyPDFAndSend } from '@/lib/pdf-generator'

export async function POST(request: NextRequest) {
  try {
    const { citationId } = await request.json()

    if (!citationId) {
      return NextResponse.json({ error: 'citationId required' }, { status: 400 })
    }

    const citation = await serverStore.getCitation(citationId)
    if (!citation) {
      return NextResponse.json({ error: 'Citation not found' }, { status: 404 })
    }

    const result = await generateStrategyPDFAndSend({
      firstName: citation.first_name,
      lastName: citation.last_name,
      citationNumber: citation.citation_number,
      violationType: citation.violation_type || 'N/A',
      county: citation.county || 'N/A',
      court: citation.court || 'N/A',
      jurisdiction: citation.jurisdiction || 'N/A',
      responseDeadline: citation.response_deadline || 'N/A',
      citationDate: citation.citation_date || 'N/A',
      email: citation.email,
    })

    if (result.success) {
      await serverStore.updateCitationPayment(citationId, 'paid')
      await serverStore.updateCitationStatus(citationId, 'in_review', 'Strategy document generated and sent')
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Strategy generation error:', error)
    return NextResponse.json({ success: false, error: 'Strategy generation failed' }, { status: 500 })
  }
}
