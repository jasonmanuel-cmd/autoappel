import { test, expect } from '@playwright/test'

const BASE = 'https://AppealMyTickets.com'

test.use({ viewport: { width: 390, height: 844 } })

test('homepage loads', async ({ page }) => {
  await page.goto(BASE)
  await expect(page.locator('h1')).toBeVisible()
  await expect(page.locator('text=Powered by')).toBeVisible()
  const nav = page.locator('nav')
  await expect(nav).toBeVisible()
})

test('intake page loads (auth-gated, shows spinner)', async ({ page }) => {
  await page.goto(`${BASE}/intake`)
  const spinner = page.locator('.animate-spin')
  await expect(spinner).toBeVisible({ timeout: 10000 })
})

test('contact form loads', async ({ page }) => {
  await page.goto(`${BASE}/contact`)
  await expect(page.locator('h1')).toBeVisible()
  await expect(page.locator('text=Send us a Message')).toBeVisible()
  await expect(page.locator('button:has-text("Send Message")')).toBeVisible()
})

test('faq page loads', async ({ page }) => {
  await page.goto(`${BASE}/faq`)
  await expect(page.locator('h1')).toBeVisible()
})

test('payment service page loads (auth-gated)', async ({ page }) => {
  await page.goto(`${BASE}/payment/service`)
  const spinner = page.locator('.animate-spin')
  await expect(spinner).toBeVisible({ timeout: 10000 })
})

test('footer has powered by link', async ({ page }) => {
  await page.goto(BASE)
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await expect(page.locator('text=Powered by coaibakersfield.com')).toBeVisible()
  await expect(page.locator('a[href="https://coaibakersfield.com"]')).toBeVisible()
})

test('robots.txt has noindex paths', async ({ page }) => {
  const resp = await page.goto(`${BASE}/robots.txt`)
  const text = await resp?.text()
  expect(text).toContain('Disallow: /admin/')
  expect(text).toContain('Disallow: /dashboard/')
})

test('all public pages return 200', async ({ page }) => {
  const pages = ['/', '/faq', '/contact', '/terms', '/privacy', '/login', '/countdown']
  for (const p of pages) {
    const resp = await page.goto(`${BASE}${p}`)
    expect(resp?.status()).toBe(200)
  }
})
