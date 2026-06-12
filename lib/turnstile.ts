const SECRET_KEY = '0x4AAAAAADi_eNKdzmBTss7GGKJ0MJ8chDY'

export async function verifyTurnstile(token: string): Promise<boolean> {
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret: SECRET_KEY, response: token }),
    })
    const data = await res.json()
    return data.success === true
  } catch {
    return false
  }
}
