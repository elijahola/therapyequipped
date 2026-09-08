"""Flywheel ad launcher: pauses ALL account campaigns, launches one $5/day
feed-only campaign for the product described in flywheel/next_launch.json.

next_launch.json shape:
{
  "slug": "pickleball-set",              # site product slug (page must be LIVE first)
  "campaign": "pickleball_test",         # campaign name
  "interest_q": "Pickleball",            # Meta adinterest search term ("" = broad)
  "headline": "Pickleball Set - ... - $49.99",
  "ads": [ {"name": "...", "image": "/abs/path.png", "message": "..."}, ... ]
}
"""
import json, urllib.request, urllib.parse, os, sys, uuid

BASE = os.path.dirname(os.path.abspath(__file__))
cfg = json.load(open(os.path.join(BASE, 'next_launch.json')))
tok = open(os.path.expanduser('~/.config/vhyral/fbtok')).read().strip()
ACT = 'act_1388799929459977'
V = 'https://graph.facebook.com/v21.0/'
PAGE = '906258789245001'
IG = '17841442738021702'
DEST = (f"https://www.therapyequipped.com/product/{cfg['slug']}"
        f"?utm_source=meta&utm_medium=paid_social&utm_campaign={cfg['campaign']}")

def get(path, params):
    params['access_token'] = tok
    q = urllib.parse.urlencode({k: (json.dumps(v) if isinstance(v, (dict, list)) else v) for k, v in params.items()})
    return json.JSONDecoder().raw_decode(urllib.request.urlopen(V + path + '?' + q).read().decode())[0]

def post(path, params):
    params['access_token'] = tok
    body = urllib.parse.urlencode({k: (json.dumps(v) if isinstance(v, (dict, list, bool)) else v) for k, v in params.items()}).encode()
    try:
        return json.load(urllib.request.urlopen(urllib.request.Request(V + path, data=body)))
    except urllib.error.HTTPError as e:
        print('ERROR', path, e.read().decode()[:500]); sys.exit(1)

def upload(fp):
    b = uuid.uuid4().hex; d = open(fp, 'rb').read(); n = os.path.basename(fp)
    body = (f'--{b}\r\nContent-Disposition: form-data; name="access_token"\r\n\r\n{tok}\r\n'
            f'--{b}\r\nContent-Disposition: form-data; name="filename"; filename="{n}"\r\nContent-Type: image/png\r\n\r\n').encode() + d + f'\r\n--{b}--\r\n'.encode()
    r = json.load(urllib.request.urlopen(urllib.request.Request(f'{V}{ACT}/adimages', data=body, headers={'Content-Type': f'multipart/form-data; boundary={b}'})))
    return list(r['images'].values())[0]['hash']

# sanity: product page must be live before spending a cent on it
import urllib.error
try:
    urllib.request.urlopen(f"https://www.therapyequipped.com/product/{cfg['slug']}")
except urllib.error.URLError as e:
    print('ABORT: product page not reachable:', e); sys.exit(1)

print('--- pausing existing campaigns ---')
for c in get(f'{ACT}/campaigns', {'fields': 'name,effective_status', 'limit': 100})['data']:
    if c['effective_status'] not in ('PAUSED', 'ARCHIVED', 'DELETED'):
        post(c['id'], {'status': 'PAUSED'}); print('PAUSED:', c['name'])

interest = None
if cfg.get('interest_q'):
    res = get('search', {'type': 'adinterest', 'q': cfg['interest_q'], 'limit': 3}).get('data', [])
    if res:
        interest = {'id': res[0]['id'], 'name': res[0]['name']}; print('interest:', interest)

camp = post(f'{ACT}/campaigns', {'name': cfg['campaign'], 'objective': 'OUTCOME_TRAFFIC',
                                 'status': 'ACTIVE', 'special_ad_categories': [],
                                 'is_adset_budget_sharing_enabled': False})
print('campaign', camp['id'])
targeting = {'geo_locations': {'countries': ['US']}, 'age_min': 25, 'age_max': 65,
             'publisher_platforms': ['facebook', 'instagram'],
             'facebook_positions': ['feed'], 'instagram_positions': ['stream']}
if interest:
    targeting['flexible_spec'] = [{'interests': [interest]}]
# OWNER RULE (2026-09-08): never spend more than $5 on one product. Enforced at
# Meta's level: $5 LIFETIME budget + hard end_time ~26h out. No sale in that
# window -> the campaign is already stopped and the next rotation moves on.
import datetime
end_time = (datetime.datetime.now().astimezone() + datetime.timedelta(hours=26)).isoformat()
adset = post(f'{ACT}/adsets', {'name': f"{cfg['campaign']} - feed US", 'campaign_id': camp['id'],
                               'lifetime_budget': 500, 'end_time': end_time,
                               'billing_event': 'IMPRESSIONS',
                               'optimization_goal': 'LANDING_PAGE_VIEWS',
                               'bid_strategy': 'LOWEST_COST_WITHOUT_CAP',
                               'targeting': targeting, 'status': 'ACTIVE'})
print('adset', adset['id'])

for ad_cfg in cfg['ads']:
    h = upload(ad_cfg['image'])
    cr = post(f'{ACT}/adcreatives', {'name': f"{cfg['campaign']} - {ad_cfg['name']}", 'object_story_spec': {
        'page_id': PAGE, 'instagram_user_id': IG,
        'link_data': {'link': DEST, 'message': ad_cfg['message'], 'name': cfg['headline'],
                      'image_hash': h, 'call_to_action': {'type': 'SHOP_NOW', 'value': {'link': DEST}}}}})
    ad = post(f'{ACT}/ads', {'name': ad_cfg['name'], 'adset_id': adset['id'],
                             'creative': {'creative_id': cr['id']}, 'status': 'ACTIVE'})
    print('AD LIVE:', ad_cfg['name'], ad['id'])

print('--- account state ---')
live = [c for c in get(f'{ACT}/campaigns', {'fields': 'name,effective_status', 'limit': 100})['data']
        if c['effective_status'] == 'ACTIVE']
for c in live: print('ACTIVE:', c['name'])
assert len(live) == 1, 'MORE THAN ONE ACTIVE CAMPAIGN - fix before walking away'
print(f"CAMPAIGN_ID={camp['id']}  (record this in LEDGER.csv)")
print('ACCOUNT TOTAL live: $5.00/day')
