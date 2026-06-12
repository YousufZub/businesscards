import type { Metadata } from 'next';
import { adminLogin } from './actions';

export const metadata: Metadata = { title: 'Admin Login | CardVault' };

export default function AdminLogin({
  searchParams,
}: {
  searchParams: { error?: string; from?: string };
}) {
  return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2.5 justify-center mb-8">
          <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-white fill-current">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
            </svg>
          </div>
          <span className="font-bold text-white text-xl">CardVault Admin</span>
        </div>

        <div className="bg-[#0d1117] border border-white/10 rounded-2xl p-8">
          <h1 className="text-white font-bold text-xl mb-1">Sign in</h1>
          <p className="text-gray-500 text-sm mb-6">Admin access only.</p>

          {searchParams.error && (
            <div className="bg-red-950/50 border border-red-800/50 rounded-lg px-4 py-3 text-red-400 text-sm mb-5">
              Incorrect password. Try again.
            </div>
          )}

          <form action={adminLogin} className="space-y-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Admin Password</label>
              <input
                type="password"
                name="password"
                required
                autoFocus
                className="w-full bg-[#161b22] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-brand-600/60"
                placeholder="Enter admin password"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-brand-600 hover:bg-brand-500 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
