import type { Metadata } from 'next';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export const metadata: Metadata = { title: 'Terms of Service' };

export default function TermsPage() {
  const updated = 'June 12, 2026';
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-28 pb-24 px-5 sm:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-black text-white mb-2">Terms of Service</h1>
          <p className="text-gray-500 text-sm mb-12">Last updated: {updated}</p>

          <div className="space-y-8 text-gray-400 leading-relaxed text-sm">
            {[
              {
                title: '1. Acceptance',
                body: 'By downloading, installing, or using CardVault, you agree to these Terms of Service. If you do not agree, do not use the app.',
              },
              {
                title: '2. Eligibility',
                body: 'You must be at least 13 years old to use CardVault. By agreeing to these terms you represent that you meet this requirement.',
              },
              {
                title: '3. Permitted Use',
                body: 'CardVault is for personal and business networking. You may not use CardVault to collect contact data without consent, send unsolicited communications, violate any applicable law, or reverse-engineer the app.',
              },
              {
                title: '4. Accounts',
                body: 'You are responsible for maintaining the confidentiality of your account credentials and for all activity under your account. Notify us immediately at support@cardvault.app of any unauthorized use.',
              },
              {
                title: '5. Subscriptions and Payments',
                body: 'Paid subscriptions are billed in advance. All payments are processed by Stripe. Prices may change with 30 days\' notice. Refunds are available within 14 days of purchase.',
              },
              {
                title: '6. User Content',
                body: 'You retain ownership of all contact data you store in CardVault. You grant us a limited license to store and process that data solely to provide the service.',
              },
              {
                title: '7. Disclaimer of Warranties',
                body: 'CardVault is provided "as is" without warranties of any kind, express or implied. We do not warrant uninterrupted operation or fitness for a particular purpose.',
              },
              {
                title: '8. Limitation of Liability',
                body: 'To the maximum extent permitted by law, CardVault\'s liability for any claim arising from these terms is limited to the amount you paid us in the 12 months preceding the claim.',
              },
              {
                title: '9. Governing Law',
                body: 'These terms are governed by the laws of England and Wales, without regard to conflict of law provisions.',
              },
              {
                title: '10. Changes',
                body: 'We may modify these terms with 30 days\' notice. Continued use after the notice period constitutes acceptance.',
              },
              {
                title: '11. Contact',
                body: 'Questions? Email legal@cardvault.app.',
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
