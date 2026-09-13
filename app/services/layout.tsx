import type { Metadata } from 'next';

const BASE_URL = 'https://robbtaylor.co.nz';

export const metadata: Metadata = {
  title: 'Civil Contracting Services Wellington | Robb & Taylor',
  description: 'Full-scope civil contracting services in Wellington — civil construction, water infrastructure, drainage, earthworks, retaining & piling, trenching, pipe installation and site preparation. NZS 4404 certified. Free quotes.',
  alternates: { canonical: `${BASE_URL}/services` },
  openGraph: {
    title: 'Civil Contracting Services Wellington | Robb & Taylor',
    description: 'Wellington civil contracting services. Water mains, drainage, bulk earthworks, retaining walls, pipe installation and civil construction — NZS 4404 certified, Wellington Water approved.',
    url: `${BASE_URL}/services`,
    type: 'website',
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
    { '@type': 'ListItem', position: 2, name: 'Services', item: `${BASE_URL}/services` },
  ],
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
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
