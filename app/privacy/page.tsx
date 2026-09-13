import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Robb & Taylor Contracting',
  description: 'Privacy policy for Robb & Taylor Contracting Ltd. How we collect, use and protect your personal information.',
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <div className="bg-[#020c18] min-h-screen">
      <section className="relative pt-36 pb-20 lg:pt-48 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
        <div className="max-w-3xl mx-auto px-6 lg:px-10">
          <span className="text-blue-500 text-[11px] font-bold tracking-[0.25em] uppercase block mb-5">Legal</span>
          <h1 className="font-black text-white tracking-[-0.03em] leading-[0.9] mb-8" style={{ fontSize: 'clamp(2.2rem, 4vw, 3.6rem)' }}>
            Privacy Policy
          </h1>
          <p className="text-[#5a7a8e] text-sm mb-10">Last updated: May 2026</p>

          <div className="prose prose-invert max-w-none text-[#7a95ae] leading-relaxed space-y-8">

            <section>
              <h2 className="text-white font-bold text-lg mb-3">1. Who We Are</h2>
              <p>Robb &amp; Taylor Contracting Ltd (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) is a civil contracting company based in the Wellington Region, New Zealand. This privacy policy explains how we collect and use personal information when you visit our website or engage with us.</p>
              <p className="mt-2">Contact: Rene — <a href="mailto:Rene@RobbTaylor.co.nz" className="text-blue-400 hover:text-blue-300">Rene@RobbTaylor.co.nz</a> | <a href="tel:+64210274447" className="text-blue-400 hover:text-blue-300">+64 21 027 4447</a></p>
            </section>

            <section>
              <h2 className="text-white font-bold text-lg mb-3">2. Information We Collect</h2>
              <p>We may collect the following information when you contact us via the website form:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Your name</li>
                <li>Email address</li>
                <li>Phone number</li>
                <li>Company name and project details</li>
                <li>Any other information you choose to provide</li>
              </ul>
              <p className="mt-3">We also collect standard web analytics data (page views, session duration, general location) to help improve our website.</p>
            </section>

            <section>
              <h2 className="text-white font-bold text-lg mb-3">3. How We Use Your Information</h2>
              <p>We use your personal information to:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Respond to your enquiries and provide quotes</li>
                <li>Communicate about your project</li>
                <li>Improve our website and services</li>
              </ul>
              <p className="mt-3">We do not sell, rent, or share your personal information with third parties for marketing purposes.</p>
            </section>

            <section>
              <h2 className="text-white font-bold text-lg mb-3">4. Data Storage</h2>
              <p>Contact form submissions may be stored securely using Supabase infrastructure. Data is stored in accordance with applicable New Zealand privacy law (Privacy Act 2020).</p>
            </section>

            <section id="cookies">
              <h2 className="text-white font-bold text-lg mb-3">5. Cookies &amp; Analytics</h2>
              <p className="mb-3">
                Our website uses cookies and similar tracking technologies in accordance with the New Zealand <strong className="text-[#a0b8cc]">Privacy Act 2020</strong>. A cookie is a small text file placed on your device when you visit our website.
              </p>

              <h3 className="text-[#a0b8cc] font-semibold text-base mb-2 mt-4">Types of Cookies We Use</h3>
              <ul className="list-disc pl-5 space-y-2 mb-4">
                <li>
                  <span className="text-[#a0b8cc] font-semibold">Strictly Necessary Cookies</span> — Required for the website to function. These cannot be disabled. They include session management and security cookies.
                </li>
                <li>
                  <span className="text-[#a0b8cc] font-semibold">Analytics Cookies</span> — We may use tools such as Google Analytics to collect aggregated, anonymised information about how visitors use our site (pages visited, time on site, browser type). No personally identifiable information is collected through these cookies.
                </li>
                <li>
                  <span className="text-[#a0b8cc] font-semibold">Preference Cookies</span> — Used to remember your cookie consent choice so you are not asked again on future visits.
                </li>
              </ul>

              <h3 className="text-[#a0b8cc] font-semibold text-base mb-2 mt-4">Your Choices</h3>
              <p className="mb-3">
                When you first visit our website, you will be presented with a cookie notice. You may accept or decline non-essential cookies at that time. You can also manage or delete cookies at any time through your browser settings. Note that disabling cookies may affect the functionality of some parts of the site.
              </p>
              <p className="mb-3">
                To withdraw consent after previously accepting, clear your browser&apos;s stored data for this site or contact us at <a href="mailto:Rene@RobbTaylor.co.nz" className="text-blue-400 hover:text-blue-300">Rene@RobbTaylor.co.nz</a>.
              </p>

              <h3 className="text-[#a0b8cc] font-semibold text-base mb-2 mt-4">Third-Party Services</h3>
              <p>
                Where third-party analytics services are used, those providers operate under their own privacy policies. We recommend reviewing the <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">Google Privacy Policy</a> for information on how Google Analytics handles data.
              </p>
            </section>

            <section>
              <h2 className="text-white font-bold text-lg mb-3">6. Your Rights</h2>
              <p>Under the Privacy Act 2020, you have the right to access and correct your personal information. To exercise these rights, contact us at <a href="mailto:Rene@RobbTaylor.co.nz" className="text-blue-400 hover:text-blue-300">Rene@RobbTaylor.co.nz</a>.</p>
            </section>

            <section>
              <h2 className="text-white font-bold text-lg mb-3">7. Changes to This Policy</h2>
              <p>We may update this policy from time to time. The latest version will always be available on this page.</p>
            </section>

          </div>
        </div>
      </section>
    </div>
  );
}
