import AxeBuilder from '@axe-core/playwright'
import { test, expect } from '@playwright/test'
test.beforeEach(async ({page}) => {
  await page.emulateMedia({reducedMotion:'reduce'})
  await page.addInitScript(() => sessionStorage.setItem('splash-seen','true'))
  // Browser smoke tests are intentionally offline for external services.
  await page.route(/https:\/\/(?!127\.0\.0\.1)/,route => route.abort())
})
test('public pages render and fit desktop/mobile without horizontal scrolling', async ({page}) => {
  for (const path of ['/','/login','/contact','/faq','/privacy','/terms','/forgot-password']) {
    const response = await page.goto(path)
    expect(response?.status(),path).toBe(200)
    await expect(page.locator('h1').first()).toBeVisible()
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth+1),path).toBeTruthy()
  }
})
test('checkout failure does not claim payment success or retry indefinitely', async ({page}) => {
  let requests=0
  await page.route('**/api/citations/generate-strategy',route => { requests++; return route.fulfill({status:402,json:{error:'Payment has not been confirmed'}}) })
  await page.goto('/payment/success?citation_id=33333333-3333-4333-8333-333333333333&free=true&plan=Citation%20Appeal%20Service')
  await expect(page.getByRole('alert').filter({hasText:'Payment has not been confirmed'})).toHaveText('Payment has not been confirmed')
  await expect(page.getByRole('heading',{name:'Payment confirmed — strategy sent'})).toHaveCount(0)
  await page.waitForTimeout(500)
  expect(requests).toBe(1)
  await page.getByRole('button',{name:'Retry verification / delivery'}).click()
  await expect.poll(() => requests).toBe(2)
})
test('raw card collection is removed', async ({page,request}) => {
  await page.goto('/payment')
  await expect(page.getByRole('heading',{name:'Secure payments'})).toBeVisible()
  await expect(page.locator('input')).toHaveCount(0)
  expect((await request.post('/api/payment/process',{data:{cardNumber:'test'}})).status()).toBe(410)
})
test('missing configuration fails closed, not with public data or a server crash', async ({request}) => {
  expect((await request.get('/api/contact')).status()).toBe(503)
  expect((await request.get('/api/citations',{headers:{cookie:'demo_mode=true'}})).status()).toBe(503)
  expect((await request.get('/api/cron/reminders')).status()).toBe(503)
  expect((await request.get('/api/health')).status()).toBe(503)
  expect((await request.get('/admin/citations/private',{maxRedirects:0})).status()).toBe(307)
})

test('public forms have no serious WCAG A/AA accessibility violations', async ({page}) => {
  for (const path of ['/','/login','/contact','/forgot-password','/faq','/privacy','/terms']) {
    await page.goto(path)
    const results = await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa']).analyze()
    expect(results.violations.filter(v => ['serious','critical'].includes(v.impact || '')), JSON.stringify(results.violations.map(v => ({id:v.id,nodes:v.nodes.map(n=>n.target)})))).toEqual([])
  }
})
