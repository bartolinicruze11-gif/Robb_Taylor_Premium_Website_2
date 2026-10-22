import Image from 'next/image';
import Link from 'next/link';

export default function TotikaAccreditation({ businessName }: { businessName: string }) {
  return (
    <article aria-label="Tōtika health and safety prequalification" className="mt-8 flex flex-col items-center gap-6 rounded-xl border border-white/10 bg-white/[0.025] p-6 text-center sm:flex-row sm:text-left">
      <a href="https://www.totika.org/" target="_blank" rel="noopener noreferrer" aria-label="Learn about the Tōtika health and safety prequalification scheme" className="flex w-full max-w-[240px] shrink-0 items-center justify-center rounded-lg bg-white px-5 py-4 sm:w-[220px]">
        <Image src="/images/totika-logo.png" alt={`${businessName} — Tōtika health and safety prequalified`} width={617} height={177} sizes="(max-width: 640px) 200px, 180px" className="h-auto w-full object-contain" />
      </a>
      <div className="min-w-0">
        <h3 className="mb-2 text-lg font-bold tracking-tight text-white">Tōtika Prequalified</h3>
        <p className="text-sm leading-relaxed text-white/65">
          {businessName} holds Tōtika health and safety prequalification. Tōtika is New Zealand’s cross-recognition scheme for contractor health and safety assessments, helping clients recognise assessed health and safety systems.
        </p>
        <Link href="/contact" className="mt-3 inline-block text-sm font-semibold text-white underline decoration-white/30 underline-offset-4 transition-colors hover:decoration-white">
          Request our prequalification details
        </Link>
      </div>
    </article>
  );
}
