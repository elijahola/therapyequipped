// Vercel Serverless Function for Customer Receipt Email
// Deployed at: /api/send-customer-receipt

import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
}
