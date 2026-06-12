import Link from 'next/link';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/5 bg-[#030712]">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14 grid grid-cols-2 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-7 h-7 rounded-md bg-brand-600 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-white fill-current">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
              </svg>
            </div>
            <span className="font-bold text-white">CardVault</span>
          </div>
          <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
            AI-powered business card CRM. Turn every card into a lasting relationship.
          </p>
        </div>

        {/* Product */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-4">Product</h4>
          <ul className="space-y-3">
            <li><Link href="/#features"    className="text-sm text-gray-400 hover:text-white transition-colors">Features</Link></li>
            <li><Link href="/pricing"       className="text-sm text-gray-400 hover:text-white transition-colors">Pricing</Link></li>
            <li><Link href="/#how-it-works" className="text-sm text-gray-400 hover:text-white transition-colors">How it works</Link></li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-4">Company</h4>
          <ul className="space-y-3">
            <li><Link href="/privacy" className="text-sm text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
            <li><Link href="/terms"   className="text-sm text-gray-400 hover:text-white transition-colors">Terms of Service</Link></li>
          </ul>
        </div>

        {/* Download */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-4">Download</h4>
          <ul className="space-y-3">
            <li><span className="text-sm text-gray-400">iOS App — Coming Soon</span></li>
            <li><span className="text-sm text-gray-400">Android App — Coming Soon</span></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/5 max-w-6xl mx-auto px-5 sm:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-gray-600">&copy; {year} CardVault. All rights reserved.</p>
        <p className="text-xs text-gray-600">Built with &hearts; for networkers everywhere.</p>
      </div>
    </footer>
  );
}
