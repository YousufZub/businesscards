import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title:       { default: 'CardVault — AI Business Card CRM', template: '%s | CardVault' },
  description: 'Scan any business card with your phone camera. CardVault extracts contacts instantly, links them to meetings, and helps you follow up at the right time.',
  keywords:    ['business card scanner', 'CRM', 'contact management', 'networking', 'AI', 'mobile'],
  authors:     [{ name: 'CardVault' }],
  openGraph: {
    type:        'website',
    locale:      'en_US',
    siteName:    'CardVault',
    title:       'CardVault — AI Business Card CRM',
    description: 'Turn every business card into a lasting relationship.',
  },
  twitter: {
    card:    'summary_large_image',
    title:   'CardVault — AI Business Card CRM',
    description: 'Turn every business card into a lasting relationship.',
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  width:              'device-width',
  initialScale:       1,
  themeColor:         '#030712',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
