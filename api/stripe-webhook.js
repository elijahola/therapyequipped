// Stripe webhook → fulfillment alert email, running in production (no laptop needed).
// Stripe calls this the moment a checkout is paid; we email the owner the customer's
// shipping address + the exact Amazon listing to fulfill from.
import Stripe from 'stripe';
import nodemailer from 'nodemailer';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
let FULFILLMENT_MAP = {};
try {
  FULFILLMENT_MAP = require('../flywheel/fulfillment_map.json');
} catch {
  /* map missing — email still goes out, just without the buy link */
}

// Signature verification needs the raw body — disable the default parser.
export const config = { api: { bodyParser: false } };

async function rawBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      await rawBody(req),
      req.headers['stripe-signature'],
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).json({ error: `Signature verification failed: ${err.message}` });
  }

  if (event.type !== 'checkout.session.completed') {
    return res.status(200).json({ received: true, ignored: event.type });
  }

  const s = event.data.object;
  if (s.payment_status !== 'paid') {
    return res.status(200).json({ received: true, ignored: 'not paid' });
  }

  // Enrich with line items; the event object alone is enough for a useful email.
  let itemNames = '(line items unavailable — open the session in Stripe)';
  try {
    const items = await stripe.checkout.sessions.listLineItems(s.id, { limit: 20 });
    itemNames = items.data.map((i) => `${i.quantity}x ${i.description}`).join(', ');
  } catch {
    /* keep fallback text */
  }

  const ship = s.shipping_details || s.customer_details || {};
  const a = ship.address || {};
  const addr = `${ship.name || '?'}, ${a.line1 || ''} ${a.line2 || ''}, ${a.city || ''} ${a.state || ''} ${a.postal_code || ''}`;
  const links = Object.entries(FULFILLMENT_MAP)
    .filter(([k]) => itemNames.toLowerCase().includes(k))
    .map(([, u]) => u);

  const body = [
    `NEW PAID ORDER  $${(s.amount_total / 100).toFixed(2)}`,
    '',
    `Items: ${itemNames}`,
    `Ship to: ${addr}`,
    `Email: ${(s.customer_details || {}).email || '?'}`,
    '',
    'FULFILL NOW (2-7 day promise, order today):',
    ...(links.length
      ? links.map((u) => `  -> buy at ${u} — set SHIPPING ADDRESS to the customer address above`)
      : ['  (no fulfillment link mapped — check flywheel/fulfillment_map.json)']),
    '',
    `Stripe session: ${s.id}`,
    'Log it in flywheel/ORDERS.md when the Amazon order is placed.',
  ].join('\n');

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: true,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
    });
    await transporter.sendMail({
      from: process.env.SMTP_FROM_EMAIL,
      to: process.env.SMTP_TO_EMAIL,
      subject: `[TE ORDER] $${(s.amount_total / 100).toFixed(2)} — ${itemNames.slice(0, 60)} — fulfill today`,
      text: body,
    });
  } catch (err) {
    // Tell Stripe to retry — email is the whole point of this endpoint.
    return res.status(500).json({ error: `Email failed: ${err.message}` });
  }

  return res.status(200).json({ received: true });
}
