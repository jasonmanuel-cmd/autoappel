import { NextRequest, NextResponse } from 'next/server';

const SQUARE_API = 'https://connect.squareup.com/v2';
const SQUARE_VERSION = '2025-01-23';
const ALLOWED_ORIGIN = process.env.NEXT_PUBLIC_APP_URL || 'https://autoappel.vercel.app';

function getSquareHeaders() {
  const token = process.env.SQUARE_ACCESS_TOKEN;
  if (!token) throw new Error('SQUARE_ACCESS_TOKEN not configured');
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    'Square-Version': SQUARE_VERSION,
  };
}

/**
 * POST /api/payment/checkout
 * Creates a Square checkout session for AutoAppel services
 * Body: { plan: string, amount: number }
 */
export async function POST(req: NextRequest) {
  // Origin check
  const origin = req.headers.get('origin') || '';
  if (origin && !origin.includes('autoappel') && !origin.includes('localhost')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const { plan, amount } = await req.json();

    if (!plan || !amount || amount < 1) {
      return NextResponse.json({ error: 'Plan and amount required' }, { status: 400 });
    }

    const amountCents = Math.round(amount * 100);
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const result = await fetch(`${SQUARE_API}/online-checkout/payment-links`, {
      method: 'POST',
      headers: getSquareHeaders(),
      body: JSON.stringify({
        idempotency_key: `autoappel-${plan}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        quick_pay: {
          name: `AutoAppel — ${plan}`,
          price_money: {
            amount: amountCents,
            currency: 'USD',
          },
          location_id: process.env.SQUARE_LOCATION_ID,
        },
        checkout_options: {
          redirect_url: `${appUrl}/payment/success?plan=${encodeURIComponent(plan)}`,
          ask_for_shipping_address: false,
          enable_coupon: false,
          enable_loyalty: false,
        },
        payment_note: `AutoAppel ${plan} service`,
      }),
    });

    const data = await result.json();

    if (data.errors) {
      console.error('Square checkout error:', data.errors);
      return NextResponse.json({ error: 'Checkout creation failed' }, { status: 502 });
    }

    const url = data.payment_link?.url;
    if (!url) {
      return NextResponse.json({ error: 'No checkout URL returned' }, { status: 500 });
    }

    return NextResponse.json({ url, id: data.payment_link.id });
  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
