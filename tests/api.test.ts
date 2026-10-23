import { createHmac } from 'node:crypto'
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { NextRequest } from 'next/server'
import { GET as listCitations, POST as createCitation } from '../app/api/citations/route'
import { GET as contactList } from '../app/api/contact/route'
import { GET as detail, PATCH as updateCitation } from '../app/api/citations/[id]/route'
import { POST as checkout } from '../app/api/payment/checkout/route'
import { POST as generate } from '../app/api/citations/generate-strategy/route'
import { POST as rawCard } from '../app/api/payment/process/route'
import { GET as reminders } from '../app/api/cron/reminders/route'
import { POST as webhook } from '../app/api/payment/webhook/route'

const userId = '11111111-1111-4111-8111-111111111111'
const citationId = '33333333-3333-4333-8333-333333333333'
const otherId = '22222222-2222-4222-8222-222222222222'
const jwt = ['e30',Buffer.from(JSON.stringify({sub:userId,exp:Math.floor(Date.now()/1000)+3600})).toString('base64url'),'test-signature'].join('.')
function request(path: string, body?: unknown, cookie = true) {
  const headers: Record<string,string> = { origin:'https://www.appealmytickets.com', 'x-forwarded-for':crypto.randomUUID() }
  if (cookie) headers.cookie = 'sb-project-auth-token=base64-'+Buffer.from(JSON.stringify({ access_token:jwt,refresh_token:'test-refresh',expires_at:Math.floor(Date.now()/1000)+3600,token_type:'bearer' })).toString('base64url')
  if (body) headers['content-type']='application/json'
  return new NextRequest(`https://www.appealmytickets.com${path}`,{ method:body?'POST':'GET',headers,...(body?{body:JSON.stringify(body)}:{}) })
}
test('API authorization and payment regressions (all providers mocked, no live credentials)', async () => {
  Object.assign(process.env,{ NEXT_PUBLIC_APP_URL:'https://www.appealmytickets.com',NEXT_PUBLIC_SUPABASE_URL:'https://project.supabase.test',NEXT_PUBLIC_SUPABASE_ANON_KEY:'test-anon',SUPABASE_SERVICE_ROLE_KEY:'test-service',SQUARE_ENV:'sandbox',SQUARE_ACCESS_TOKEN:'test-square',SQUARE_LOCATION_ID:'test-location',SQUARE_WEBHOOK_SIGNATURE_KEY:'test-key',SQUARE_WEBHOOK_URL:'https://www.appealmytickets.com/api/payment/webhook' })
  let owner = userId
  const called: string[] = []
  let squareBody: any
  let confirmedMode=false, fulfillment='pending', strategyEmails=0
  Object.assign(process.env,{RESEND_API_KEY:'re_test_only',TURNSTILE_SECRET_KEY:'test-turnstile'})
  const realFetch = global.fetch
  global.fetch = async (input, options) => {
    const url = new URL(typeof input === 'string' ? input : input instanceof URL ? input.href : input.url)
    called.push(url.href)
    const response = (data: unknown) => new Response(JSON.stringify(data),{status:200,headers:{'content-type':'application/json'}})
    if (url.pathname === '/auth/v1/user') return response({id:userId,email:'one@example.com',aud:'authenticated',created_at:'2026-01-01',email_confirmed_at:'2026-01-01',app_metadata:{},user_metadata:{role:'admin'}})
    if (url.hostname === 'challenges.cloudflare.com') return response({success:true,hostname:'www.appealmytickets.com'})
    if (url.hostname === 'api.resend.com') {
      const email = JSON.parse(String(options?.body))
      if (email.attachments) { strategyEmails++; assert.ok(email.attachments[0].content.startsWith('JVBER')) }
      return response({id:'test-message'})
    }
    if (url.pathname === '/rest/v1/citations') {
      if (options?.method === 'POST') {
        const inserted = JSON.parse(String(options.body))
        assert.equal(inserted.user_id,userId); assert.equal(inserted.service_fee_status,'unpaid')
        return response({id:citationId,status:'pending'})
      }
      if (url.searchParams.has('id')) return response({id:citationId,user_id:owner,email:'one@example.com',first_name:'Test',last_name:'User',citation_number:'TEST123'})
      assert.equal(url.searchParams.get('user_id'),`eq.${userId}`)
      return response([{id:citationId,user_id:userId}])
    }
    if (url.pathname === '/rest/v1/rpc/reserve_service_checkout') return response('payment-attempt')
    if (url.pathname === '/rest/v1/service_payments') {
      if (options?.method === 'PATCH') {
        const change = JSON.parse(String(options.body))
        if (change.fulfillment==='sending') { if (fulfillment!=='pending') return response(null); fulfillment='sending'; return response({id:'payment-attempt'}) }
        if (change.fulfillment) fulfillment=change.fulfillment
        return response(null)
      }
      if (url.searchParams.has('provider_order_id')) return response({citation_id:citationId})
      if (url.searchParams.has('citation_id')) return response(confirmedMode ? [{id:'payment-attempt',provider_order_id:'provider-order',amount_cents:7999,state:'pending',fulfillment}] : []) // no verified payment
      return response({id:'payment-attempt',state:'pending',amount_cents:7999})
    }
    if (url.pathname === '/rest/v1/rpc/confirm_service_payment') return response(null)
    if (url.pathname === '/v2/orders/provider-order') return response({order:{state:'COMPLETED',location_id:'test-location',tenders:[{payment_id:'provider-payment'}]}})
    if (url.pathname === '/v2/payments/provider-payment') return response({payment:{id:'provider-payment',status:'COMPLETED',order_id:'provider-order',location_id:'test-location',amount_money:{amount:7999,currency:'USD'}}})
    if (url.pathname === '/v2/online-checkout/payment-links') {
      squareBody = JSON.parse(String(options?.body))
      return response({ payment_link:{url:'https://square.test/checkout',order_id:'provider-order'} })
    }
    throw new Error(`Unexpected external request: ${url}`)
  }
  try {
    const created = await createCitation(request('/api/citations',{ firstName:'Test',lastName:'User',email:'one@example.com',citationNumber:'TEST123',county:'Harris',violationType:'Speeding',turnstileToken:'token',service_fee_status:'paid' }))
    assert.equal(created.status,201,await created.clone().text())
    assert.equal((await created.json()).data.id,citationId)
    assert.equal((await contactList(request('/api/contact'))).status,403)
    assert.equal((await listCitations(request('/api/citations',undefined,false))).status,401)
    const forgedDemo = request('/api/citations',undefined,false)
    forgedDemo.cookies.set('demo_mode','true')
    assert.equal((await listCitations(forgedDemo)).status,401)
    assert.equal((await listCitations(request('/api/citations'))).status,200)
    owner=otherId
    assert.equal((await detail(request(`/api/citations/${citationId}`),{params:Promise.resolve({id:citationId})})).status,404)
    const patch = request(`/api/citations/${citationId}`,{status:'resolved'})
    assert.equal((await updateCitation(new NextRequest(patch.url,{method:'PATCH',headers:patch.headers,body:JSON.stringify({status:'resolved'})}),{params:Promise.resolve({id:citationId})})).status,403)
    assert.equal((await checkout(request('/api/payment/checkout',{citation_id:citationId,plan:'Citation Appeal Service',amount:1}))).status,404)
    owner=userId
    assert.equal((await generate(request('/api/citations/generate-strategy',{citationId}))).status,402)
    const result = await checkout(request('/api/payment/checkout',{citation_id:citationId,plan:'Citation Appeal Service',amount:1}))
    assert.equal(result.status,200,await result.text())
    assert.equal(squareBody.quick_pay.price_money.amount,7999)
    assert.equal(squareBody.idempotency_key,'payment-attempt')
    confirmedMode=true
    assert.equal((await generate(request('/api/citations/generate-strategy',{citationId}))).status,200)
    assert.equal(fulfillment,'sent')
    assert.equal(strategyEmails,1)
    assert.equal((await generate(request('/api/citations/generate-strategy',{citationId}))).status,200)
    assert.equal(strategyEmails,1)
    assert.equal((await rawCard()).status,410)
    delete process.env.CRON_SECRET
    assert.equal((await reminders(request('/api/cron/reminders',undefined,false))).status,503)
    process.env.CRON_SECRET='test-secret'
    assert.equal((await reminders(request('/api/cron/reminders',undefined,false))).status,401)
    Object.assign(process.env,{SQUARE_WEBHOOK_SIGNATURE_KEY:'test-key',SQUARE_WEBHOOK_URL:'https://www.appealmytickets.com/api/payment/webhook'})
    assert.equal((await webhook(request('/api/payment/webhook',{type:'payment.updated'},false))).status,401)
    const eventBody=JSON.stringify({type:'payment.updated',data:{object:{payment:{order_id:'provider-order',status:'COMPLETED'}}}})
    const signature=createHmac('sha256','test-key').update(process.env.SQUARE_WEBHOOK_URL+eventBody).digest('base64')
    const signed = new NextRequest('https://www.appealmytickets.com/api/payment/webhook',{method:'POST',body:eventBody,headers:{'x-square-hmacsha256-signature':signature}})
    assert.equal((await webhook(signed)).status,200)
    assert.equal(strategyEmails,1)
    assert.ok(called.some(url => url.includes('/auth/v1/user')))
  } finally { global.fetch=realFetch }
})
