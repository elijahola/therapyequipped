# 📧 SMTP Email Setup Guide - THERAPY EQUIPPED

This guide explains how to set up SMTP email notifications for order processing.

---

## 🏗️ Architecture

Your email system uses a **secure server-side API** to send emails:

```
Frontend (Browser)          API Server              Gmail SMTP
     │                          │                        │
     │  Order placed            │                        │
     ├─────────────────────────>│                        │
     │  POST /api/send-order-email                       │
     │                          │  Send via SMTP         │
     │                          ├───────────────────────>│
     │                          │                        │
     │                          │  Email sent ✓          │
     │                          │<───────────────────────│
     │  Success response        │                        │
     │<─────────────────────────│                        │
```

**Why API instead of direct frontend?**
- ✅ SMTP credentials are kept secure on the server
- ✅ Browser never sees sensitive passwords
- ✅ Works with any SMTP provider
- ✅ More reliable than browser-based solutions

---

## 🚀 Quick Start (Local Development)

### 1. Your SMTP credentials are already configured in `.env`:

```bash
SMTP_FROM_EMAIL=therapyequipped@gmail.com
SMTP_FROM_NAME=Therapy Equipped
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=hello@venuebox.ai
SMTP_PASSWORD=pbgn tqvb floi hfca
SMTP_TO_EMAIL=therapyequipped@gmail.com
```

### 2. Start both servers:

**Option A: Separate terminals**
```bash
# Terminal 1: Start API server
npm run server

# Terminal 2: Start Vite dev server
npm run dev
```

**Option B: Single command (recommended)**
```bash
npm run dev:full
```

### 3. Test the system:
1. Go to http://localhost:5173
2. Add items to cart
3. Go through checkout
4. Submit order
5. Check therapyequipped@gmail.com for the order email

---

## 🌐 Production Deployment (Vercel)

### Step 1: Deploy to Vercel

```bash
# Install Vercel CLI (if not already installed)
npm install -g vercel

# Deploy
vercel

# Follow prompts to link project
```

### Step 2: Add Environment Variables

In Vercel Dashboard:
1. Go to your project
2. Click "Settings" → "Environment Variables"
3. Add each variable (Production, Preview, Development):

```
SMTP_FROM_EMAIL = therapyequipped@gmail.com
SMTP_FROM_NAME = Therapy Equipped
SMTP_HOST = smtp.gmail.com
SMTP_PORT = 465
SMTP_USER = hello@venuebox.ai
SMTP_PASSWORD = pbgn tqvb floi hfca
SMTP_TO_EMAIL = therapyequipped@gmail.com
VITE_API_URL = https://your-domain.vercel.app
```

### Step 3: Redeploy

```bash
vercel --prod
```

---

## 📁 Project Structure

```
therapyequipped2.5/
├── api/
│   └── send-order-email.js      # Vercel serverless function
├── server.js                     # Local development server
├── src/
│   └── services/
│       └── emailService.ts       # Frontend email service
└── .env                          # SMTP configuration
```

---

## 🔧 How It Works

### Local Development
- `server.js` runs an Express server on port 3001
- Frontend calls `http://localhost:3001/api/send-order-email`
- Server uses nodemailer to send email via SMTP

### Production (Vercel)
- `api/send-order-email.js` runs as a serverless function
- Frontend calls `/api/send-order-email` (same domain)
- Vercel automatically routes to serverless function
- No separate server needed!

---

## 📧 Email Format

Orders sent to **therapyequipped@gmail.com** include:

### Email Subject:
```
🛒 New Order from [Customer Name]
```

### Email Body Contains:
- 📅 Order date and time
- 👤 Customer name and email
- 📦 Full shipping address
- 🛍️ Complete list of items ordered (with colors and quantities)
- 💰 Subtotal, shipping cost, and total
- ⚠️ Action required checklist:
  - Process payment in Stripe
  - Package items
  - Send tracking info to customer

---

## 🧪 Testing

### Test Email Locally

```bash
# Start both servers
npm run dev:full

# Or manually:
npm run server  # Terminal 1
npm run dev     # Terminal 2

# Place a test order and check Gmail
```

### Test API Directly

```bash
# Test API health
curl http://localhost:3001/health

# Test sending email
curl -X POST http://localhost:3001/api/send-order-email \
  -H "Content-Type: application/json" \
  -d '{
    "orderDetails": {
      "items": [
        {
          "productName": "TEgun Pro",
          "quantity": 1,
          "price": "$49.00"
        }
      ],
      "subtotal": "$49.00",
      "shipping": "FREE",
      "total": "$49.00",
      "customerInfo": {
        "firstName": "Test",
        "lastName": "Customer",
        "email": "test@example.com",
        "address": "123 Main St",
        "city": "Anytown",
        "state": "CA",
        "zipCode": "12345",
        "country": "United States"
      }
    }
  }'
```

