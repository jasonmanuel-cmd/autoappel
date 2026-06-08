import { Resend } from 'resend'
import { citationVerificationEmail } from './email-templates'

function missing(key: string): boolean {
  const v = process.env[key]
  return !v || v.startsWith('PASTE_') || v === ''
}

function getClient(): Resend | null {
  if (missing('RESEND_API_KEY')) return null
  return new Resend(process.env.RESEND_API_KEY)
}

export async function sendEmail(to: string, subject: string, html: string) {
  const resend = getClient()
  if (!resend) {
    console.log(`[MOCK EMAIL] To: ${to} | Subject: ${subject}`)
    return { success: true, messageId: `mock_${crypto.randomUUID().slice(0, 8)}` }
  }

  const result = await resend.emails.send({
    from: process.env.EMAIL_FROM || 'info@lagnafnetwork.com',
    to,
    subject,
    html,
  })

  if (result.error) throw new Error(result.error.message)
  return { success: true, messageId: result.data?.id }
}

export async function sendConfirmationEmail(to: string, citationNumber: string) {
  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
      <h1 style="color:#E50000">AutoAppeal™ — Citation Received</h1>
      <p>Your citation <strong>${citationNumber}</strong> has been submitted successfully.</p>
      <p>Track your appeal status anytime at <a href="https://autoappeal.lagnafnetwork.com/track">autoappeal.lagnafnetwork.com/track</a></p>
      <hr style="border:none;border-top:1px solid #e2e8f0"/>
      <p style="color:#64748b;font-size:12px">LAGNAF™ network LLC — Houston Deployment</p>
    </div>`
  return sendEmail(to, `AutoAppeal™ — Citation ${citationNumber} Received`, html)
}

export async function sendDeadlineReminder(to: string, citationNumber: string, daysLeft: number, riskLevel: string) {
  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
      <h1 style="color:#E50000">AutoAppeal™ — Deadline Reminder</h1>
      <p>Citation <strong>${citationNumber}</strong> has <strong>${daysLeft} day${daysLeft !== 1 ? 's' : ''}</strong> remaining.</p>
      <p>Risk level: <strong style="color:${riskLevel === 'red' ? '#dc2626' : riskLevel === 'orange' ? '#ea580c' : '#ca8a04'}">${riskLevel.toUpperCase()}</strong></p>
      <hr style="border:none;border-top:1px solid #e2e8f0"/>
      <p style="color:#64748b;font-size:12px">LAGNAF™ network LLC — Houston Deployment</p>
    </div>`
  return sendEmail(to, `AutoAppeal™ — Deadline Alert: ${citationNumber}`, html)
}

export async function sendCitationVerificationEmail(data: { email: string; citationNumber: string; county: string; firstName: string; expectedFormat: string }) {
  const html = citationVerificationEmail({
    citationNumber: data.citationNumber,
    county: data.county,
    firstName: data.firstName,
    expectedFormat: data.expectedFormat,
    dashboardUrl: 'https://autoappel1.vercel.app/dashboard',
  })
  return sendEmail(data.email, 'Please Verify Your Citation Number', html)
}
