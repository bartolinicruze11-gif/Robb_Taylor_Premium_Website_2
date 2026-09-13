import type { Metadata } from 'next';
import Link from 'next/link';
import { CircleCheck, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Thank You | Robb & Taylor Contracting',
  description: 'Thank you for contacting Robb & Taylor Contracting.',
  robots: { index: false, follow: true },
  alternates: { canonical: 'https://www.robbtaylor.co.nz/contact/thank-you' },
};

// A lead is tracked by the form after a successful save, never by viewing this page.
export default function ThankYouPage() {
  return (
    <section className="bg-[#020c18] px-6 lg:px-10 pt-56 pb-28">
      <div className="max-w-3xl mx-auto border border-white/[0.07] bg-[#040f1e] p-8 lg:p-12">
        <CircleCheck aria-hidden="true" className="w-10 h-10 text-blue-400 mb-7" />
        <span className="kicker block mb-5">Enquiry Received</span>
        <h1 className="font-black text-white tracking-[-0.03em] leading-tight mb-6"
          style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontFamily: 'var(--font-jakarta), sans-serif' }}>
          Thanks for getting in touch.
        </h1>
        <p className="text-[#6a8598] text-base leading-relaxed mb-8">
          Our team will review your enquiry and get back to you. If your project is urgent, call{' '}
          <a href="tel:+64210274447" className="text-blue-400 hover:text-blue-300">+64 21 027 4447</a>.
        </p>
        <Link href="/" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-7 py-4 text-[11px] tracking-[0.18em] uppercase transition-colors">
          Back to Home <ArrowRight aria-hidden="true" className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
