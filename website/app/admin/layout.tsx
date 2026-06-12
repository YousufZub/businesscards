import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

function AdminNav() {
  return (
    <nav className="w-56 shrink-0 bg-[#0d1117] border-r border-white/5 flex flex-col min-h-screen">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/5 flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-4 h-4 text-white fill-current">
            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
          </svg>
        </div>
        <span className="font-bold text-white text-sm">Admin</span>
      </div>

      {/* Nav links */}
      <div className="flex-1 px-3 py-4 space-y-0.5">
        {[
          { href: '/admin',       label: 'Dashboard', icon: '📊' },
          { href: '/admin/users', label: 'Users',     icon: '👥' },
        ].map(({ href, label, icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <span>{icon}</span>
            {label}
          </Link>
        ))}
      </div>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-white/5">
        <Link href="/" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">
          ← Back to website
        </Link>
      </div>
    </nav>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#030712] text-white">
      <AdminNav />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
