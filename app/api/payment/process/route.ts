import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase'
import { paymentProcessSchema } from '@/lib/validation'
import { apiLimiter } from '@/lib/rate-limiter'

// ⚠️ PCI COMPLIANCE WARNING: This endpoint accepts raw card data (cardNumber, expiryDate, cvc).
// This is NOT PCI-compliant for production use. Use Square Payment Form tokenization instead.
// This endpoint should only be used with test/demo data until Square Elements integration is complete.

// This is a simplified example. In production, you would:
// 1. Use Stripe's server-side libraries
// 2. Validate card details securely
// 3. Handle PCI compliance
// 4. Use environment variables for Stripe keys

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY
const RESEND_API_KEY = process.env.RESEND_API_KEY

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1'
  const check = apiLimiter.check(ip)
  if (!check.allowed) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  try {
    const body = await request.json()
    const parsed = paymentProcessSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    const { citationId, amount, cardNumber, expiryDate, cvc, billingZip } = parsed.data

    // Get the user from the request (in production, use proper auth)
    const supabase = createServerSupabase()
    if (!supabase) {
      return NextResponse.json(
        { error: 'Service unavailable' },
        { status: 503 }
      )
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Verify the citation belongs to this user
    const { data: citation, error: citationError } = await supabase
      .from('citations')
      .select('*')
      .eq('id', citationId)
      .eq('email', user.email)
      .single()

    if (citationError || !citation) {
      return NextResponse.json(
        { error: 'Citation not found' },
        { status: 404 }
      )
    }

    // In production, you would call Stripe's API here:
    // const stripe = new Stripe(STRIPE_SECRET_KEY)
    // const paymentIntent = await stripe.paymentIntents.create({
    //   amount,
    //   currency: 'usd',
    //   payment_method_types: ['card'],
    // })
    //
    // Then confirm the payment with the card details

    // For this demo, we'll just log the transaction
    console.log('Payment processed:', {
      citationId,
      amount,
      userEmail: user.email,
      timestamp: new Date().toISOString(),
    })

    // Create a payment record (optional)
    const { error: paymentError } = await supabase
      .from('submissions')
      .insert({
        citation_id: citationId,
        customer_email: user.email,
        submission_type: 'payment',
        details: `Payment of $${(amount / 100).toFixed(2)} processed`,
        status: 'approved',
        created_at: new Date().toISOString(),
      })

    if (paymentError) {
      console.error('Error recording payment:', paymentError)
    }

    // Send confirmation email via Resend
    if (RESEND_API_KEY) {
      try {
        // Example email sending (would require Resend SDK in production)
        console.log('Email confirmation would be sent here')
      } catch (err) {
        console.error('Error sending email:', err)
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Payment processed successfully',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Payment processing error:', error)
    return NextResponse.json(
      { error: 'Payment processing failed' },
      { status: 500 }
    )
  }
}
