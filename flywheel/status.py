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

# Owner rule 2026-09-08: hard $5 cap per product. The adset carries a $5 lifetime
# budget + ~26h end_time, so Meta stops it on its own; here we decide the verdict.
ended = False
try:
    aset = fb(f"{cur['campaign_id']}/adsets", {'fields': 'end_time'})['data']
    if aset and aset[0].get('end_time'):
        et = datetime.datetime.fromisoformat(aset[0]['end_time'])
        ended = et < datetime.datetime.now(et.tzinfo)
        print(f"delivery window ends: {aset[0]['end_time']}{'  (ENDED)' if ended else ''}")
except Exception as e:
    print('end_time check failed:', e)

print()
if sales_this_product:
    print(f"VERDICT: WINNER — {sales_this_product} sale(s) on {cur['product']}. HOLD. Flag owner to consider scaling.")
elif spend >= 4.5 or ended:
    print(f"VERDICT: ROTATE — ${spend:.2f} of the $5 cap used, window {'ended' if ended else 'nearly spent'}, 0 sales. Launch next product in QUEUE.md.")
elif spend >= 3.0:
    print(f"VERDICT: ROTATE — ${spend:.2f} spent, {lpv} LPVs, 0 sales. Enough signal; move on (owner rule: no sale = next product).")
else:
    print("VERDICT: WAIT — spend < $3 and window still open. The $5 lifetime cap means it cannot overspend while we wait.")
