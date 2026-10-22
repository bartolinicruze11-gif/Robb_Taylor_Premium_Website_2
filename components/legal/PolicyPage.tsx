import Link from 'next/link';
import { policyContact } from '@/lib/policies';
type Section = { id: string; title: string; paragraphs: string[]; bullets?: string[]; table?: { headers: string[]; rows: string[][] } };
type Policy = { title: string; summary: string; sections: Section[] };
const links = [{href:'/privacy',name:'Privacy'},{href:'/cookies',name:'Cookies'},{href:'/safety',name:'Health & safety'},{href:'/terms',name:'Terms & conditions'}];
export default function PolicyPage({policy}:{policy:Policy}) {
 return <div className="min-h-screen bg-[#050d16] pb-24 pt-40 text-white md:pt-48">
  <div className="mx-auto max-w-4xl px-6 lg:px-10">
   <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-white/60">Robb & Taylor · Policies</p>
   <h1 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">{policy.title}</h1>
   <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/75">{policy.summary}</p>
   <p className="mt-4 text-sm text-white/60">Effective and last updated: 22 October 2026 · New Zealand</p>
   <nav aria-label="Website policies" className="my-8 flex flex-wrap gap-x-5 gap-y-3 border-y border-white/15 py-5 text-sm">
    {links.map(link=><Link key={link.href} href={link.href} className="underline decoration-white/35 underline-offset-4 hover:decoration-white">{link.name}</Link>)}
   </nav>
   <nav aria-label="On this page" className="mb-10 rounded-xl border border-white/10 bg-white/[0.025] p-5">
    <h2 className="mb-3 text-sm font-bold">On this page</h2>
    <ol className="grid gap-x-6 gap-y-2 text-sm text-white/75 sm:grid-cols-2">
     {policy.sections.map((s,i)=><li key={s.id}><a href={'#'+s.id} className="hover:underline">{i+1}. {s.title}</a></li>)}
    </ol>
   </nav>
   <div className="space-y-10">
    {policy.sections.map((s,i)=><section key={s.id} id={s.id} className="scroll-mt-32 border-b border-white/10 pb-9">
     <h2 className="mb-4 text-xl font-bold leading-snug">{i+1}. {s.title}</h2>
     <div className="space-y-4 text-[15px] leading-7 text-white/75">
      {s.paragraphs.map((p,index)=><p key={index}>{p}</p>)}
      {s.bullets && <ul className="list-disc space-y-3 pl-5">{s.bullets.map(p=><li key={p}>{p}</li>)}</ul>}
      {s.table && <div className="overflow-x-auto rounded-lg border border-white/15" role="region" aria-label="Cookie and storage inventory" tabIndex={0}>
       <table className="w-full min-w-[580px] text-left text-sm leading-relaxed">
        <caption className="sr-only">Cookie and storage inventory: technology, purpose and duration</caption>
        <thead className="bg-white/[0.06]"><tr>{s.table.headers.map(h=><th scope="col" key={h} className="p-4 font-semibold text-white">{h}</th>)}</tr></thead>
        <tbody>{s.table.rows.map(row=><tr key={row[0]} className="border-t border-white/10">{row.map((c,j)=>j===0?<th key={j} scope="row" className="p-4 font-medium text-white/90">{c}</th>:<td key={j} className="p-4 align-top">{c}</td>)}</tr>)}</tbody>
       </table>
      </div>}
     </div>
    </section>)}
   </div>
   <div className="mt-8 flex flex-wrap gap-4 text-xs text-white/60" aria-label="Official guidance">
    <a href="https://www.privacy.org.nz/privacy-principles/" target="_blank" rel="noopener noreferrer" className="underline">NZ privacy principles</a>
    <a href="https://www.consumerprotection.govt.nz/general-help/consumer-laws/fair-trading-act" target="_blank" rel="noopener noreferrer" className="underline">Consumer protection</a>
    <a href="https://www.worksafe.govt.nz/" target="_blank" rel="noopener noreferrer" className="underline">WorkSafe New Zealand</a>
   </div>
   <aside className="mt-10 rounded-xl border border-white/15 bg-white/[0.03] p-6">
    <h2 className="mb-3 text-lg font-bold">Questions or a request?</h2>
    <p className="mb-3 text-sm text-white/75">{policyContact.name} · Wellington & Kāpiti, New Zealand</p>
    <div className="flex flex-wrap gap-4 text-sm" style={{color:'#60a5fa'}}>
     <a className="break-all underline underline-offset-4" href={'mailto:'+policyContact.email}>{policyContact.email}</a>
     <a className="underline underline-offset-4" href={'tel:'+policyContact.tel}>{policyContact.phone}</a>
    </div>
    <div id="cookies" className="mt-5 scroll-mt-32 text-sm"><Link href="/cookies" className="underline underline-offset-4">Cookie details and measurement choices</Link></div>
   </aside>
  </div>
 </div>;
}
