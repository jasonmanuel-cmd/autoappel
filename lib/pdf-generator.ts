import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

interface StrategyData {
  firstName: string
  lastName: string
  email: string
  citationNumber: string
  violationType: string
  county: string
  court: string
  jurisdiction: string
  responseDeadline: string
  citationDate: string
}

const RED = rgb(0.898, 0, 0)
const WHITE = rgb(1, 1, 1)
const BLACK = rgb(0, 0, 0)
const DARK = rgb(0.15, 0.15, 0.15)
const MEDIUM = rgb(0.35, 0.35, 0.35)
const LIGHT_BG = rgb(0.97, 0.97, 0.97)
const TABLE_BORDER = rgb(0.85, 0.85, 0.85)

function formatDate(d: string): string {
  if (!d) return 'N/A'
  try {
    return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  } catch {
    return d
  }
}

function drawHeader(page: any, fontBold: any, font: any, width: number, title: string) {
  page.drawRectangle({ x: 0, y: 750, width, height: 42, color: RED })
  page.drawText('AppealMyTickets.com', { x: 40, y: 760, size: 14, font: fontBold, color: WHITE })
  page.drawText(title, { x: width - 40, y: 760, size: 10, font: font, color: WHITE, xAlignment: 1 })
}

function drawFooter(page: any, font: any, width: number, pageNum: number, totalPages: number) {
  page.drawLine({ start: { x: 40, y: 40 }, end: { x: width - 40, y: 40 }, thickness: 0.5, color: rgb(0.8, 0.8, 0.8) })
  page.drawText(`Page ${pageNum} of ${totalPages}`, { x: width - 40, y: 28, size: 8, font, color: MEDIUM, xAlignment: 1 })
  page.drawText('AppealMyTickets.com — Appeal Strategy Document', { x: 40, y: 28, size: 8, font, color: MEDIUM })
}

export async function generateAppealStrategyPDF(data: StrategyData): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create()
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  const totalPages = 2

  for (let pg = 0; pg < totalPages; pg++) {
    const page = pdfDoc.addPage([612, 792])
    const { width, height } = page.getSize()
    let y = height - 80

    drawHeader(page, fontBold, font, width, 'Appeal Strategy Document')

    const section = (title: string) => {
      y -= 10
      page.drawRectangle({ x: 40, y: y - 2, width: width - 80, height: 22, color: RED })
      page.drawText(title, { x: 50, y: y + 3, size: 11, font: fontBold, color: WHITE })
      y -= 34
    }

    const line = (label: string, value: string, mono = false) => {
      page.drawText(label, { x: 50, y, size: 9, font: fontBold, color: DARK })
      page.drawText(value || '—', { x: 180, y, size: 9, font: mono ? font : font, color: DARK })
      y -= 16
    }

    const body = (text: string, indent = 50, size = 9, bold = false) => {
      const f = bold ? fontBold : font
      const words = text.split(' ')
      let lineText = ''
      let lineWidth = 0
      for (const w of words) {
        const ww = f.widthOfTextAtSize((lineText ? lineText + ' ' : '') + w, size)
        if (ww > width - indent - 40) {
          page.drawText(lineText, { x: indent, y, size, font: f, color: DARK })
          y -= 14
          lineText = w
        } else {
          lineText = lineText ? lineText + ' ' + w : w
        }
      }
      if (lineText) {
        page.drawText(lineText, { x: indent, y, size, font: f, color: DARK })
        y -= 16
      }
    }

    const bullet = (text: string, indent = 50) => {
      const bullX = indent
      page.drawText('•', { x: bullX, y, size: 9, font: fontBold, color: RED })
      const words = text.split(' ')
      let lineText = ''
      let lineWidth = 0
      const maxW = width - indent - 20
      for (const w of words) {
        const ww = font.widthOfTextAtSize((lineText ? lineText + ' ' : '') + w, 9)
        if (ww > maxW) {
          page.drawText(lineText, { x: indent + 10, y, size: 9, font, color: DARK })
          y -= 14
          lineText = w
        } else {
          lineText = lineText ? lineText + ' ' + w : w
        }
      }
      if (lineText) {
        page.drawText(lineText, { x: indent + 10, y, size: 9, font, color: DARK })
        y -= 16
      }
    }

    if (pg === 0) {
      section('PREPARED FOR')
      line('Name:', `${data.firstName} ${data.lastName}`)
      line('Citation #:', data.citationNumber, true)
      line('Violation:', data.violationType)
      line('County:', `${data.county}, TX`)
      line('Court:', data.court)
      line('Citation Date:', formatDate(data.citationDate))
      line('Response Deadline:', formatDate(data.responseDeadline))

      y -= 6
      page.drawRectangle({ x: 40, y: y - 4, width: width - 80, height: 0.5, color: TABLE_BORDER })
      y -= 14

      section('YOUR APPEAL STRATEGY')

      body('This document provides step-by-step guidance to help you prepare and submit your own traffic citation appeal. Follow each step carefully.', 50, 9)

      body('Step 1: Draft Your Appeal Letter', 50, 10, true)
      body('Write a formal appeal letter addressed to the court identified above. Your letter should include:', 50, 9)
      bullet('Your full name, address, and phone number')
      bullet('The citation number and violation date')
      bullet('A clear statement that you are requesting a hearing to contest the citation')
      bullet('Your reasons for contesting the citation (e.g., factual disagreement, mitigating circumstances)')
      bullet('Any evidence or arguments you plan to present')
      y -= 2

      body('Step 2: Gather Supporting Documents', 50, 10, true)
      body('Collect any documents that support your case:', 50, 9)
      bullet('Photos of the location/scene (if relevant to your defense)')
      bullet('Witness statements (if applicable)')
      bullet('Maintenance records (for equipment-related citations)')
      bullet('Proof of corrections (if citation was for a correctable violation)')
      bullet('Any other relevant documentation')
      y -= 2

      body('Step 3: File Your Appeal', 50, 10, true)
      body('Submit your appeal letter and supporting documents to the court before the deadline. Most courts accept filings:', 50, 9)
      bullet('In person at the courthouse during business hours')
      bullet('By mail (allow extra time for delivery)')
      bullet('Online via the court\'s e-filing system (if available)')
    }

    if (pg === 1) {
      section('COURT INFORMATION')
      body(`Court: ${data.court}`, 50, 9)
      body(`Jurisdiction: ${data.jurisdiction}`, 50, 9)
      body(`County: ${data.county}, TX`, 50, 9)
      body('Contact your court directly for specific filing instructions, acceptable payment methods, and scheduled hearing dates.', 50, 9)
      y -= 4

      section('IMPORTANT DEADLINES')
      body(`Your citation must be addressed by ${formatDate(data.responseDeadline)}. Missing this deadline may result in additional fines, late fees, and potential license suspension.`, 50, 9)
      body('We strongly recommend submitting your appeal at least 5-7 business days before the deadline to allow for processing time.', 50, 9)
      y -= 4

      section('NEXT STEPS')
      body('After submitting your appeal:', 50, 9)
      bullet('The court will schedule a hearing date and notify you by mail')
      bullet('Prepare for your hearing by organizing your evidence and practicing your statement')
      bullet('Arrive at least 15 minutes early on your hearing date')
      bullet('Dress professionally and be respectful to the court')
      y -= 2

      section('ADDITIONAL RESOURCES')
      body('For additional help:', 50, 9)
      bullet('Visit our FAQ: https://autoappel1.vercel.app/faq')
      bullet('Contact support: https://autoappel1.vercel.app/contact')
      bullet('Email us: info@lagnafnetwork.com')
      bullet('Call us: (949) 350-8804')

      y = 110
      page.drawRectangle({ x: 40, y, width: width - 80, height: 90, color: LIGHT_BG })
      page.drawRectangle({ x: 40, y: y + 68, width: width - 80, height: 22, color: RED })
      page.drawText('IMPORTANT NOTICE', { x: 50, y: y + 73, size: 10, font: fontBold, color: WHITE })
      body('AppealMyTickets.com is an appeal assistance platform. We are not a law firm, and we do not provide legal representation or legal advice. This document is a guide to help you prepare your own appeal submission. If you need legal advice, please consult a licensed attorney.', 50, 8)
      body('The information provided in this document is based on the citation data you submitted and general court procedures. Court rules and procedures vary by jurisdiction. Always verify specific requirements with your court.', 50, 8)

      drawFooter(page, font, width, pg + 1, totalPages)
      continue
    }

    drawFooter(page, font, width, pg + 1, totalPages)
  }

  const pdfBytes = await pdfDoc.save()
  return Buffer.from(pdfBytes)
}