---

## 🔒 Security Notes

### ✅ Secure Practices
- SMTP credentials are **server-side only**
- Never prefixed with `VITE_` (not exposed to browser)
- Stored in environment variables
- Not committed to version control

### ⚠️ Important
- `.env` file contains sensitive credentials
- Add `.env` to `.gitignore`
- Use different credentials for dev vs production (optional)
- Consider using app-specific passwords for Gmail

---

## 🐛 Troubleshooting

### Email Not Sending

**1. Check server is running**
```bash
# You should see this:
# 📧 SMTP Email API Server Running
# Server: http://localhost:3001
```

**2. Check SMTP credentials**
- Verify `SMTP_PASSWORD` is correct
- Try logging into Gmail with these credentials
- Check if 2FA is enabled (may need app password)

**3. Check Gmail settings**
- Enable "Less secure app access" (if needed)
- Or use an app-specific password
- Check if SMTP is blocked by firewall

**4. Check browser console**
```javascript
// Look for:
// ✅ Order notification sent successfully
// or
// ❌ Failed to send order notification
```

### API Connection Failed

**1. Verify API server is running**
```bash
curl http://localhost:3001/health
# Should return: {"status":"ok"}
```

**2. Check VITE_API_URL**
```bash
# In .env, should be:
VITE_API_URL=http://localhost:3001

# In production:
VITE_API_URL=https://your-domain.vercel.app
```

**3. Check CORS**
- API allows all origins (`*`)
- If issues persist, check browser console for CORS errors

### Gmail SMTP Issues

**If using Gmail:**

1. **Enable 2-Step Verification** in Google Account
2. **Generate App Password**:
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Copy generated password
   - Use this in `SMTP_PASSWORD`

**Gmail SMTP Settings:**
```
Host: smtp.gmail.com
Port: 465 (SSL) or 587 (TLS)
User: your-email@gmail.com
Password: your-app-password
```

---

## 📊 Monitoring

### Check Email Delivery
1. Log into therapyequipped@gmail.com
2. Check Inbox for order notifications
3. If not in Inbox, check Spam folder
4. Set up filter to label order emails

### Check API Logs

**Local Development:**
```bash
# Watch terminal running server.js
# You'll see:
# ✅ Email sent successfully: <message-id>
```

**Vercel Production:**
1. Go to Vercel Dashboard
2. Click your project
3. Go to "Functions" tab
4. View logs for `/api/send-order-email`

---

## 🚀 Going Live

### Pre-Launch Checklist

- [ ] SMTP credentials configured in Vercel
- [ ] `VITE_API_URL` points to production URL
- [ ] Test order completed successfully
- [ ] Email received at therapyequipped@gmail.com
- [ ] Email not in spam folder
- [ ] All order details displayed correctly in email
- [ ] Reply-to address is customer's email

### Production URL

Update `.env` for production:
```bash
VITE_API_URL=https://therapyequipped.vercel.app
```

Then rebuild and redeploy:
```bash
npm run build
vercel --prod
```

---

## 💡 Tips

1. **Gmail Filters**: Set up auto-labeling for order emails
2. **Mobile Notifications**: Enable Gmail push notifications
3. **Backup Email**: Add a backup recipient (optional)
4. **Testing**: Always test email in production before launch
5. **Monitoring**: Check email delivery regularly

---

## 📞 Support

**SMTP Issues:**
- Gmail Help: https://support.google.com/mail/answer/7126229
- Nodemailer Docs: https://nodemailer.com/

**Vercel Deployment:**
- Vercel Docs: https://vercel.com/docs
- Serverless Functions: https://vercel.com/docs/functions

**Need Help?**
- Check browser console for errors
- Check API server logs
- Verify all environment variables
- Contact: therapyequipped@gmail.com

---

## ✅ Success Criteria

Your SMTP email system is working when:

✅ Server starts without errors
✅ Order notification sent successfully (check console)
✅ Email arrives at therapyequipped@gmail.com within 1 minute
✅ Email contains all order details
✅ Customer email set as reply-to
✅ HTML formatting displays correctly
✅ Works in production (Vercel)

---

*SMTP Email System - Ready for Production* 🚀
