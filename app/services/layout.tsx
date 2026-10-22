import type { Metadata } from 'next';

const BASE_URL = 'https://www.robbtaylor.co.nz';

export const metadata: Metadata = {
  title: 'Civil Contracting Services Wellington | Robb & Taylor',
  description: 'Full-scope civil contracting services in Wellington — civil construction, earthworks, pavements, retaining & piling, trenching and site preparation. Free quotes.',
  alternates: { canonical: `${BASE_URL}/services` },
  openGraph: {
    title: 'Civil Contracting Services Wellington | Robb & Taylor',
    description: 'Wellington civil contracting services. Earthworks, pavements, retaining walls, piling, trenching and civil construction across Wellington.',
    url: `${BASE_URL}/services`,
    type: 'website',
  },
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
