import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Users | CardVault Admin' };

interface User {
  _id:       string;
  name:      string;
  email:     string;
  provider:  string;
  plan:      string;
  status:    string;
  scanCount: number;
  scanLimit: number;
  createdAt: number;
}

async function fetchUsers(): Promise<User[]> {
  const siteUrl = process.env.CONVEX_SITE_URL;
  const secret  = process.env.ADMIN_SECRET;
  if (!siteUrl || !secret) return [];

  try {
    const res = await fetch(`${siteUrl}/admin/users`, {
      headers: { Authorization: `Bearer ${secret}` },
      cache:   'no-store',
    });
    if (!res.ok) return [];
    return res.json() as Promise<User[]>;
  } catch {
    return [];
  }
}

const PLAN_COLORS: Record<string, string> = {
  free:          'bg-gray-800 text-gray-400',
  personal_pro:  'bg-brand-900/50 text-brand-300',
  enterprise:    'bg-purple-900/50 text-purple-300',
};

export default async function UsersPage() {
  const users = await fetchUsers();

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Users</h1>
          <p className="text-gray-500 text-sm mt-1">
            {users.length > 0 ? `${users.length} users` : 'Configure CONVEX_SITE_URL to see users.'}
          </p>
        </div>
      </div>

      {users.length === 0 ? (
        <div className="bg-[#0d1117] border border-white/10 rounded-2xl p-12 text-center">
          <p className="text-gray-600 text-sm">No users found or backend not configured.</p>
        </div>
      ) : (
        <div className="bg-[#0d1117] border border-white/10 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {['Name', 'Email', 'Provider', 'Plan', 'Scans', 'Joined'].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-brand-900 flex items-center justify-center text-xs font-bold text-brand-300 shrink-0">
                        {u.name?.[0]?.toUpperCase() ?? '?'}
                      </div>
                      <span className="text-white font-medium truncate max-w-[140px]">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-gray-400 truncate max-w-[160px]">{u.email}</td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs capitalize text-gray-500 bg-white/5 px-2 py-0.5 rounded-full">
                      {u.provider}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs capitalize px-2 py-0.5 rounded-full font-medium ${PLAN_COLORS[u.plan] ?? 'bg-gray-800 text-gray-400'}`}>
                      {u.plan.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-gray-400">
                    {u.scanCount} / {u.scanLimit === -1 ? '∞' : u.scanLimit}
                  </td>
                  <td className="px-5 py-3.5 text-gray-500 text-xs">
                    {new Date(u.createdAt).toLocaleDateString('en-GB', {
                      day: 'numeric', month: 'short', year: 'numeric',
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
