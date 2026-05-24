function missing(key: string): boolean {
  const v = process.env[key]
  return !v || v.startsWith('PASTE_') || v === ''
}

function isConfigured(): boolean {
  return !missing('TWILIO_ACCOUNT_SID') && !missing('TWILIO_AUTH_TOKEN') && !missing('TWILIO_PHONE_NUMBER')
}

// Dynamic import since twilio has no default export issues with Next.js
async function getClient(): Promise<{ messages: { create: (opts: { body: string; to: string; from: string }) => Promise<{ sid: string }> } } | null> {
  if (!isConfigured()) return null
  const twilio = await import('twilio')
  const client = twilio.default(process.env.TWILIO_ACCOUNT_SID!, process.env.TWILIO_AUTH_TOKEN!)
  return client
}

export async function sendSms(to: string, body: string) {
  const client = await getClient()
  if (!client) {
    console.log(`[MOCK SMS] To: ${to} | Body: ${body}`)
    return { success: true, sid: `mock_${crypto.randomUUID().slice(0, 8)}` }
  }

  const result = await client.messages.create({
    body,
    to,
    from: process.env.TWILIO_PHONE_NUMBER!,
  })

  return { success: true, sid: result.sid }
}

export async function sendDeadlineAlert(to: string, citationNumber: string, daysLeft: number) {
  const body = `AutoAppeal™ Alert: Citation ${citationNumber} has ${daysLeft} day${daysLeft !== 1 ? 's' : ''} remaining. Act now. -LAGNAF™`
  return sendSms(to, body)
}
