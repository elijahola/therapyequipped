# THERAPY EQUIPPED - Setup Guide

This guide will help you configure Stripe payments and EmailJS for order notifications.

## 📧 EmailJS Setup (Order Notifications)

EmailJS allows you to send order notifications to `therapyequipped@gmail.com` directly from the browser without needing a backend server.

### Step 1: Create EmailJS Account

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account (allows 200 emails/month)
3. Verify your email address

### Step 2: Add Email Service

1. In EmailJS dashboard, click "Add New Service"
2. Choose your email provider:
   - **Gmail** (recommended for therapyequipped@gmail.com)
   - Or any other email service
3. Follow the connection wizard
4. Note your **Service ID** (e.g., `service_abc123`)

### Step 3: Create Email Template

1. Go to "Email Templates" in EmailJS dashboard
2. Click "Create New Template"
3. Use this template structure:

```
Subject: 🛒 New Order from {{customer_name}}

ORDER DETAILS
=============
Date: {{order_date}}

CUSTOMER INFORMATION
--------------------
Name: {{customer_name}}
Email: {{customer_email}}
Shipping Address: {{customer_address}}

ORDER ITEMS
-----------
{{order_items}}

PRICING
-------
Subtotal: {{subtotal}}
Shipping: {{shipping}}
Total: {{total}}

--
Therapy Equipped Order System
```

4. Save template and note your **Template ID** (e.g., `template_xyz789`)

### Step 4: Get Public Key

1. Go to "Account" → "General" in EmailJS dashboard
2. Find your **Public Key** (e.g., `abc123xyz`)

### Step 5: Update Environment Variables

Add these values to your `.env` file:

```bash
VITE_EMAILJS_SERVICE_ID=service_abc123
VITE_EMAILJS_TEMPLATE_ID=template_xyz789
VITE_EMAILJS_PUBLIC_KEY=abc123xyz
```

### Step 6: Configure Recipient

In your EmailJS template settings:
1. Set "To Email" to: `therapyequipped@gmail.com`
2. Or use the variable: `{{to_email}}`

---

## 💳 Stripe Setup (Payments)

### Step 1: Create Stripe Account

1. Go to [https://stripe.com](https://stripe.com)
2. Sign up for a Stripe account
3. Complete account verification

### Step 2: Get API Keys

1. Go to Stripe Dashboard → Developers → API keys
2. Find your **Publishable Key** (starts with `pk_test_` for test mode)
3. Copy the key

### Step 3: Update Environment Variables

Add to your `.env` file:

```bash
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_key_here
```

### Step 4: Testing with Stripe

Use these test card numbers:

| Card Number | Description |
|------------|-------------|
| `4242 4242 4242 4242` | Success |
| `4000 0000 0000 0002` | Card declined |
| `4000 0000 0000 9995` | Insufficient funds |

- Use any future expiration date
- Use any 3-digit CVC
- Use any 5-digit ZIP code

### Step 5: Go Live

When ready for production:

1. Complete Stripe account activation
2. Switch to **Live mode** in Stripe dashboard
3. Get your **live publishable key** (starts with `pk_live_`)
4. Update `.env` with live key
5. Deploy to production

---

## 🚀 Quick Start

1. **Copy .env file**
   ```bash
   cp .env .env.local
   ```

2. **Add your keys to `.env.local`**
   ```bash
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
   VITE_EMAILJS_SERVICE_ID=service_your_id
   VITE_EMAILJS_TEMPLATE_ID=template_your_id
   VITE_EMAILJS_PUBLIC_KEY=your_public_key
   ```

3. **Restart dev server**
   ```bash
   npm run dev
   ```

4. **Test checkout**
   - Add products to cart
   - Go to checkout
   - Fill out form
   - Click "Place Order"
   - Check `therapyequipped@gmail.com` for order notification

---

## ✅ Verification Checklist

- [ ] EmailJS service connected to therapyequipped@gmail.com
- [ ] EmailJS template created with order details
- [ ] EmailJS keys added to .env
- [ ] Stripe account created
- [ ] Stripe publishable key added to .env
- [ ] Test order placed successfully
- [ ] Order notification received at therapyequipped@gmail.com

---

## 🔧 Troubleshooting

### Email Not Sending

1. Check EmailJS dashboard for errors
2. Verify service is connected to correct Gmail account
3. Check spam folder in therapyequipped@gmail.com
4. Verify all EmailJS keys are correct in .env
5. Check browser console for errors

### Stripe Not Working

1. Verify publishable key starts with `pk_test_` or `pk_live_`
2. Check Stripe dashboard for payment logs
3. Ensure test card numbers are used correctly
4. Check browser console for errors

### Environment Variables Not Loading

1. Restart dev server after changing .env
2. Ensure variables start with `VITE_`
3. Check for syntax errors in .env file

---

## 📞 Support

For issues:
- EmailJS: [EmailJS Documentation](https://www.emailjs.com/docs/)
- Stripe: [Stripe Documentation](https://stripe.com/docs)
- Contact: therapyequipped@gmail.com

---

## 🔒 Security Notes

- ✅ **Publishable keys are safe** to expose in frontend code
- ✅ EmailJS public key is safe in frontend
- ❌ **Never commit** secret keys to version control
- ❌ **Never expose** Stripe secret key (sk_test_ or sk_live_)
- ✅ Add `.env.local` to `.gitignore`

---

**Need help?** Contact support at therapyequipped@gmail.com
