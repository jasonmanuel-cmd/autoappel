import { Resend } from 'resend'
import { getEmailTemplate } from './email-templates'

const resend = new Resend(process.env.RESEND_API_KEY)

export type EmailType =
  | 'welcome'
  | 'verification'
  | 'password_reset'
  | 'deadline_alert'
  | 'submission_received'
  | 'submission_approved'
  | 'payment_received'
  | 'appeal_decision'

interface EmailData {
  to: string
  firstName: string
  [key: string]: any
}

export async function sendEmail(type: EmailType, data: EmailData): Promise<boolean> {
  try {
    const template = getEmailTemplate(type)
    if (!template) {
      console.error(`Email template not found for type: ${type}`)
      return false
    }

    // Generate HTML content from template
    const html = template.generate(data)

    const result = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'noreply@appealmytickets.com',
      to: data.to,
      subject: template.subject,
      html,
    })

    if (result.error) {
      console.error(`Error sending ${type} email:`, result.error)
      return false
    }

    console.log(`Email sent successfully: ${type} to ${data.to}`)
    return true
  } catch (error) {
    console.error(`Exception sending ${type} email:`, error)
    return false
  }
}

export async function sendWelcomeEmail(email: string, firstName: string): Promise<boolean> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://autoappel1.vercel.app'
  return sendEmail('welcome', {
    to: email,
    firstName,
    fullName: firstName,
    dashboardUrl: `${appUrl}/dashboard`,
    faqUrl: `${appUrl}/faq`,
    contactUrl: `${appUrl}/contact`,
  })
}

export async function sendVerificationEmail(email: string, firstName: string, verificationUrl: string): Promise<boolean> {
  return sendEmail('verification', { to: email, firstName, verificationUrl })
}

export async function sendPasswordResetEmail(email: string, firstName: string, resetUrl: string): Promise<boolean> {
  return sendEmail('password_reset', { to: email, firstName, resetUrl })
}

export async function sendDeadlineAlertEmail(
  email: string,
  firstName: string,
  citationNumber: string,
  deadline: string,
  daysRemaining: number
): Promise<boolean> {
  return sendEmail('deadline_alert', {
    to: email,
    firstName,
    citationNumber,
    deadline,
    daysRemaining,
  })
}

export async function sendSubmissionReceivedEmail(
  email: string,
  firstName: string,
  citationNumber: string,
  submissionType: string
): Promise<boolean> {
  return sendEmail('submission_received', {
    to: email,
    firstName,
    citationNumber,
    submissionType,
  })
}

export async function sendSubmissionApprovedEmail(
  email: string,
  firstName: string,
  citationNumber: string,
  submissionType: string,
  details: string
): Promise<boolean> {
  return sendEmail('submission_approved', {
    to: email,
    firstName,
    citationNumber,
    submissionType,
    details,
  })
}

export async function sendPaymentReceivedEmail(
  email: string,
  firstName: string,
  citationNumber: string,
  amount: number
): Promise<boolean> {
  return sendEmail('payment_received', {
    to: email,
    firstName,
    citationNumber,
    amount: (amount / 100).toFixed(2),
  })
}

export async function sendAppealDecisionEmail(
  email: string,
  firstName: string,
  citationNumber: string,
  decision: 'approved' | 'denied',
  details: string
): Promise<boolean> {
  return sendEmail('appeal_decision', {
    to: email,
    firstName,
    citationNumber,
    decision,
    details,
  })
}
