import type { Metadata } from 'next';

export const metadata: Metadata = {
  keywords: [
    "Totika prequalified civil contractors Wellington",
    "Tōtika civil contractors",
    "Totika Robb & Taylor Contracting",
    "Tōtika health and safety prequalification",
  ],
  title: 'About Robb & Taylor Contracting | Wellington Civil Contractors',
  description: "Robb & Taylor Contracting is Tōtika prequalified. Learn about our health and safety prequalification, team and civil contracting services across Wellington and Kāpiti.",
  alternates: { canonical: 'https://www.robbtaylor.co.nz/about' },
  openGraph: {
    title: 'About Robb & Taylor Contracting | Wellington Civil Contractors',
    description: "Robb & Taylor Contracting is Tōtika prequalified. Learn about our health and safety prequalification, team and civil contracting services across Wellington and Kāpiti.",
    url: 'https://www.robbtaylor.co.nz/about',
    type: 'website',
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.robbtaylor.co.nz' },
    { '@type': 'ListItem', position: 2, name: 'About', item: 'https://www.robbtaylor.co.nz/about' },
  ],
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {children}
    </>
  );
}
