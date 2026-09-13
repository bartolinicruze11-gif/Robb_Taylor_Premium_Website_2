import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Robb & Taylor Contracting | Wellington Civil Contractors',
  description: "Meet the team behind Wellington's trusted civil contractors. Founded by Rene Robb B.Eng — 15+ years delivering water infrastructure, drainage, earthworks and civil construction across the Wellington Region.",
  alternates: { canonical: 'https://www.robbtaylor.co.nz/about' },
  openGraph: {
    title: 'About Robb & Taylor Contracting | Wellington Civil Contractors',
    description: "Robb & Taylor Contracting — founded by engineer Rene Robb. Delivering civil infrastructure, earthworks, water infrastructure and drainage across Wellington, Lower Hutt, Upper Hutt, Porirua and Kapiti.",
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
