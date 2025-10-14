# THERAPY EQUIPPED - E-Commerce Store

A modern, fully-functional e-commerce website for recovery and fitness products. Built with React 19, TypeScript, Vite, and Tailwind CSS v4.

![Tech Stack](https://img.shields.io/badge/React-19.1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.14-38bdf8)
![Vite](https://img.shields.io/badge/Vite-7.1.7-646cff)

## ✨ Features

### 🛍️ **Shopping Experience**
- ✅ Product catalog with 4 products (massage guns, rollers, exercise boards)
- ✅ Product search and filtering by category
- ✅ Sort by name, price (low/high)
- ✅ Product detail pages with image galleries
- ✅ Color variants (TEgun Lite has 3 colors)
- ✅ Quantity selection
- ✅ Related products recommendations

### 🛒 **Shopping Cart**
- ✅ Add/remove items
- ✅ Adjust quantities
- ✅ Free shipping progress bar
- ✅ Automatic shipping calculation
- ✅ Persistent cart (localStorage)
- ✅ Real-time totals

### 💳 **Checkout**
- ✅ Guest checkout (no account required)
- ✅ Form validation
- ✅ Order summary
- ✅ Stripe payment integration
- ✅ **SMTP email notifications** to therapyequipped@gmail.com
- ✅ Secure server-side API for email sending
- ✅ Order success page with tracking info
- ✅ "Go to Cart" button on product pages

### 🎨 **Design & UX**
- ✅ Mobile-first responsive design
- ✅ Sticky navigation with animated cart badge
- ✅ Automatic scroll to top on page navigation
- ✅ Hero carousel with 5 rotating images
- ✅ Elegant Lucide icons (no emojis)
- ✅ Toast notifications
- ✅ Loading states and animations
- ✅ Error handling
- ✅ 404 page
- ✅ Professional footer with working links

### 🚀 **Technical**
- ✅ TypeScript for type safety
- ✅ Context API for state management
- ✅ React Router for navigation
- ✅ Tailwind CSS v4 for styling
- ✅ SEO-optimized meta tags
- ✅ Accessible (WCAG 2.1)

## 🏃‍♂️ Quick Start

### Prerequisites
- **Node.js 20.19+ or 22.12+** (required by Vite 7)
- npm or yarn
- Stripe account (for payments)
- EmailJS account (for order notifications)

### Installation

1. **Clone the repository**
```bash
cd therapyequipped2.5
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**
```bash
# Copy .env to .env.local
cp .env .env.local

# Add your API keys to .env.local:
# - Stripe publishable key
# - EmailJS service ID, template ID, and public key
```

4. **Start development server**
```bash
npm run dev
```

The site will open at `http://localhost:5173`

### 📧 Email & Payment Setup

See detailed setup guides:
- **SMTP_SETUP_GUIDE.md** - Complete SMTP email setup (Gmail)
- **SMTP_MIGRATION_COMPLETE.md** - Quick start guide
- **DEPLOYMENT_CHECKLIST.md** - Pre-launch checklist

## 📦 Available Scripts

```bash
# Development
npm run dev          # Start Vite dev server only
npm run server       # Start SMTP API server only
npm run dev:full     # Start both servers (recommended)

# Production
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
```

### 🚀 Running the Application

**For full functionality (with email notifications):**
```bash
npm run dev:full
```

This starts both:
- Vite dev server → `http://localhost:5173`
- SMTP API server → `http://localhost:3001`

## 🏗️ Project Structure

```
src/
├── components/
│   ├── common/          # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── Skeleton.tsx
│   ├── layout/          # Layout components
│   │   ├── Navigation.tsx
│   │   ├── Footer.tsx
│   │   └── PageLayout.tsx
│   ├── product/         # Product-specific components
│   │   ├── ProductCard.tsx
│   │   ├── ProductGallery.tsx
│   │   └── ColorSelector.tsx
│   └── cart/            # Cart components
│       └── CartItem.tsx
├── pages/               # Route pages
│   ├── Home.tsx
│   ├── Shop.tsx
│   ├── ProductDetail.tsx
│   ├── Cart.tsx
│   ├── Checkout.tsx
│   └── OrderSuccess.tsx
├── context/             # React Context providers
│   ├── CartContext.tsx
│   └── ToastContext.tsx
├── hooks/               # Custom React hooks
│   └── useLocalStorage.ts
├── data/                # Product data
│   └── products.ts
├── types/               # TypeScript types
│   └── index.ts
├── utils/               # Utility functions
│   ├── calculations.ts
│   └── formatting.ts
└── App.tsx              # Main app component
```

## 🛍️ Products

| Product | Price | Shipping | Colors |
|---------|-------|----------|--------|
| **TEgun Pro** | $49.00 | Free | N/A |
| **TEgun Lite** | $39.00 | Free | Green Goblin, Flash, Venom |
| **TEroller** | $25.00 | $5.00 | N/A |
| **TEboard** | $25.00 | $5.00 | N/A |

**Free Shipping:** Orders over $30

## 🖼️ Adding Product Images

Replace placeholder images in `/public/images/products/`:

```
public/images/products/
├── tegun-pro/
│   ├── main.jpg              # Primary product shot (2000x2000px)
│   ├── lifestyle-1.jpg       # In-use photo
│   ├── lifestyle-2.jpg
│   ├── detail-1.jpg          # Close-up detail
│   ├── detail-2.jpg
│   └── whats-included.jpg    # All components
├── tegun-lite/
│   ├── main-green-goblin.jpg
│   ├── main-flash.jpg
│   ├── main-venom.jpg
│   └── ...
├── teroller/
│   └── ...
└── teboard/
    └── ...
```

**Image Guidelines:**
- Format: JPG
- Size: 2000x2000px
- Optimize: < 500KB per image
- Background: White or lifestyle

## 💳 Stripe Integration

See `STRIPE_INTEGRATION.md` for complete Stripe setup guide.

**Quick Setup:**
1. Get Stripe keys from https://stripe.com
2. Add to `.env`:
   ```
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
   ```
3. Follow integration guide in `STRIPE_INTEGRATION.md`

## 🎨 Customization

### Brand Colors
Edit in `src/index.css`:
```css
@theme {
  --color-brand-black: #000000;
  --color-green-goblin: #2D5F5D;
  --color-flash: #B24444;
  --color-venom: #4A5568;
}
```

### Products
Edit in `src/data/products.ts`:
```typescript
export const products: Product[] = [
  {
    id: 'your-product-id',
    name: 'Product Name',
    price: 49.00,
    // ... more fields
  },
];
```

## 🌐 Deployment

### Build for Production
```bash
npm run build
```

Output will be in `/dist` directory.

### Deploy to Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
```bash
npm run build
# Drag /dist folder to Netlify
```

### Environment Variables
Set in your hosting platform:
```
VITE_STRIPE_PUBLISHABLE_KEY=your_key
```

## 🧪 Testing

### Test Checkout Flow
1. Add products to cart
2. Proceed to checkout
3. Fill out form
4. Click "Place Order"
5. See success page

### Test Free Shipping
- Add TEroller ($25) → $5 shipping
- Add TEboard ($25) → total $50 → free shipping!

## 📚 Documentation

- `CLAUDE.md` - Development guide for Claude Code
- `STRIPE_INTEGRATION.md` - Complete Stripe setup guide

## 🛠️ Tech Stack

- **React 19.1.1** - UI library
- **TypeScript 5.9.3** - Type safety
- **Vite 7.1.7** - Build tool
- **Tailwind CSS 4.1.14** - Styling
- **React Router 7.9.4** - Routing
- **Lucide React** - Icons
- **React Hook Form** - Forms
- **Zod** - Validation
- **Stripe** - Payments (ready)

## 🤝 Support

For questions or issues:
- Check `CLAUDE.md` for development guidance
- Review `STRIPE_INTEGRATION.md` for payment setup
- Contact: support@therapyequipped.com

## 📄 License

Proprietary - All rights reserved

---

**Built with ❤️ by Claude Code**
