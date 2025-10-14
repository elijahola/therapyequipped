// Local development server for SMTP email sending
// Run this alongside your Vite dev server: node server.js

import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import Stripe from 'stripe';

dotenv.config();

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'SMTP Email API is running' });
});

// Create Stripe Checkout Session
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { items, customerInfo } = req.body;

    if (!items || !customerInfo) {
      return res.status(400).json({ error: 'Items and customer info are required' });
    }

    console.log('💳 Creating Stripe Checkout Session...');

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

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/checkout`,
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
});

// Send order email endpoint
app.post('/api/send-order-email', async (req, res) => {
  try {
    const { orderDetails } = req.body;

    if (!orderDetails) {
      return res.status(400).json({ error: 'Order details are required' });
    }

    console.log('📧 Sending order email...');

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // Format order items for email
    const itemsList = orderDetails.items
      .map((item) => {
        const colorInfo = item.selectedColor ? ` - ${item.selectedColor}` : '';
        return `• ${item.productName}${colorInfo} x${item.quantity} - ${item.price}`;
      })
      .join('\n');

    // Create email HTML
    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #000; color: white; padding: 20px; text-align: center; }
        .section { background-color: #f9f9f9; padding: 20px; margin: 20px 0; border-radius: 8px; }
        .section-title { color: #000; font-weight: bold; font-size: 18px; margin-bottom: 10px; border-bottom: 2px solid #000; padding-bottom: 5px; }
        .info-row { padding: 8px 0; }
        .label { font-weight: bold; color: #666; }
        .order-items { background-color: white; padding: 15px; border-radius: 5px; white-space: pre-line; }
        .total-section { background-color: #000; color: white; padding: 15px; border-radius: 8px; }
        .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
        .action-box { background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🛒 NEW ORDER RECEIVED</h1>
            <p>THERAPY EQUIPPED</p>
        </div>

        <div class="section">
            <div class="section-title">📅 ORDER DETAILS</div>
            <div class="info-row">
                <span class="label">Order Date:</span> ${new Date().toLocaleString()}
            </div>
        </div>

        <div class="section">
            <div class="section-title">👤 CUSTOMER INFORMATION</div>
            <div class="info-row">
                <span class="label">Name:</span> ${orderDetails.customerInfo.firstName} ${orderDetails.customerInfo.lastName}
            </div>
            <div class="info-row">
                <span class="label">Email:</span> ${orderDetails.customerInfo.email}
            </div>
        </div>

        <div class="section">
            <div class="section-title">📦 SHIPPING ADDRESS</div>
            <div class="info-row">
                ${orderDetails.customerInfo.address}<br>
                ${orderDetails.customerInfo.city}, ${orderDetails.customerInfo.state} ${orderDetails.customerInfo.zipCode}<br>
                ${orderDetails.customerInfo.country}
            </div>
        </div>

        <div class="section">
            <div class="section-title">🛍️ ORDER ITEMS</div>
            <div class="order-items">${itemsList}</div>
        </div>

        <div class="total-section">
            <div class="info-row">
                <span class="label">Subtotal:</span> ${orderDetails.subtotal}
            </div>
            <div class="info-row">
                <span class="label">Shipping:</span> ${orderDetails.shipping}
            </div>
            <div class="info-row" style="border-top: 1px solid white; margin-top: 10px; padding-top: 10px; font-size: 18px;">
                <span class="label">TOTAL:</span> <strong>${orderDetails.total}</strong>
            </div>
        </div>

        <div class="action-box">
            <p style="color: #856404; margin: 0;">
                <strong>⚠️ ACTION REQUIRED - Next Steps:</strong>
            </p>
            <ol style="color: #856404; margin: 10px 0;">
                <li>Process payment in Stripe dashboard</li>
                <li>Package items for shipment</li>
                <li>Send tracking info to customer at <strong>${orderDetails.customerInfo.email}</strong></li>
            </ol>
        </div>

        <div class="footer">
            <p>This is an automated notification from your THERAPY EQUIPPED store</p>
            <p>therapyequipped@gmail.com</p>
        </div>
    </div>
</body>
</html>
    `;

    // Send email
    const info = await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
      to: process.env.SMTP_TO_EMAIL,
      replyTo: orderDetails.customerInfo.email,
      subject: `🛒 New Order from ${orderDetails.customerInfo.firstName} ${orderDetails.customerInfo.lastName}`,
      html: emailHtml,
    });

    console.log('✅ Email sent successfully:', info.messageId);

    return res.status(200).json({
      success: true,
      messageId: info.messageId,
    });
  } catch (error) {
    console.error('❌ Email send error:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Send customer receipt email endpoint
app.post('/api/send-customer-receipt', async (req, res) => {
  try {
    const { orderDetails } = req.body;

    if (!orderDetails) {
      return res.status(400).json({ error: 'Order details are required' });
    }

    console.log('📧 Sending customer receipt email...');

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // Format order items for email
    const itemsList = orderDetails.items
      .map((item) => {
        const colorInfo = item.selectedColor ? ` - ${item.selectedColor}` : '';
        return `• ${item.productName}${colorInfo} x${item.quantity} - ${item.price}`;
      })
      .join('\n');

    // Create customer-facing email HTML
    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #000; color: white; padding: 20px; text-align: center; }
        .section { background-color: #f9f9f9; padding: 20px; margin: 20px 0; border-radius: 8px; }
        .section-title { color: #000; font-weight: bold; font-size: 18px; margin-bottom: 10px; border-bottom: 2px solid #000; padding-bottom: 5px; }
        .info-row { padding: 8px 0; }
        .label { font-weight: bold; color: #666; }
        .order-items { background-color: white; padding: 15px; border-radius: 5px; white-space: pre-line; }
        .total-section { background-color: #000; color: white; padding: 15px; border-radius: 8px; }
        .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
        .guarantee-box { background-color: #d4edda; border-left: 4px solid #28a745; padding: 15px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>✓ ORDER CONFIRMED</h1>
            <p>THERAPY EQUIPPED</p>
        </div>

        <div class="section">
            <p style="margin: 0; font-size: 16px;">
                Hi ${orderDetails.customerInfo.firstName},
            </p>
            <p style="margin-top: 10px;">
                Thank you for your order! We're excited to help you on your recovery journey.
                Your order has been received and will be processed within 1-2 business days.
            </p>
        </div>

        <div class="section">
            <div class="section-title">📅 ORDER DETAILS</div>
            <div class="info-row">
                <span class="label">Order Date:</span> ${new Date().toLocaleString()}
            </div>
        </div>

        <div class="section">
            <div class="section-title">📦 SHIPPING ADDRESS</div>
            <div class="info-row">
                ${orderDetails.customerInfo.firstName} ${orderDetails.customerInfo.lastName}<br>
                ${orderDetails.customerInfo.address}<br>
                ${orderDetails.customerInfo.city}, ${orderDetails.customerInfo.state} ${orderDetails.customerInfo.zipCode}<br>
                ${orderDetails.customerInfo.country}
            </div>
        </div>

        <div class="section">
            <div class="section-title">🛍️ YOUR ORDER</div>
            <div class="order-items">${itemsList}</div>
        </div>

        <div class="total-section">
            <div class="info-row">
                <span class="label">Subtotal:</span> ${orderDetails.subtotal}
            </div>
            <div class="info-row">
                <span class="label">Shipping:</span> ${orderDetails.shipping}
            </div>
            <div class="info-row" style="border-top: 1px solid white; margin-top: 10px; padding-top: 10px; font-size: 18px;">
                <span class="label">TOTAL PAID:</span> <strong>${orderDetails.total}</strong>
            </div>
        </div>

        <div class="guarantee-box">
            <p style="color: #155724; margin: 0;">
                <strong>🛡️ Your Purchase is Protected</strong>
            </p>
            <ul style="color: #155724; margin: 10px 0;">
                <li><strong>Lifetime Guarantee:</strong> We stand behind our products forever</li>
                <li><strong>30-Day Money Back:</strong> Not satisfied? Get a full refund</li>
            </ul>
        </div>

        <div class="section">
            <div class="section-title">📬 WHAT'S NEXT?</div>
            <div style="margin-top: 10px;">
                <p style="margin: 5px 0;"><strong>1.</strong> We'll process your order within 1-2 business days</p>
                <p style="margin: 5px 0;"><strong>2.</strong> You'll receive tracking information via email once shipped</p>
                <p style="margin: 5px 0;"><strong>3.</strong> Delivery typically takes 3-7 business days</p>
            </div>
        </div>

        <div class="footer">
            <p><strong>Need Help?</strong></p>
            <p>Contact us at <a href="mailto:therapyequipped@gmail.com" style="color: #000;">therapyequipped@gmail.com</a></p>
            <p style="margin-top: 20px;">Thank you for choosing THERAPY EQUIPPED!</p>
        </div>
    </div>
</body>
</html>
    `;

    // Send email to customer
    const info = await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
      to: orderDetails.customerInfo.email,
      replyTo: process.env.SMTP_FROM_EMAIL,
      subject: `Order Confirmation - THERAPY EQUIPPED`,
      html: emailHtml,
    });

    console.log('✅ Customer receipt sent successfully:', info.messageId);

    return res.status(200).json({
      success: true,
      messageId: info.messageId,
    });
  } catch (error) {
    console.error('❌ Customer receipt send error:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`
  ╔═══════════════════════════════════════════════╗
  ║   🚀 THERAPY EQUIPPED API Server Running     ║
  ╚═══════════════════════════════════════════════╝

  🌐 Server: http://localhost:${PORT}
  ✅ Health: http://localhost:${PORT}/health

  📨 Endpoints:
     POST /api/create-checkout-session (Stripe)
     POST /api/send-order-email (Admin notification)
     POST /api/send-customer-receipt (Customer receipt)

  💳 Stripe: ${process.env.STRIPE_SECRET_KEY ? '✓ Configured' : '✗ Missing Secret Key'}
  📧 SMTP: ${process.env.SMTP_HOST} → ${process.env.SMTP_TO_EMAIL}

  💡 Run alongside Vite dev server: npm run dev
  `);
});
