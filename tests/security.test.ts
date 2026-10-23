import { test } from 'node:test'
import assert from 'node:assert/strict'
import { NextRequest } from 'next/server'
import type { User } from '@supabase/supabase-js'
import { isAdmin, assertOwner, assertSameOrigin, ApiError } from '../lib/auth-server'
import { validProviderPayment, SERVICE_CENTS } from '../lib/payments'
import { validateCSRFToken, storeCSRFToken } from '../lib/csrf'
import { verifyTurnstile } from '../lib/turnstile'

test('only trusted app_metadata grants admin, never user_metadata', () => {
  assert.equal(isAdmin({ app_metadata: { role:'admin' } }),true)
  assert.equal(isAdmin({ app_metadata: {} }),false)
  const user = { id:'owner', app_metadata: {}, user_metadata:{role:'admin'}, aud:'authenticated', created_at:'2026-01-01' } as User
  assert.doesNotThrow(() => assertOwner(user,{user_id:'owner'}))
  assert.throws(() => assertOwner(user,{user_id:'other'}), (e: unknown) => e instanceof ApiError && e.status===404)
  assert.throws(() => assertOwner(user,null))
})
test('origin must match exactly, not a domain substring', () => {
  process.env.NEXT_PUBLIC_APP_URL = 'https://www.appealmytickets.com'
  const req = (origin: string) => new NextRequest('https://www.appealmytickets.com/api/payment/checkout', { headers:{origin} })
  assert.doesNotThrow(() => assertSameOrigin(req('https://www.appealmytickets.com')))
  for (const origin of ['https://autoappel.evil.test','https://www.appealmytickets.com.evil.test','http://www.appealmytickets.com']) assert.throws(() => assertSameOrigin(req(origin)))
})
test('only completed, exact-price, correct-order/location/currency, non-refunded Square payments qualify', () => {
  const payment = { status:'COMPLETED', order_id:'order',location_id:'location',amount_money:{amount:SERVICE_CENTS,currency:'USD'} }
  assert.equal(validProviderPayment(payment,'order','location'),true)
  for (const patch of [{status:'APPROVED'},{order_id:'other'},{location_id:'other'},{amount_money:{amount:1,currency:'USD'}},{amount_money:{amount:SERVICE_CENTS,currency:'CAD'}},{refunded_money:{amount:1}}]) {
    assert.equal(validProviderPayment({...payment,...patch},'order','location'),false)
  }
})
test('malformed CSRF token lengths fail without throwing', () => {
  storeCSRFToken('session','abcdef')
  assert.equal(validateCSRFToken('session','x'),false)
  assert.equal(validateCSRFToken('session','abcdef'),true)
})
test('Turnstile fails closed when secret is absent', async () => {
  delete process.env.TURNSTILE_SECRET_KEY
  assert.equal(await verifyTurnstile('untrusted'),false)
})

test('deadline urgency does not declare expiry three days early', async () => {
  const { computeRisk } = await import('../lib/deadlines')
  const now = Date.parse('2026-10-23T00:00:00Z')
  assert.equal(computeRisk('2026-10-24T00:00:00Z',now),'red')
  assert.equal(computeRisk('2026-10-22T00:00:00Z',now),'expired')
  assert.equal(computeRisk('',now),'yellow')
})
