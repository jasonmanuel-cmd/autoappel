export async function verifyTurnstile(token: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret || !token) return false
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret, response: token }), signal: AbortSignal.timeout(10000),
    })
    const data = await res.json()
    const expected = process.env.NEXT_PUBLIC_APP_URL
    return res.ok && data.success === true && !!expected && data.hostname === new URL(expected).hostname
  } catch { return false }
}
