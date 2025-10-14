// Vercel Serverless Function for Stripe Checkout Session
// Deployed at: /api/create-checkout-session

import Stripe from 'stripe';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { items, customerInfo } = req.body;

    if (!items || !customerInfo) {
      return res.status(400).json({ error: 'Items and customer info are required' });
    }

    console.log('💳 Creating Stripe Checkout Session...');

    // Initialize Stripe with secret key from environment
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    // Calculate line items for Stripe
    const lineItems = items.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.productName,
          description: item.selectedColor ? `Color: ${item.selectedColor}` : undefined,
        },
        unit_amount: Math.round(item.unitPrice * 100), // Stripe expects cents
      },
      quantity: item.quantity,
    }));

    // Add shipping as a line item if applicable
    if (items.some(item => item.shippingCost > 0)) {
      const shippingTotal = items.reduce((sum, item) => sum + (item.shippingCost || 0), 0);
      if (shippingTotal > 0) {
        lineItems.push({
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Shipping',
            },
            unit_amount: Math.round(shippingTotal * 100),
          },
          quantity: 1,
        });
      }
    }

    // Get the origin from the request headers for success/cancel URLs
    const origin = req.headers.origin || req.headers.referer?.replace(/\/$/, '') || 'https://therapyequipped.vercel.app';

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout`,
      customer_email: customerInfo.email,
      metadata: {
        customerName: `${customerInfo.firstName} ${customerInfo.lastName}`,
        address: customerInfo.address,
        city: customerInfo.city,
        state: customerInfo.state,
        zipCode: customerInfo.zipCode,
        country: customerInfo.country,
      },
    });

    console.log('✅ Checkout Session created:', session.id);

    return res.status(200).json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error('❌ Stripe Checkout Session error:', error);
    return res.status(500).json({
      error: error.message,
    });
  }
}
