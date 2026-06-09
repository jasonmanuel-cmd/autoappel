import { NextRequest, NextResponse } from 'next/server';
import { getPromo, getDiscountedAmount, isFree } from '@/lib/promo';
import { createServerSupabase } from '@/lib/supabase';

const SQUARE_ENV = process.env.SQUARE_ENV === 'production' ? 'production' : 'sandbox';
const SQUARE_API = SQUARE_ENV === 'production'
  ? 'https://connect.squareup.com/v2'
  : 'https://connect.squareupsandbox.com/v2';
const SQUARE_VERSION = '2025-01-23';

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
 * Creates a Square checkout session or handles free promo
 * Body: { plan: string, amount: number, citation_id?: string, promoCode?: string }
 */
export async function POST(req: NextRequest) {
  const origin = req.headers.get('origin') || '';
  if (origin && !origin.includes('autoappel') && !origin.includes('localhost')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const { plan, amount, citation_id, promoCode } = await req.json();

    if (!plan || !amount || amount < 1) {
      return NextResponse.json({ error: 'Plan and amount required' }, { status: 400 });
    }

    /* ── Handle promo code ───────────────────────── */
    if (promoCode) {
      const promo = getPromo(promoCode);
      if (!promo) {
        return NextResponse.json({ error: 'Invalid promo code' }, { status: 400 });
      }

      const supabase = createServerSupabase();
      let usageCount = 0;
      if (supabase) {
        try {
          const { count } = await supabase
            .from('citations')
            .select('*', { count: 'exact', head: true })
            .eq('promo_code', promo.code);
          usageCount = count ?? 0;
        } catch { usageCount = 0; }
      }
      if (usageCount >= promo.maxUses) {
        return NextResponse.json({ error: 'Promo code has reached max uses' }, { status: 400 });
      }

      if (isFree(promo)) {
        if (citation_id && supabase) {
          await supabase
            .from('citations')
            .update({ payment_status: 'paid', promo_code: promo.code, updated_at: new Date().toISOString() })
            .eq('id', citation_id);
        }
        return NextResponse.json({
          url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/payment/success?plan=${encodeURIComponent(plan)}&citation_id=${encodeURIComponent(citation_id || '')}&free=true&promo=${promo.code}`,
          id: 'free-promo',
          free: true,
          promoCode: promo.code,
        });
      }

      /* Discounted promo — still goes through Square */
      const discountedAmount = getDiscountedAmount(amount, promo);
      if (discountedAmount <= 0) {
        return NextResponse.json({ error: 'Invalid discounted amount' }, { status: 400 });
      }
      const amountCents = Math.round(discountedAmount * 100);
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

      const result = await fetch(`${SQUARE_API}/online-checkout/payment-links`, {
        method: 'POST',
        headers: getSquareHeaders(),
        body: JSON.stringify({
          idempotency_key: `autoappel-${plan}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          quick_pay: {
            name: `AppealMyTickets.com — ${plan}`,
            price_money: { amount: amountCents, currency: 'USD' },
            location_id: process.env.SQUARE_LOCATION_ID,
          },
          checkout_options: {
            redirect_url: `${appUrl}/payment/success?plan=${encodeURIComponent(plan)}${citation_id ? `&citation_id=${encodeURIComponent(citation_id)}` : ''}&promo=${promo.code}`,
            ask_for_shipping_address: false,
            enable_coupon: false,
            enable_loyalty: false,
          },
          payment_note: `AppealMyTickets.com ${plan} service (promo: ${promo.code})`,
        }),
      });

      const data = await result.json();
      if (data.errors) {
        return NextResponse.json({ error: 'Checkout creation failed' }, { status: 502 });
      }
      return NextResponse.json({ url: data.payment_link?.url, id: data.payment_link?.id });
    }

    /* ── No promo — normal Square checkout ──────── */
    const amountCents = Math.round(amount * 100);
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const result = await fetch(`${SQUARE_API}/online-checkout/payment-links`, {
      method: 'POST',
      headers: getSquareHeaders(),
      body: JSON.stringify({
        idempotency_key: `autoappel-${plan}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        quick_pay: {
          name: `AppealMyTickets.com — ${plan}`,
          price_money: { amount: amountCents, currency: 'USD' },
          location_id: process.env.SQUARE_LOCATION_ID,
        },
        checkout_options: {
          redirect_url: `${appUrl}/payment/success?plan=${encodeURIComponent(plan)}${citation_id ? `&citation_id=${encodeURIComponent(citation_id)}` : ''}`,
          ask_for_shipping_address: false,
          enable_coupon: false,
          enable_loyalty: false,
        },
        payment_note: `AppealMyTickets.com ${plan} service`,
      }),
    });

    const data = await result.json();
    if (data.errors) {
      return NextResponse.json({ error: 'Checkout creation failed' }, { status: 502 });
    }
    return NextResponse.json({ url: data.payment_link?.url, id: data.payment_link?.id });
  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
