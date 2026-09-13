import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | Robb & Taylor Contracting',
  description: 'Terms of service for Robb & Taylor Contracting Ltd. Your use of our website and services.',
  alternates: { canonical: 'https://www.robbtaylor.co.nz/terms' },
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  return (
    <div className="bg-[#020c18] min-h-screen">
      <section className="relative pt-36 pb-20 lg:pt-48 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
        <div className="max-w-3xl mx-auto px-6 lg:px-10">
          <span className="text-blue-500 text-[11px] font-bold tracking-[0.25em] uppercase block mb-5">Legal</span>
          <h1 className="font-black text-white tracking-[-0.03em] leading-[0.9] mb-8" style={{ fontSize: 'clamp(2.2rem, 4vw, 3.6rem)' }}>
            Terms of Service
          </h1>
          <p className="text-[#5a7a8e] text-sm mb-10">Last updated: May 2026</p>

          <div className="prose prose-invert max-w-none text-[#7a95ae] leading-relaxed space-y-8">

            <section>
              <h2 className="text-white font-bold text-lg mb-3">1. Acceptance of Terms</h2>
              <p>By accessing and using the Robb &amp; Taylor Contracting Ltd website (robbtaylor.co.nz), you accept and agree to be bound by these terms. If you do not agree to these terms, please do not use this website.</p>
            </section>

            <section>
              <h2 className="text-white font-bold text-lg mb-3">2. Website Use</h2>
              <p>This website is provided for informational purposes about our civil contracting services. You agree not to:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Use the website for any unlawful purpose</li>
                <li>Attempt to gain unauthorised access to any part of the website</li>
                <li>Transmit any harmful, offensive or disruptive content</li>
                <li>Reproduce content without permission</li>
              </ul>
            </section>

            <section>
              <h2 className="text-white font-bold text-lg mb-3">3. Services and Quotations</h2>
              <p>Information on this website is for general guidance only. All quotes and pricing are subject to formal written agreement. No binding contract is formed until a written quote is accepted and confirmed by Robb &amp; Taylor Contracting Ltd.</p>
            </section>

            <section>
              <h2 className="text-white font-bold text-lg mb-3">4. Intellectual Property</h2>
              <p>All content on this website — including text, images, logos, and design — is the property of Robb &amp; Taylor Contracting Ltd or its licensors. You may not reproduce, distribute, or use any content without written permission.</p>
            </section>

            <section>
              <h2 className="text-white font-bold text-lg mb-3">5. Limitation of Liability</h2>
              <p>To the maximum extent permitted by law, Robb &amp; Taylor Contracting Ltd accepts no liability for any loss or damage arising from use of this website or reliance on any information contained within it.</p>
            </section>

            <section>
              <h2 className="text-white font-bold text-lg mb-3">6. External Links</h2>
              <p>This website may contain links to third-party websites (including our industry partners). We are not responsible for the content or practices of those sites.</p>
            </section>

            <section>
              <h2 className="text-white font-bold text-lg mb-3">7. Governing Law</h2>
              <p>These terms are governed by the laws of New Zealand. Any disputes will be subject to the exclusive jurisdiction of New Zealand courts.</p>
            </section>

            <section>
              <h2 className="text-white font-bold text-lg mb-3">8. Contact</h2>
              <p>For any questions regarding these terms, contact us at <a href="mailto:Rene@RobbTaylor.co.nz" className="text-blue-400 hover:text-blue-300">Rene@RobbTaylor.co.nz</a>.</p>
            </section>

          </div>
        </div>
      </section>
    </div>
  );
}
