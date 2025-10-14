# 🚀 THERAPY EQUIPPED - Deployment Checklist

Complete this checklist before launching your store to production.

---

## 📋 Pre-Launch Checklist

### 1. ✅ Content & Images

- [ ] **Product Images**
  - [ ] Replace all product images with high-quality photos
  - [ ] Add 4.png (attachment guide) to `/public/images/`
  - [ ] Add 5.png (TEgun Pro hero) to `/public/images/`
  - [ ] Run `./update-images.sh` to organize images
  - [ ] Verify all images display correctly on product pages

- [ ] **Product Information**
  - [ ] Verify all product prices are correct
  - [ ] Check product descriptions
  - [ ] Confirm shipping costs ($0 for Pro/Lite, $5 for Roller/Board)
  - [ ] Review "What's Included" for each product

- [ ] **Page Content**
  - [ ] Update About page with your story
  - [ ] Add real testimonials (or remove placeholder ones)
  - [ ] Verify all links work correctly

---

### 2. 💳 Payment Setup (Required)

- [ ] **Stripe Account**
  - [ ] Create Stripe account at https://stripe.com
  - [ ] Complete business verification
  - [ ] Get publishable key (pk_test_ for testing)
  - [ ] Add to `.env`: `VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...`
  - [ ] Test checkout with test card: 4242 4242 4242 4242
  - [ ] Switch to live keys when ready: `pk_live_...`

---

### 3. 📧 Email Notifications (Required)

- [ ] **EmailJS Setup**
  - [ ] Create account at https://www.emailjs.com
  - [ ] Connect Gmail service (therapyequipped@gmail.com)
  - [ ] Create email template (use `EMAILJS_TEMPLATE.txt`)
  - [ ] Get Service ID, Template ID, and Public Key
  - [ ] Add all three to `.env` file
  - [ ] Send test order to verify email receipt

- [ ] **Email Template Variables**
  - [ ] Verify template includes all order details
  - [ ] Set "To Email" to: therapyequipped@gmail.com
  - [ ] Set "Reply To" to: {{customer_email}}
  - [ ] Test that emails arrive in Gmail (not spam)

---

### 4. ⚙️ Environment Variables

Create `.env.local` file with these values:

```bash
# Stripe
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_actual_key

# EmailJS
VITE_EMAILJS_SERVICE_ID=service_your_id
VITE_EMAILJS_TEMPLATE_ID=template_your_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

- [ ] All environment variables configured
- [ ] `.env.local` added to `.gitignore`
- [ ] Test variables load correctly (restart dev server)

---

### 5. 🧪 Testing

- [ ] **Complete User Flow**
  - [ ] Browse products on home page
  - [ ] View product detail pages
  - [ ] Add items to cart
  - [ ] Update quantities in cart
  - [ ] Go to checkout
  - [ ] Fill out shipping information
  - [ ] Complete order (use test card)
  - [ ] Verify order success page displays
  - [ ] Check email received at therapyequipped@gmail.com

- [ ] **Mobile Testing**
  - [ ] Test on mobile device or browser mobile view
  - [ ] Verify navigation menu works
  - [ ] Check cart icon and badge
  - [ ] Test checkout on mobile
  - [ ] Verify images load properly

- [ ] **Browser Testing**
  - [ ] Test in Chrome
  - [ ] Test in Safari
  - [ ] Test in Firefox
  - [ ] Verify all features work

- [ ] **Payment Testing**
  - [ ] Test successful payment (4242 4242 4242 4242)
  - [ ] Test declined card (4000 0000 0000 0002)
  - [ ] Verify error handling

---

### 6. 🌐 Deployment

#### Option A: Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Build locally first
npm run build

# Deploy
vercel

# Add environment variables in Vercel dashboard
```

- [ ] Deploy to Vercel
- [ ] Add environment variables in Vercel project settings
- [ ] Test production URL
- [ ] Verify environment variables work in production

#### Option B: Netlify

```bash
# Build
npm run build

# Deploy dist folder to Netlify
# Or connect GitHub repo for auto-deploy
```

- [ ] Deploy to Netlify
- [ ] Add environment variables in Netlify settings
- [ ] Test production URL

---

### 7. 🔒 Security

- [ ] **Never commit these to version control:**
  - [ ] `.env` file
  - [ ] `.env.local` file
  - [ ] Stripe secret keys (only publishable keys in frontend)

- [ ] **Verify `.gitignore` includes:**
  - [ ] `.env.local`
  - [ ] `.env`
  - [ ] `node_modules/`

---

### 8. 📊 Analytics & Monitoring (Optional but Recommended)

- [ ] **Stripe Dashboard**
  - [ ] Monitor payments
  - [ ] Track successful orders
  - [ ] Watch for declined cards

- [ ] **Email Monitoring**
  - [ ] Check therapyequipped@gmail.com regularly
  - [ ] Set up email filters for order notifications
  - [ ] Create folder for order emails

- [ ] **Google Analytics** (Optional)
  - [ ] Set up GA4 property
  - [ ] Add tracking code to `index.html`
  - [ ] Track conversion events

---

### 9. 📱 Social Media & Marketing (Optional)

- [ ] Set up Instagram: @therapyequipped
- [ ] Set up Facebook page
- [ ] Create social media posts about launch
- [ ] Prepare launch email if you have subscribers

---

### 10. 🎉 Go Live!

- [ ] Final build: `npm run build`
- [ ] Deploy to production
- [ ] Switch Stripe to live mode (pk_live_...)
- [ ] Test one real order yourself
- [ ] Monitor first few real customer orders
- [ ] Respond to order emails promptly

---

## 🆘 Troubleshooting

### Emails Not Arriving

1. Check EmailJS dashboard for delivery status
2. Verify Gmail spam folder
3. Confirm all EmailJS keys are correct
4. Test with a different email first
5. Check browser console for errors

### Stripe Payment Fails

1. Verify Stripe keys are correct
2. Check Stripe dashboard for error logs
3. Ensure keys match environment (test vs live)
4. Test with Stripe test cards first
5. Check browser console for errors

### Images Not Loading

1. Clear browser cache
2. Check image file paths in products.ts
3. Verify images exist in public/images/products/
4. Check image file extensions (.png vs .jpg)
5. Run `./update-images.sh` script

### Build Fails

1. Check for TypeScript errors: `npm run lint`
2. Verify all dependencies installed: `npm install`
3. Check Node version: `node --version` (should be 20+)
4. Clear node_modules and reinstall
5. Check for syntax errors in code

---

## 📞 Support

**Need help?**
- EmailJS docs: https://www.emailjs.com/docs/
- Stripe docs: https://stripe.com/docs
- React Router: https://reactrouter.com/
- Tailwind CSS: https://tailwindcss.com/

**Contact:**
therapyequipped@gmail.com

---

## ✨ Post-Launch

After launching:

1. **Monitor orders** - Check email and Stripe daily
2. **Ship promptly** - Send tracking info to customers
3. **Customer service** - Respond to inquiries quickly
4. **Collect feedback** - Ask customers for testimonials
5. **Iterate** - Add features based on customer needs

---

## 🎊 Congratulations!

Your THERAPY EQUIPPED store is ready to sell!

**You have:**
✅ Professional e-commerce website
✅ Secure payment processing (Stripe)
✅ Automatic order notifications
✅ Mobile-responsive design
✅ 4 products ready to sell
✅ Lifetime guarantee promise
✅ Free shipping over $30

**Good luck with your launch! 🚀**

---

*Built with Claude Code - Ready for production*
