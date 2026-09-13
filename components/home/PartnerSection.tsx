import { ArrowRight } from 'lucide-react';

export default function PartnerSection() {
  return (
    <section aria-labelledby="emt-partner-heading" className="bg-[#020c18]">
      <div className="section-line" />
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-14 lg:py-20">
        <div className="border border-white/[0.07] bg-[#040f1e] p-8 lg:p-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div className="max-w-2xl">
            <span className="kicker block mb-5">Working Together</span>
            <h2 id="emt-partner-heading" className="font-black text-white tracking-[-0.03em] leading-[1.05] mb-5"
              style={{ fontSize: 'clamp(1.8rem, 3vw, 3rem)', fontFamily: 'var(--font-jakarta), sans-serif' }}>
              We Work with EMT Demolition
            </h2>
            <p className="text-[#6a8598] text-sm leading-[1.85]">
              Robb &amp; Taylor Contracting works with EMT Demolition. For building demolition,
              strip-outs and concrete demolition, explore their services across Wellington and the Lower North Island.
            </p>
          </div>
          <a href="https://www.emtdemolition.co.nz/"
            className="group inline-flex shrink-0 self-start lg:self-auto items-center justify-center gap-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold px-7 py-4 text-[11px] tracking-[0.18em] uppercase transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-400">
            Visit EMT Demolition <ArrowRight aria-hidden="true" className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
}
