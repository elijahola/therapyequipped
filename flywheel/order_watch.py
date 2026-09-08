"""Polls Stripe for new PAID checkout sessions; emails fulfillment instructions
and appends to flywheel/ORDERS.md. Designed for launchd (runs once per invocation)."""
import json, urllib.request, urllib.parse, os, smtplib, datetime
from email.mime.text import MIMEText

# Runs from ~/.config/vhyral/te_flywheel (launchd cannot read ~/Desktop — TCC).
# Repo copy is canonical source; sync with flywheel/deploy_watch.sh after edits.
BASE = os.path.dirname(os.path.abspath(__file__))
STATE = os.path.join(BASE, 'te_seen_orders.json')
env = {}
for l in open(os.path.join(BASE, 'te_env')):
    if '=' in l and not l.startswith('#'):
        k, v = l.split('=', 1); env[k.strip()] = v.strip().strip('"')
skey = env['STRIPE_SECRET_KEY']
fmap = json.load(open(os.path.join(BASE, 'fulfillment_map.json')))
seen = set(json.load(open(STATE))) if os.path.exists(STATE) else set()

def stripe(path, params=None):
    q = ('?' + urllib.parse.urlencode(params, doseq=True)) if params else ''
    req = urllib.request.Request('https://api.stripe.com/v1/' + path + q,
                                 headers={'Authorization': f'Bearer {skey}'})
    return json.load(urllib.request.urlopen(req))

cutoff = int(datetime.datetime.now().timestamp()) - 3*86400
new = []
for s in stripe('checkout/sessions', {'limit': 40, 'created[gte]': cutoff})['data']:
    if s.get('payment_status') != 'paid' or s['id'] in seen: continue
    items = stripe(f"checkout/sessions/{s['id']}/line_items")['data']
    names = ', '.join(f"{i['quantity']}x {i['description']}" for i in items)
    ship = (s.get('shipping_details') or s.get('customer_details') or {})
    addr = ship.get('address') or {}
    addr_s = f"{ship.get('name','?')}, {addr.get('line1','')} {addr.get('line2','') or ''}, {addr.get('city','')} {addr.get('state','')} {addr.get('postal_code','')}"
    links = [u for k, u in fmap.items() if any(k in i['description'].lower() for i in items)]
    when = datetime.datetime.fromtimestamp(s['created']).isoformat(' ', 'minutes')
    body = (f"NEW PAID ORDER  ${s['amount_total']/100:.2f}\n\nItems: {names}\n"
            f"Ship to: {addr_s}\nEmail: {(s.get('customer_details') or {}).get('email','?')}\n\n"
            f"FULFILL NOW (2-7 day promise, order today):\n" +
            '\n'.join(f"  -> buy at {u} — set SHIPPING ADDRESS to the customer address above" for u in links or ['(no fulfillment link mapped — check flywheel/fulfillment_map.json)']) +
            f"\n\nStripe session: {s['id']}\nLog it in flywheel/ORDERS.md when the Amazon order is placed.")
    new.append((s, when, names, addr_s, body))
    seen.add(s['id'])

if new:
    msg_all = '\n\n----------------\n\n'.join(b for *_, b in new)
    m = MIMEText(msg_all)
    m['Subject'] = f"[TE ORDER] {len(new)} new paid order(s) — fulfill today"
    m['From'] = env['SMTP_FROM_EMAIL']; m['To'] = env['SMTP_TO_EMAIL']
    with smtplib.SMTP_SSL(env['SMTP_HOST'], int(env['SMTP_PORT'])) as srv:
        srv.login(env['SMTP_USER'], env['SMTP_PASSWORD'])
        srv.send_message(m)
    with open(os.path.join(BASE, 'ORDERS.md'), 'a') as f:
        for s, when, names, addr_s, _ in new:
            f.write(f"| {when} | {s['id']} | {names} | {(s.get('customer_details') or {}).get('email','?')} | {addr_s} | ☐ | |\n")
    print(f"emailed {len(new)} new order(s)")
else:
    print('no new orders')
json.dump(sorted(seen), open(STATE, 'w'))
