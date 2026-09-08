// Admin flywheel dashboard API — password-gated aggregate of live Meta ad
// delivery, live Stripe sales, and the flywheel ledger/queue.
import Stripe from 'stripe';
import fs from 'fs';
import path from 'path';

const ACT = 'act_1388799929459977';
const V = 'https://graph.facebook.com/v21.0/';

async function fb(pathPart, params, token) {
  const q = new URLSearchParams({ ...params, access_token: token });
  const r = await fetch(`${V}${pathPart}?${q}`);
  if (!r.ok) throw new Error(`meta ${pathPart}: ${(await r.text()).slice(0, 200)}`);
  return r.json();
}

function actionCount(insights, type) {
  const row = insights?.data?.[0];
  if (!row) return 0;
  const a = (row.actions || []).find((x) => x.action_type === type);
  return a ? parseInt(a.value) : 0;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { password } = req.body || {};
  if (!process.env.ADMIN_PASSWORD || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = process.env.FB_ADS_TOKEN;
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const out = { generatedAt: new Date().toISOString() };

  // Ledger + queue, bundled at deploy time
  try {
    out.ledgerCsv = fs.readFileSync(path.join(process.cwd(), 'flywheel/LEDGER.csv'), 'utf8');
  } catch { out.ledgerCsv = null; }
  try {
    out.queueMd = fs.readFileSync(path.join(process.cwd(), 'flywheel/QUEUE.md'), 'utf8');
  } catch { out.queueMd = null; }

  // Live Meta: every non-archived campaign; insights for active ones
  try {
    const camps = (await fb(`${ACT}/campaigns`, { fields: 'name,effective_status,created_time', limit: 100 }, token)).data
      .filter((c) => !['ARCHIVED', 'DELETED'].includes(c.effective_status));
    const active = camps.filter((c) => c.effective_status === 'ACTIVE');
    out.campaigns = camps.slice(0, 25);
    out.active = [];
    for (const c of active) {
      const [life, today] = await Promise.all([
        fb(`${c.id}/insights`, { fields: 'spend,impressions,actions', date_preset: 'maximum' }, token),
        fb(`${c.id}/insights`, { fields: 'spend,impressions,actions', date_preset: 'today' }, token),
      ]);
      out.active.push({
        id: c.id, name: c.name, since: c.created_time,
        lifetime: {
          spend: parseFloat(life.data?.[0]?.spend || 0),
          impressions: parseInt(life.data?.[0]?.impressions || 0),
          clicks: actionCount(life, 'link_click'),
          lpv: actionCount(life, 'landing_page_view'),
        },
        today: {
          spend: parseFloat(today.data?.[0]?.spend || 0),
          impressions: parseInt(today.data?.[0]?.impressions || 0),
          clicks: actionCount(today, 'link_click'),
          lpv: actionCount(today, 'landing_page_view'),
        },
      });
    }
  } catch (err) { out.metaError = err.message; }

  // Live Stripe: paid checkout sessions, last 14 days, with line items
  try {
    const since = Math.floor(Date.now() / 1000) - 14 * 86400;
    const sessions = await stripe.checkout.sessions.list({ limit: 40, created: { gte: since } });
    out.orders = [];
    for (const s of sessions.data.filter((x) => x.payment_status === 'paid')) {
      let items = '';
      try {
        const li = await stripe.checkout.sessions.listLineItems(s.id, { limit: 20 });
        items = li.data.map((i) => `${i.quantity}x ${i.description}`).join(', ');
      } catch { items = '(items unavailable)'; }
      out.orders.push({
        created: s.created, amount: s.amount_total / 100, items,
        email: s.customer_details?.email || '?',
        name: s.shipping_details?.name || s.customer_details?.name || '?',
      });
    }
  } catch (err) { out.stripeError = err.message; }

  return res.status(200).json(out);
}
