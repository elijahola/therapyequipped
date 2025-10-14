# Stripe Payment Integration Guide

## Current Status
The checkout page is built and ready for Stripe integration. Currently running in **demo mode** - the checkout flow works but doesn't process real payments.

## What You Need

### 1. Stripe Account
1. Sign up at https://stripe.com
2. Get your **Publishable Key** and **Secret Key** from the Dashboard
3. Update `.env` file with your publishable key:
   ```
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_key_here
   ```

### 2. Backend API (Required for Production)
Stripe requires a backend to securely process payments. You'll need to:

1. Create a backend API (Node.js/Express, Python/Flask, etc.)
2. Install Stripe SDK on backend
3. Create endpoints:
   - `POST /create-payment-intent` - Creates payment intent
   - `POST /confirm-order` - Confirms order after payment

### 3. Frontend Integration Steps

#### Option A: Quick Test with Stripe Checkout (Recommended for MVP)
```bash
npm install @stripe/stripe-js
```

Update `src/pages/Checkout.tsx`:
```typescript
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// In handleSubmit:
const stripe = await stripePromise;
const response = await fetch('YOUR_API/create-checkout-session', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    items: items,
    shippingAddress: formData,
  }),
});
const session = await response.json();
await stripe.redirectToCheckout({ sessionId: session.id });
```

#### Option B: Custom Payment Form with Stripe Elements
Already installed: `@stripe/stripe-js` and `@stripe/react-stripe-js`

Create `src/components/checkout/PaymentForm.tsx`:
```typescript
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

export const PaymentForm = ({ onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cardElement = elements.getElement(CardElement);

    // Create payment intent on your backend
    const { clientSecret } = await fetch('/create-payment-intent').then(r => r.json());

    // Confirm payment
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: cardElement },
    });

    if (!error) {
      onSuccess(paymentIntent);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit">Pay Now</button>
    </form>
  );
};
```

## Backend Example (Node.js/Express)

```javascript
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const app = express();

app.post('/create-payment-intent', async (req, res) => {
  const { amount, currency } = req.body;

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100, // Convert to cents
    currency: currency || 'usd',
    automatic_payment_methods: { enabled: true },
  });

  res.json({ clientSecret: paymentIntent.client_secret });
});

app.post('/create-checkout-session', async (req, res) => {
  const { items } = req.body;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: items.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: { name: item.name },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    })),
    mode: 'payment',
    success_url: 'https://yoursite.com/success',
    cancel_url: 'https://yoursite.com/cart',
  });

  res.json({ id: session.id });
});
```

## Testing Stripe Payments

Use these test card numbers:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- 3D Secure: `4000 0027 6000 3184`

Use any future expiry date, any 3-digit CVC, any ZIP code.

## Security Notes

⚠️ **NEVER** expose your Secret Key in frontend code
✅ Always process payments on the backend
✅ Use HTTPS in production
✅ Validate amounts on the server-side
✅ Implement webhook handlers for payment events

## Next Steps

1. **Test Mode**: Use Stripe test keys to test the full flow
2. **Production**: Switch to live keys when ready to accept real payments
3. **Webhooks**: Set up webhook handlers for order confirmation emails
4. **Receipt Emails**: Configure Stripe to send receipts automatically

## Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Checkout Quickstart](https://stripe.com/docs/checkout/quickstart)
- [Stripe Elements Guide](https://stripe.com/docs/payments/elements)
- [Stripe Testing](https://stripe.com/docs/testing)
