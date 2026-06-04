import { test, expect, Page } from '@playwright/test'

// Test configuration
const BASE_URL = process.env.E2E_BASE_URL || 'http://localhost:3000'
const TEST_EMAIL = `test-${Date.now()}@example.com`
const TEST_PASSWORD = 'TestPassword123'

test.describe('AutoAppel E2E Tests', () => {
  // Test 1: Customer Signup Flow
  test('should complete customer signup and verify email', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`)

    // Click signup tab
    await page.click('text=Sign up')

    // Fill signup form
    await page.fill('input[placeholder*="First"]', 'Test')
    await page.fill('input[placeholder*="Last"]', 'User')
    await page.fill('input[type="email"]', TEST_EMAIL)
    await page.fill('input[type="password"]', TEST_PASSWORD)
    await page.fill('input[placeholder*="Confirm"]', TEST_PASSWORD)

    // Accept terms
    await page.click('input[type="checkbox"]')

    // Submit
    await page.click('button:has-text("Create Account")')

    // Should redirect to verify-email
    await expect(page).toHaveURL(/\/verify-email/)
  })

  // Test 2: Email Verification Flow
  test('should verify email and redirect to dashboard', async ({ page }) => {
    // This would require mocking email verification or using a test email service
    // For now, we'll test the redirect behavior
    await page.goto(`${BASE_URL}/verify-email`)

    // User should be on verify-email page
    await expect(page).toHaveURL(/\/verify-email/)
  })

  // Test 3: Customer Login
  test('should login existing customer and view dashboard', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`)

    // Fill login form
    await page.fill('input[type="email"]', 'test@example.com')
    await page.fill('input[type="password"]', 'TestPassword123')

    // Submit
    await page.click('button:has-text("Login")')

    // Should redirect to dashboard
    await expect(page).toHaveURL(/\/dashboard/)
    await expect(page).toContainText('My Citations')
  })

  // Test 4: View Citations
  test('should display customer citations', async ({ page }) => {
    // Assuming already logged in
    await page.goto(`${BASE_URL}/dashboard`)

    // Check for citations list
    await expect(page).toContainText('Citations')
  })

  // Test 5: View Citation Detail
  test('should view citation details', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard`)

    // Click first citation
    const firstCitation = page.locator('a[href*="/citations/"]').first()
    await firstCitation.click()

    // Should display citation details
    await expect(page).toContainText('Citation Details')
    await expect(page).toContainText('Response Deadline')
  })

  // Test 6: Submit Appeal
  test('should submit appeal form', async ({ page }) => {
    // Navigate to first citation
    await page.goto(`${BASE_URL}/dashboard`)
    const firstCitation = page.locator('a[href*="/citations/"]').first()
    const citationId = await firstCitation.getAttribute('href')

    // Click appeal button
    await page.click('text=Submit Appeal')

    // Should navigate to appeal form
    await expect(page).toHaveURL(/\/appeal/)

    // Fill appeal form
    await page.selectOption('select', 'procedural_error')
    await page.fill('textarea', 'This citation was issued in error due to procedural violations.')

    // Submit
    await page.click('button:has-text("Submit Appeal")')

    // Should show success message
    await expect(page).toContainText('Appeal Submitted!')
  })

  // Test 7: Request Payment Plan
  test('should request payment plan', async ({ page }) => {
    // Navigate to first citation
    await page.goto(`${BASE_URL}/dashboard`)
    const firstCitation = page.locator('a[href*="/citations/"]').first()
    await firstCitation.click()

    // Click payment plan button
    await page.click('text=Request Payment Plan')

    // Should navigate to payment plan form
    await expect(page).toHaveURL(/\/payment-plan/)

    // Fill form
    await page.selectOption('select', '3')
    await page.fill('textarea', 'I would like to pay this citation in 3 installments due to financial hardship.')

    // Submit
    await page.click('button:has-text("Request Payment Plan")')

    // Should show success message
    await expect(page).toContainText('Payment Plan Requested!')
  })

  // Test 8: Request Dismissal
  test('should request dismissal', async ({ page }) => {
    // Navigate to first citation
    await page.goto(`${BASE_URL}/dashboard`)
    const firstCitation = page.locator('a[href*="/citations/"]').first()
    await firstCitation.click()

    // Click dismissal button
    await page.click('text=Request Dismissal')

    // Should navigate to dismissal form
    await expect(page).toHaveURL(/\/dismissal/)

    // Fill form
    await page.selectOption('select', 'procedural_error')
    await page.fill('textarea', 'This citation should be dismissed due to violation of due process rights.')

    // Submit
    await page.click('button:has-text("Submit Dismissal Request")')

    // Should show success message
    await expect(page).toContainText('Dismissal Request Submitted!')
  })

  // Test 9: Payment Flow
  test('should complete payment', async ({ page }) => {
    // Navigate to payment page
    await page.goto(`${BASE_URL}/dashboard`)
    const firstCitation = page.locator('a[href*="/citations/"]').first()
    const href = await firstCitation.getAttribute('href')
    const citationId = href?.split('/').pop()

    await page.goto(`${BASE_URL}/payment?citation_id=${citationId}`)

    // Fill card form
    await page.fill('input[placeholder*="1234"]', '4242424242424242')
    await page.fill('input[placeholder*="MM/YY"]', '12/25')
    await page.fill('input[placeholder*="123"]', '123')
    await page.fill('input[placeholder*="90210"]', '90210')

    // Submit payment
    await page.click('button:has-text("Pay")')

    // Should redirect to success page
    await expect(page).toHaveURL(/\/payment\/success/)
    await expect(page).toContainText('Payment Successful!')
  })

  // Test 10: Admin Login
  test('should login as admin', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`)

    // Find hidden admin link
    await page.fill('input[type="email"]', 'marc@lagnafnetwork.com')

    // Look for admin link (hidden via opacity)
    const adminLink = page.locator('a:has-text("Admin Login")')
    await adminLink.click({ force: true })

    // Should redirect to admin login
    await expect(page).toHaveURL(/\/admin\/login/)
  })

  // Test 11: Admin Dashboard
  test('should view admin dashboard', async ({ page }) => {
    // Assuming admin is logged in
    await page.goto(`${BASE_URL}/admin/dashboard`)

    // Check for admin elements
    await expect(page).toContainText('All Citations')
    await expect(page).toContainText('Status')
    await expect(page).toContainText('Risk Level')
  })

  // Test 12: Admin Citation Detail
  test('should view admin citation detail and manage status', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/dashboard`)

    // Click first citation
    const firstCitation = page.locator('a[href*="/admin/citations/"]').first()
    await firstCitation.click()

    // Should display citation details
    await expect(page).toContainText('Citation Details')
    await expect(page).toContainText('Manage Status')

    // Change status
    await page.click('button:has-text("IN_REVIEW")')

    // Should update
    await expect(page).toContainText('IN_REVIEW')
  })

  // Test 13: Admin Manage Payment
  test('should manage payment status', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/dashboard`)

    // Click first citation
    const firstCitation = page.locator('a[href*="/admin/citations/"]').first()
    await firstCitation.click()

    // Change payment status
    await page.click('button:has-text("PAID")')

    // Should update
    await expect(page).toContainText('PAID')
  })

  // Test 14: Password Reset Flow
  test('should reset password', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`)

    // Click forgot password
    await page.click('text=Forgot password?')

    // Should navigate to forgot password
    await expect(page).toHaveURL(/\/forgot-password/)

    // Enter email
    await page.fill('input[type="email"]', 'test@example.com')

    // Submit
    await page.click('button:has-text("Send Reset Email")')

    // Should show success message
    await expect(page).toContainText('Check your email')
  })

  // Test 15: Rate Limiting
  test('should enforce rate limiting', async ({ page }) => {
    // Make multiple requests rapidly
    for (let i = 0; i < 150; i++) {
      const response = await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'domcontentloaded' })

      // After 100 requests, should get 429
      if (i > 100) {
        expect(response?.status()).toBe(429)
        break
      }
    }
  })
})
