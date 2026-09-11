import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/razorpay
 *
 * Creates a Razorpay order server-side using the test-mode key/secret.
 * Called by ClaimModal before opening the Razorpay Checkout widget.
 *
 * ⚠️ TEST MODE ONLY — no real money involved until KYC is complete.
 */
export async function POST(request: NextRequest) {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  const isConfigured =
    keyId &&
    keySecret &&
    !keyId.includes('REPLACE_WITH_YOUR') &&
    !keyId.includes('YOUR_ACTUAL') &&
    !keySecret.includes('REPLACE_WITH_YOUR') &&
    !keySecret.includes('YOUR_ACTUAL');

  if (!isConfigured) {
    return NextResponse.json(
      { error: 'Razorpay test keys not configured. Please add actual test keys (starting with rzp_test_) to .env' },
      { status: 503 }
    );
  }

  try {
    const { amount, currency = 'INR' } = await request.json();

    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    // Razorpay amounts are in paise (smallest currency unit): multiply by 100
    const amountInPaise = Math.round(amount * 100);

    const orderPayload = {
      amount: amountInPaise,
      currency,
      receipt: `sharebytes_${Date.now()}`,
      notes: {
        platform: 'ShareBytes',
        mode: keyId.startsWith('rzp_test_') ? 'TEST' : 'LIVE',
      },
    };

    // Call Razorpay Orders API
    const basicAuth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
    const razorpayRes = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${basicAuth}`,
      },
      body: JSON.stringify(orderPayload),
    });

    if (!razorpayRes.ok) {
      const err = await razorpayRes.json().catch(() => ({}));
      console.error('[ShareBytes] Razorpay order creation failed:', err);
      return NextResponse.json(
        { error: err?.error?.description || 'Razorpay order creation failed' },
        { status: razorpayRes.status }
      );
    }

    const order = await razorpayRes.json();

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: keyId, // safe to expose — this is the public key
    });
  } catch (err: any) {
    console.error('[ShareBytes] /api/razorpay error:', err);
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
