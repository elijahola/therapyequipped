import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Owner-only flywheel dashboard (unlisted route /admin).
 * Password is checked server-side by /api/admin-flywheel; the page just relays
 * it. Auto-refreshes every 60s while open.
 */

interface CampaignStats {
  spend: number; impressions: number; clicks: number; lpv: number;
}
interface ActiveCampaign {
  id: string; name: string; since: string;
  lifetime: CampaignStats; today: CampaignStats;
}
interface Order {
  created: number; amount: number; items: string; email: string; name: string;
}
interface FlywheelData {
  generatedAt: string;
  ledgerCsv: string | null;
  queueMd: string | null;
  campaigns?: { name: string; effective_status: string }[];
  active?: ActiveCampaign[];
  orders?: Order[];
  metaError?: string;
  stripeError?: string;
}

const API = `${import.meta.env.VITE_API_URL || ''}/api/admin-flywheel`;

const parseLedger = (csv: string) => {
  const [head, ...rows] = csv.trim().split('\n');
  const cols = head.split(',');
  return rows.map((r) => Object.fromEntries(r.split(',').map((v, i) => [cols[i], v])));
};

const parseQueue = (md: string) =>
  md.split('\n').filter((l) => l.startsWith('|') && !l.startsWith('|--') && !l.startsWith('| #'))
    .map((l) => l.split('|').map((c) => c.trim()))
    .map((c) => ({ product: c[2], cogs: c[4], sell: c[5], status: c[7] }));

export const Admin = () => {
  const [password, setPassword] = useState(sessionStorage.getItem('te_admin_pw') || '');
  const [authed, setAuthed] = useState(false);
  const [data, setData] = useState<FlywheelData | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const pwRef = useRef(password);
  pwRef.current = password;

  const load = useCallback(async () => {
    if (!pwRef.current) return;
    setLoading(true);
    try {
      const r = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pwRef.current }),
      });
      if (r.status === 401) {
        setAuthed(false); setError('Wrong password'); sessionStorage.removeItem('te_admin_pw');
        return;
      }
      setData(await r.json());
      setAuthed(true); setError('');
      sessionStorage.setItem('te_admin_pw', pwRef.current);
    } catch {
      setError('Failed to load — retrying on next refresh');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (sessionStorage.getItem('te_admin_pw')) load();
    const t = setInterval(load, 60_000);
    return () => clearInterval(t);
  }, [load]);

  if (!authed) {
    return (
      <div className="container-custom py-24 max-w-sm mx-auto">
        <h1 className="text-2xl font-bold mb-4">Admin</h1>
        <form onSubmit={(e) => { e.preventDefault(); load(); }}>
          <input
            type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder="Password" autoFocus
            className="w-full border border-gray-300 rounded-lg p-3 mb-3"
          />
          <button type="submit" className="w-full rounded-lg bg-brand-black py-3 font-semibold text-white">
            {loading ? '…' : 'Enter'}
          </button>
          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        </form>
      </div>
    );
  }

  const ledger = data?.ledgerCsv ? parseLedger(data.ledgerCsv) : [];
  const queue = data?.queueMd ? parseQueue(data.queueMd) : [];
  const testing = ledger.find((r) => r.verdict === 'TESTING');
  const sales14d = (data?.orders || []).reduce((s, o) => s + o.amount, 0);

  const Stat = ({ label, value, sub }: { label: string; value: string; sub?: string }) => (
    <div className="rounded-lg bg-gray-50 p-4">
      <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
      {sub && <p className="text-xs text-gray-500">{sub}</p>}
    </div>
  );

  return (
    <div className="container-custom py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Product Flywheel</h1>
        <p className="text-xs text-gray-500">
          {loading ? 'refreshing…' : `updated ${data ? new Date(data.generatedAt).toLocaleTimeString() : ''}`}
          {' · auto-refreshes every 60s'}
        </p>
      </div>

      {/* Now testing */}
      <section className="mb-10 rounded-xl border border-gray-200 p-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-green-700 mb-1">Now testing</p>
        <h2 className="text-2xl font-bold mb-4">
          {testing ? `${testing.product} (since ${testing.launch_date})` : 'No active test'}
        </h2>
        {data?.metaError && <p className="text-sm text-red-600 mb-3">Meta: {data.metaError}</p>}
        {(data?.active || []).map((c) => (
          <div key={c.id} className="mb-4">
            <p className="mb-3 text-sm text-gray-600">campaign: {c.name}</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Stat label="Spend today" value={`$${c.today.spend.toFixed(2)}`} sub={`$${c.lifetime.spend.toFixed(2)} lifetime`} />
              <Stat label="Impressions today" value={`${c.today.impressions}`} sub={`${c.lifetime.impressions} lifetime`} />
              <Stat label="Clicks today" value={`${c.today.clicks}`} sub={`${c.lifetime.clicks} lifetime`} />
              <Stat label="Landing views today" value={`${c.today.lpv}`} sub={`${c.lifetime.lpv} lifetime`} />
            </div>
          </div>
        ))}
        {(data?.active || []).length === 0 && !data?.metaError && (
          <p className="text-sm text-gray-500">No ACTIVE campaign on the ad account.</p>
        )}
      </section>

      {/* Sales */}
      <section className="mb-10 rounded-xl border border-gray-200 p-6">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-xl font-bold">Paid orders — last 14 days</h2>
          <p className="text-lg font-bold">{data?.orders?.length ?? 0} orders · ${sales14d.toFixed(2)}</p>
        </div>
        {data?.stripeError && <p className="text-sm text-red-600">Stripe: {data.stripeError}</p>}
        {(data?.orders || []).length === 0 ? (
          <p className="text-sm text-gray-500">No sale yet. The flywheel keeps rotating until there is one.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-left text-gray-500">
                <th className="py-2 pr-4">When</th><th className="py-2 pr-4">Items</th>
                <th className="py-2 pr-4">Amount</th><th className="py-2">Customer</th>
              </tr></thead>
              <tbody>
                {data!.orders!.map((o, i) => (
                  <tr key={i} className="border-t border-gray-100">
                    <td className="py-2 pr-4 whitespace-nowrap">{new Date(o.created * 1000).toLocaleString()}</td>
                    <td className="py-2 pr-4">{o.items}</td>
                    <td className="py-2 pr-4 font-semibold">${o.amount.toFixed(2)}</td>
                    <td className="py-2">{o.name} · {o.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* History + queue */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-gray-200 p-6">
          <h2 className="mb-4 text-xl font-bold">Test history</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-left text-gray-500">
                <th className="py-2 pr-4">Product</th><th className="py-2 pr-4">Launched</th>
                <th className="py-2 pr-4">Sales</th><th className="py-2">Verdict</th>
              </tr></thead>
              <tbody>
                {ledger.map((r, i) => (
                  <tr key={i} className="border-t border-gray-100">
                    <td className="py-2 pr-4">{r.product}</td>
                    <td className="py-2 pr-4 whitespace-nowrap">{r.launch_date}</td>
                    <td className="py-2 pr-4">{r.sales}</td>
                    <td className={`py-2 font-semibold ${r.verdict === 'TESTING' ? 'text-green-700' : ''}`}>{r.verdict}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 p-6">
          <h2 className="mb-4 text-xl font-bold">Up next in the queue</h2>
          <ul className="space-y-2 text-sm">
            {queue.filter((q) => q.status?.startsWith('QUEUED')).map((q, i) => (
              <li key={i} className="flex justify-between border-t border-gray-100 pt-2 first:border-0">
                <span>{q.product}</span>
                <span className="text-gray-500">{q.cogs} → {q.sell}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};
