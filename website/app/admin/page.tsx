import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Dashboard | CardVault Admin' };

interface AdminStats {
  totalUsers:         number;
  totalContacts:      number;
  totalOrganizations: number;
  newUsersToday:      number;
  newUsersThisWeek:   number;
  planCounts:         Record<string, number>;
}

async function fetchStats(): Promise<AdminStats | null> {
  const siteUrl = process.env.CONVEX_SITE_URL;
  const secret  = process.env.ADMIN_SECRET;
  if (!siteUrl || !secret) return null;

  try {
    const res = await fetch(`${siteUrl}/admin/stats`, {
      headers:     { Authorization: `Bearer ${secret}` },
      cache:       'no-store',
    });
    if (!res.ok) return null;
    return res.json() as Promise<AdminStats>;
  } catch {
    return null;
  }
}

function StatCard({ label, value, sub }: { label: string; value: number | string; sub?: string }) {
  return (
    <div className="bg-[#0d1117] border border-white/10 rounded-2xl p-6">
      <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">{label}</p>
      <p className="text-3xl font-black text-white">{value.toLocaleString()}</p>
      {sub && <p className="text-xs text-gray-600 mt-1">{sub}</p>}
    </div>
  );
}

export default async function AdminDashboard() {
  const stats = await fetchStats();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">
          {stats ? 'Live data from Convex.' : 'Configure CONVEX_SITE_URL and ADMIN_SECRET to see live data.'}
        </p>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Users"     value={stats?.totalUsers    ?? '—'} />
        <StatCard label="Total Contacts"  value={stats?.totalContacts  ?? '—'} />
        <StatCard label="Organizations"   value={stats?.totalOrganizations ?? '—'} />
        <StatCard label="New This Week"   value={stats?.newUsersThisWeek  ?? '—'} sub={`+${stats?.newUsersToday ?? 0} today`} />
      </div>

      {/* Plans breakdown */}
      <div className="bg-[#0d1117] border border-white/10 rounded-2xl p-6 mb-8">
        <h2 className="text-sm font-semibold text-gray-300 mb-4">Subscriptions by Plan</h2>
        {stats ? (
          <div className="grid grid-cols-3 gap-4">
            {(['free', 'personal_pro', 'enterprise'] as const).map((plan) => {
              const count = stats.planCounts[plan] ?? 0;
              const total = Object.values(stats.planCounts).reduce((a, b) => a + b, 0) || 1;
              const pct   = Math.round((count / total) * 100);
              return (
                <div key={plan}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs text-gray-400 capitalize">{plan.replace('_', ' ')}</span>
                    <span className="text-xs text-white font-semibold">{count}</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand-600 rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-600 mt-0.5">{pct}%</p>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-600 text-sm">No data — CONVEX_SITE_URL not configured.</p>
        )}
      </div>

      {/* Environment status */}
      <div className="bg-[#0d1117] border border-white/10 rounded-2xl p-6">
        <h2 className="text-sm font-semibold text-gray-300 mb-4">Environment</h2>
        <div className="space-y-2">
          {[
            { label: 'CONVEX_SITE_URL',  set: !!process.env.CONVEX_SITE_URL },
            { label: 'ADMIN_SECRET',     set: !!process.env.ADMIN_SECRET },
          ].map(({ label, set }) => (
            <div key={label} className="flex items-center justify-between py-1.5 border-b border-white/5 last:border-0">
              <span className="text-sm text-gray-400 font-mono">{label}</span>
              <span className={`text-xs font-semibold ${set ? 'text-emerald-400' : 'text-red-400'}`}>
                {set ? '✓ set' : '✗ missing'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
