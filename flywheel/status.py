"""Flywheel status: spend + traffic from Meta, sales from Stripe, verdict.
Run: python3 flywheel/status.py   (from repo root or anywhere)"""
import json, urllib.request, urllib.parse, os, csv, datetime

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ACT = 'act_1388799929459977'
V = 'https://graph.facebook.com/v21.0/'
tok = open(os.path.expanduser('~/.config/vhyral/fbtok')).read().strip()
skey = [l.split('=',1)[1].strip().strip('"') for l in open(os.path.join(REPO,'.env.local'))
        if l.startswith('STRIPE_SECRET_KEY')][0]

def fb(path, params):
    params['access_token'] = tok
    q = urllib.parse.urlencode({k:(json.dumps(v) if isinstance(v,(dict,list)) else v) for k,v in params.items()})
    return json.JSONDecoder().raw_decode(urllib.request.urlopen(V+path+'?'+q).read().decode())[0]

def stripe(path, params=None):
    q = ('?' + urllib.parse.urlencode(params, doseq=True)) if params else ''
    req = urllib.request.Request('https://api.stripe.com/v1/'+path+q, headers={'Authorization': f'Bearer {skey}'})
    return json.load(urllib.request.urlopen(req))

rows = list(csv.DictReader(open(os.path.join(REPO,'flywheel/LEDGER.csv'))))
cur = [r for r in rows if r['verdict'] == 'TESTING']
if not cur:
    print('No TESTING row in LEDGER.csv'); raise SystemExit(1)
cur = cur[-1]
launch_ts = int(datetime.datetime.fromisoformat(cur['launch_date']).timestamp())
print(f"=== Testing: {cur['product']} (launched {cur['launch_date']}) ===")

# Meta: lifetime spend + landing page views + ad status
ins = fb(f"{cur['campaign_id']}/insights", {'fields':'spend,actions','date_preset':'maximum'}).get('data',[])
spend, lpv, clicks = 0.0, 0, 0
if ins:
    spend = float(ins[0].get('spend',0))
    for a in ins[0].get('actions',[]):
        if a['action_type']=='landing_page_view': lpv=int(a['value'])
        if a['action_type']=='link_click': clicks=int(a['value'])
print(f"Meta: ${spend:.2f} spent | {clicks} link clicks | {lpv} landing page views")
for aset in fb(f"{cur['campaign_id']}/adsets", {'fields':'name,effective_status'})['data']:
    print('  adset:', aset['effective_status'], aset['name'])
    for ad in fb(f"{aset['id']}/ads", {'fields':'name,effective_status'})['data']:
        print('    ad:', ad['effective_status'], ad['name'])

# Stripe: paid checkout sessions since launch, with items + shipping
sales_this_product, all_paid = 0, []
sess = stripe('checkout/sessions', {'limit': 40, 'created[gte]': launch_ts - 3600})['data']
for s in sess:
    if s.get('payment_status') != 'paid': continue
    items = stripe(f"checkout/sessions/{s['id']}/line_items")['data']
    names = ', '.join(i['description'] for i in items)
    ship = (s.get('shipping_details') or s.get('customer_details') or {})
    addr = ship.get('address') or {}
    all_paid.append(s['id'])
    when = datetime.datetime.fromtimestamp(s['created']).isoformat(' ', 'minutes')
    print(f"PAID ORDER {when} ${s['amount_total']/100:.2f} | {names}")
    print(f"  ship to: {ship.get('name','?')}, {addr.get('line1','')} {addr.get('city','')} {addr.get('state','')} {addr.get('postal_code','')}")
    if any(w in names.lower() for w in cur['product'].lower().split()[:1]):
        sales_this_product += 1

print()
if sales_this_product:
    print(f"VERDICT: WINNER — {sales_this_product} sale(s) on {cur['product']}. HOLD budget here. Flag owner to consider scaling.")
elif spend < 3.0:
    print("VERDICT: WAIT — ads have not meaningfully delivered yet (spend < $3). Do not rotate on a day the ad barely ran.")
else:
    print(f"VERDICT: ROTATE — ${spend:.2f} spent, {lpv} LPVs, 0 sales. Pause this campaign, launch next product in QUEUE.md.")
