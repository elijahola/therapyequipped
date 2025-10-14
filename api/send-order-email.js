// Vercel Serverless Function for sending order emails via SMTP
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { orderDetails } = req.body;

    if (!orderDetails) {
      return res.status(400).json({ error: 'Order details are required' });
    }

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

    console.log('Email sent successfully:', info.messageId);

    return res.status(200).json({
      success: true,
      messageId: info.messageId,
    });
  } catch (error) {
    console.error('Email send error:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
