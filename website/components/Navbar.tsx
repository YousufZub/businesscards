'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#030712]/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-white fill-current">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
            </svg>
          </div>
          <span className="font-bold text-white text-lg tracking-tight">CardVault</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/#features" className="text-sm text-gray-400 hover:text-white transition-colors">Features</Link>
          <Link href="/pricing" className="text-sm text-gray-400 hover:text-white transition-colors">Pricing</Link>
          <Link href="/#how-it-works" className="text-sm text-gray-400 hover:text-white transition-colors">How it works</Link>
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/admin"
            className="text-sm text-gray-500 hover:text-gray-300 transition-colors px-3 py-1.5"
          >
            Sign In
          </Link>
          <Link
            href="#download"
            className="text-sm font-semibold bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Download App
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-gray-400 hover:text-white p-2"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-[#0d1117] border-t border-white/5 px-5 py-4 flex flex-col gap-4">
          <Link href="/#features"     className="text-sm text-gray-300" onClick={() => setOpen(false)}>Features</Link>
          <Link href="/pricing"        className="text-sm text-gray-300" onClick={() => setOpen(false)}>Pricing</Link>
          <Link href="/#how-it-works"  className="text-sm text-gray-300" onClick={() => setOpen(false)}>How it works</Link>
          <Link
            href="#download"
            className="text-sm font-semibold bg-brand-600 text-white px-4 py-2.5 rounded-lg text-center"
            onClick={() => setOpen(false)}
          >
            Download App
          </Link>
        </div>
      )}
    </nav>
  );
}
