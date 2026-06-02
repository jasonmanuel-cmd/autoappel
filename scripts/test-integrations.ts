#!/usr/bin/env node

/**
 * Quick Integration Test Script
 * Tests all 4 APIs without needing to submit the form
 * 
 * Usage: npx ts-node scripts/test-integrations.ts
 */

import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000';

interface TestResult {
  name: string;
  status: 'pass' | 'fail';
  message: string;
}

const results: TestResult[] = [];

async function test(name: string, fn: () => Promise<boolean>) {
  try {
    const passed = await fn();
    results.push({
      name,
      status: passed ? 'pass' : 'fail',
      message: passed ? '✅' : '❌'
    });
  } catch (err) {
    results.push({
      name,
      status: 'fail',
      message: `❌ ${err instanceof Error ? err.message : 'Unknown error'}`
    });
  }
}

async function runTests() {
  console.log('🧪 AutoAppeal™ Integration Tests\n');
  console.log(`Testing: ${BASE_URL}\n`);

  // Test 1: Health Check
  await test('Server Running', async () => {
    const res = await fetch(`${BASE_URL}/`, { method: 'GET' });
    return res.status === 200;
  });

  // Test 2: Supabase Connection
  await test('Supabase Connected', async () => {
    const res = await fetch(`${BASE_URL}/api/auth/verify`, { method: 'GET' });
    return res.status === 200;
  });

  // Test 3: HubSpot API
  await test('HubSpot API Access', async () => {
    const res = await fetch(`${BASE_URL}/api/hubspot/deals`, { method: 'GET' });
    return res.status === 200;
  });

  // Test 4: Environment Variables
  await test('All Env Vars Configured', async () => {
    const res = await fetch(`${BASE_URL}/api/auth/verify`, { method: 'GET' });
    const text = await res.text();
    return !text.includes('undefined') && res.status === 200;
  });

  // Test 5: Database Tables
  await test('Database Tables Initialized', async () => {
    const res = await fetch(`${BASE_URL}/api/submissions?limit=1`, { method: 'GET' });
    return res.status === 200 || res.status === 401; // 401 if not logged in is OK
  });

  // Print Results
  console.log('\n📊 Test Results:\n');
  console.log('┌─────────────────────────────────┬────────┐');
  console.log('│ Test                            │ Status │');
  console.log('├─────────────────────────────────┼────────┤');
  
  results.forEach(r => {
    const status = r.status === 'pass' ? '✅' : '❌';
    const name = r.name.padEnd(31);
    console.log(`│ ${name} │ ${status}     │`);
  });
  
  console.log('└─────────────────────────────────┴────────┘');

  const passed = results.filter(r => r.status === 'pass').length;
  const total = results.length;
  
  console.log(`\n📈 Results: ${passed}/${total} tests passed\n`);

  if (passed === total) {
    console.log('✅ All systems operational! Ready to deploy.\n');
    process.exit(0);
  } else {
    console.log('⚠️  Some tests failed. Check configurations and try again.\n');
    process.exit(1);
  }
}

runTests();
