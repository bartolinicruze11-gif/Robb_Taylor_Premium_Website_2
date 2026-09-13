import type { Metadata } from 'next';

const BASE_URL = 'https://www.robbtaylor.co.nz';

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

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
