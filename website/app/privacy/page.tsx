import type { Metadata } from 'next';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export const metadata: Metadata = { title: 'Privacy Policy' };

export default function PrivacyPage() {
  const updated = 'June 12, 2026';
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-28 pb-24 px-5 sm:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-black text-white mb-2">Privacy Policy</h1>
          <p className="text-gray-500 text-sm mb-12">Last updated: {updated}</p>

          <div className="prose prose-invert prose-sm max-w-none space-y-8 text-gray-400 leading-relaxed">
            {[
              {
                title: '1. Information We Collect',
                body: 'CardVault collects information you provide directly — your name, email address, and contact data you scan or enter. We also collect device identifiers, push notification tokens, and usage analytics to improve the product. We do not collect biometric data; biometric authentication is handled entirely by your device\'s operating system.',
              },
              {
                title: '2. How We Use Your Information',
                body: 'We use collected data to operate the CardVault service, send follow-up push notifications you configure, process payments via Stripe, and improve our AI scanning accuracy. We do not sell your personal information or contact data to third parties.',
              },
              {
                title: '3. Data Storage and Security',
                body: 'Your contact data is stored in a Convex database encrypted at rest. All communication between the app and our backend uses TLS 1.3. Payment information is handled exclusively by Stripe and never stored on our servers.',
              },
              {
                title: '4. Sharing of Information',
                body: 'We share data only with: (a) Convex, our database provider; (b) Stripe, our payment processor; (c) Expo, our push notification provider; and (d) law enforcement when legally required. Within Enterprise plans, contact data you explicitly mark as "shared" is visible to members of your organization.',
              },
              {
                title: '5. Data Retention',
                body: 'We retain your data for as long as your account is active. If you delete your account, we permanently delete all associated contact data within 30 days, except where retention is required by law.',
              },
              {
                title: '6. Your Rights',
                body: 'You may request a copy of your data, correction of inaccurate data, or deletion of your account by emailing privacy@cardvault.app. We respond within 30 days.',
              },
              {
                title: '7. Children',
                body: 'CardVault is not directed at children under 13. We do not knowingly collect personal information from children.',
              },
              {
                title: '8. Changes to This Policy',
                body: 'We may update this policy periodically. We will notify you of material changes via the app or email. Continued use after notice constitutes acceptance.',
              },
              {
                title: '9. Contact',
                body: 'Questions? Email us at privacy@cardvault.app.',
              },
            ].map(({ title, body }) => (
              <section key={title}>
                <h2 className="text-white font-semibold text-lg mb-2">{title}</h2>
                <p>{body}</p>
              </section>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
