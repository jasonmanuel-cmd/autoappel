import twilio from 'twilio'

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
)

const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER || '+1234567890'

export type SMSType = 'deadline_alert_48h' | 'payment_received' | 'submission_decision'

interface SMSData {
  to: string
  [key: string]: any
}

function generateSMSContent(type: SMSType, data: SMSData): string {
  switch (type) {
    case 'deadline_alert_48h':
      return `AutoAppel: URGENT - Only 48 hours left to respond to citation ${data.citationNumber}. Deadline: ${data.deadline}. Visit your dashboard to take action.`

    case 'payment_received':
      return `AutoAppel: Payment received for citation ${data.citationNumber}. Amount: $${data.amount}. Your citation is now resolved. Thank you!`

    case 'submission_decision':
      return `AutoAppel: Your ${data.submissionType} for citation ${data.citationNumber} has been ${data.decision}. Check your email for details.`

    default:
      return ''
  }
}

export async function sendSMS(type: SMSType, data: SMSData): Promise<boolean> {
  try {
    const body = generateSMSContent(type, data)

    if (!body) {
      console.error(`SMS template not found for type: ${type}`)
      return false
    }

    const result = await twilioClient.messages.create({
      from: twilioPhoneNumber,
      to: data.to,
      body,
    })

    console.log(`SMS sent successfully: ${type} to ${data.to} (SID: ${result.sid})`)
    return true
  } catch (error) {
    console.error(`Exception sending ${type} SMS:`, error)
    return false
  }
}

export async function sendDeadlineAlert48hSMS(
  phoneNumber: string,
  citationNumber: string,
  deadline: string
): Promise<boolean> {
  return sendSMS('deadline_alert_48h', { to: phoneNumber, citationNumber, deadline })
}

export async function sendPaymentReceivedSMS(
  phoneNumber: string,
  citationNumber: string,
  amount: number
): Promise<boolean> {
  return sendSMS('payment_received', {
    to: phoneNumber,
    citationNumber,
    amount: (amount / 100).toFixed(2),
  })
}

export async function sendSubmissionDecisionSMS(
  phoneNumber: string,
  citationNumber: string,
  submissionType: string,
  decision: 'approved' | 'denied'
): Promise<boolean> {
  return sendSMS('submission_decision', {
    to: phoneNumber,
    citationNumber,
    submissionType,
    decision,
  })
}