export async function generateStrategyPDFAndSend(data: StrategyData): Promise<{ success: boolean; error?: string }> {
  try {
    const pdfBuffer = await generateAppealStrategyPDF(data)

    const resendModule = await import('resend')
    const resendKey = process.env.RESEND_API_KEY
    if (!resendKey || resendKey.startsWith('PASTE_')) {
      console.log(`[MOCK EMAIL + PDF] Strategy document for ${data.firstName} ${data.lastName} (${data.citationNumber})`)
      return { success: true }
    }

    const resend = new resendModule.Resend(resendKey)
    const emailFrom = process.env.EMAIL_FROM || 'info@lagnafnetwork.com'

    const html = `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <h1 style="color:#E50000">Your Appeal Strategy Document is Ready</h1>
        <p>Hi ${data.firstName},</p>
        <p>Your appeal strategy document for citation <strong>${data.citationNumber}</strong> is attached to this email.</p>
        <h2>What's Inside</h2>
        <ul>
          <li>Step-by-step instructions for filing your appeal</li>
          <li>Court information and contact details</li>
          <li>Important deadlines and next steps</li>
          <li>Guidance on gathering supporting documents</li>
        </ul>
        <h2>Important Reminder</h2>
        <p>Your deadline is <strong>${formatDate(data.responseDeadline)}</strong>. Please submit your appeal before this date.</p>
        <p>Track your appeal status: <a href="https://autoappel1.vercel.app/dashboard">Visit Dashboard</a></p>
        <hr style="border:none;border-top:1px solid #e2e8f0"/>
        <p style="color:#64748b;font-size:12px">AppealMyTickets.com is an appeal assistance platform. We are not a law firm and do not provide legal representation or legal advice.</p>
      </div>`

    const result = await resend.emails.send({
      from: emailFrom,
      to: data.email,
      subject: `Your Appeal Strategy Document — Citation ${data.citationNumber}`,
      html,
      attachments: [
        {
          filename: `AppealMyTickets_Strategy_${data.citationNumber.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`,
          content: pdfBuffer,
        },
      ],
    })

    if (result.error) {
      console.error('Strategy email error:', result.error)
      return { success: false, error: result.error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('Strategy PDF generation error:', error)
    return { success: false, error: error instanceof Error ? error.message : 'PDF generation failed' }
  }
}
