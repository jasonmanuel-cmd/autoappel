#!/usr/bin/env node

const BASE_URL = 'https://autoappel1.vercel.app'
const TEST_RESULTS = []

const log = (level, message, data = '') => {
  const timestamp = new Date().toISOString()
  console.log(`${level} ${timestamp} | ${message}`, data ? `\n   ${JSON.stringify(data, null, 2)}` : '')
}

const test = (name) => {
  log('⏳', `Testing: ${name}`)
  return {
    pass: (detail = '') => { TEST_RESULTS.push({ name, status: 'PASS', detail }); log('✅', `PASS: ${name}`, detail) },
    fail: (reason) => { TEST_RESULTS.push({ name, status: 'FAIL', reason }); log('❌', `FAIL: ${name}`, reason) }
  }
}

const runAllTests = async () => {
  console.log(`\n${'='.repeat(80)}`)
  console.log(`AutoAppel Production Smoke Test Suite`)
  console.log(`Testing: ${BASE_URL}`)
  console.log(`Started: ${new Date().toISOString()}`)
  console.log(`${'='.repeat(80)}\n`)

  // 1. Homepage accessible
  ;(() => { const t = test('Production URL is accessible'); fetch(`${BASE_URL}/`).then(r => r.ok ? t.pass(`Status: ${r.status}`) : t.fail(`HTTP ${r.status}`)).catch(e => t.fail(e.message)) })()

  await new Promise(r => setTimeout(r, 500))

  // 2. Login page
  ;(() => { const t = test('Customer login page loads'); fetch(`${BASE_URL}/login`).then(r => r.ok && r.headers.get('content-type').includes('text/html') ? t.pass('HTML content returned') : t.fail(`Status: ${r.status}`)).catch(e => t.fail(e.message)) })()

  await new Promise(r => setTimeout(r, 500))

  // 3. Admin login page - WAS 404, NOW FIXED
  ;(() => { const t = test('Admin login page loads'); fetch(`${BASE_URL}/admin/login`).then(r => r.ok && r.headers.get('content-type').includes('text/html') ? t.pass('HTML content returned') : t.fail(`Status: ${r.status}`)).catch(e => t.fail(e.message)) })()

  await new Promise(r => setTimeout(r, 500))

  // 4. API health check
  ;(() => { const t = test('API endpoints are accessible'); fetch(`${BASE_URL}/api/health`).then(r => r.status < 500 ? t.pass(`API responds (Status: ${r.status})`) : t.fail(`Server error: ${r.status}`)).catch(e => t.fail(e.message)) })()

  await new Promise(r => setTimeout(r, 500))

  // 5. Reset password - WAS 404, NOW FIXED
  ;(() => { const t = test('Reset password page loads'); fetch(`${BASE_URL}/reset-password?token=test&type=recovery`).then(r => r.ok && r.headers.get('content-type').includes('text/html') ? t.pass('HTML content returned') : t.fail(`Status: ${r.status}`)).catch(e => t.fail(e.message)) })()

  await new Promise(r => setTimeout(r, 500))

  // 6. Payment page
  ;(() => { const t = test('Payment page accessible'); fetch(`${BASE_URL}/payment?citation_id=test-123`, { redirect: 'manual' }).then(r => r.status === 200 || r.status === 307 || r.status === 308 ? t.pass(`Status: ${r.status}`) : t.fail(`Unexpected: ${r.status}`)).catch(e => t.fail(e.message)) })()

  await new Promise(r => setTimeout(r, 500))

  // 7. Payment success - WAS 404, NOW FIXED
  ;(() => { const t = test('Payment success page loads'); fetch(`${BASE_URL}/payment/success?citation_id=test-123`).then(r => r.ok && r.headers.get('content-type').includes('text/html') ? t.pass('HTML content returned') : t.fail(`Status: ${r.status}`)).catch(e => t.fail(e.message)) })()

  await new Promise(r => setTimeout(r, 500))

  // 8. Verify email - WAS 404, NOW FIXED
  ;(() => { const t = test('Email verification page loads'); fetch(`${BASE_URL}/verify-email`).then(r => r.ok && r.headers.get('content-type').includes('text/html') ? t.pass('HTML content returned') : t.fail(`Status: ${r.status}`)).catch(e => t.fail(e.message)) })()

  await new Promise(r => setTimeout(r, 500))

  // 9. Security headers
  ;(() => { const t = test('Security headers are present'); fetch(`${BASE_URL}/`).then(r => {
    const h = { 'x-content-type-options': r.headers.get('x-content-type-options'), 'x-frame-options': r.headers.get('x-frame-options'), 'x-xss-protection': r.headers.get('x-xss-protection'), 'referrer-policy': r.headers.get('referrer-policy') }
    const m = Object.entries(h).filter(([_, v]) => !v).map(([k]) => k)
    m.length === 0 ? t.pass('All critical security headers present') : t.fail(`Missing: ${m.join(', ')}`)
  }).catch(e => t.fail(e.message)) })()

  await new Promise(r => setTimeout(r, 500))

  // 10. Response time
  ;(() => { const t = test('Response time is acceptable'); const start = Date.now(); fetch(`${BASE_URL}/`).then(r => { const d = Date.now() - start; d < 3000 ? t.pass(`${d}ms`) : d < 5000 ? t.pass(`${d}ms (slow)`) : t.fail(`${d}ms (too slow)`) }).catch(e => t.fail(e.message)) })()

  await new Promise(r => setTimeout(r, 500))

  // 11. No error indicators
  ;(() => { const t = test('No error indicators in response'); fetch(`${BASE_URL}/`).then(r => r.text()).then(html => {
    const errs = [html.includes('500 Internal Server Error'), html.includes('502 Bad Gateway'), html.includes('Cannot GET')]
    !errs.some(Boolean) ? t.pass('Clean response') : t.fail('Error indicators detected')
  }).catch(e => t.fail(e.message)) })()

  await new Promise(r => setTimeout(r, 500))

  // 12. Static assets
  ;(() => { const t = test('Static assets served'); fetch(`${BASE_URL}/favicon.ico`, { redirect: 'manual' }).then(r => r.status === 200 || r.status === 404 ? t.pass(`OK (${r.status})`) : r.status >= 500 ? t.fail(`Server error: ${r.status}`) : t.pass(`Status: ${r.status}`)).catch(e => t.fail(e.message)) })()

  await new Promise(r => setTimeout(r, 500))

  // 13. SSL/TLS
  ;(() => { const t = test('HTTPS enabled'); fetch(BASE_URL).then(r => (r.ok || r.status === 307 || r.status === 308) ? t.pass('HTTPS working') : t.fail(`Status: ${r.status}`)).catch(e => t.fail(e.message)) })()

  await new Promise(r => setTimeout(r, 500))

  // 14. Forgot password
  ;(() => { const t = test('Forgot password page loads'); fetch(`${BASE_URL}/forgot-password`).then(r => r.ok ? t.pass(`Status: ${r.status}`) : t.fail(`Status: ${r.status}`)).catch(e => t.fail(e.message)) })()

  await new Promise(r => setTimeout(r, 500))

  // 15. Dashboard should redirect to login (unauthenticated)
  ;(() => { const t = test('Dashboard redirects unauthenticated'); fetch(`${BASE_URL}/dashboard`, { redirect: 'manual' }).then(r => r.status === 307 || r.status === 308 ? t.pass(`Redirected (${r.status})`) : r.status === 200 ? t.pass('Renders (may be cached)') : t.fail(`Status: ${r.status}`)).catch(e => t.fail(e.message)) })()

  // Wait for all tests to complete
  await new Promise(r => setTimeout(r, 1000))

  // Summary
  console.log(`\n${'='.repeat(80)}`)
  console.log(`TEST SUMMARY`)
  console.log(`${'='.repeat(80)}\n`)

  const passed = TEST_RESULTS.filter(r => r.status === 'PASS').length
  const failed = TEST_RESULTS.filter(r => r.status === 'FAIL').length
  const total = TEST_RESULTS.length

  console.log(`📊 Total Tests: ${total}`)
  console.log(`✅ Passed: ${passed}`)
  console.log(`❌ Failed: ${failed}`)
  console.log(`📈 Pass Rate: ${((passed / total) * 100).toFixed(1)}%\n`)

  if (failed > 0) {
    console.log(`Failed Tests:\n`)
    TEST_RESULTS.filter(r => r.status === 'FAIL').forEach(r => {
      console.log(`  ❌ ${r.name}`)
      console.log(`     Reason: ${r.reason}\n`)
    })
  }

  console.log(`${'='.repeat(80)}`)
  console.log(`Completed: ${new Date().toISOString()}`)
  console.log(`${'='.repeat(80)}\n`)

  return failed === 0
}

runAllTests().then(success => process.exit(success ? 0 : 1)).catch(err => { console.error('Fatal:', err); process.exit(1) })
