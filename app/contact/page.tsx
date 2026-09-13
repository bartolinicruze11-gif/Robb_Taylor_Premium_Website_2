import type { Metadata } from 'next';
import ContactPageContent from '@/components/contact/ContactPageContent';

export const metadata: Metadata = {
  title: 'Free Quote — Civil Contractors Wellington | Robb & Taylor Contracting',
  description: "Get a free, no-obligation quote from Wellington's trusted civil contractors. Water mains, drainage, earthworks, retaining & piling, and civil construction across Wellington, Lower Hutt, Upper Hutt, Porirua & Kapiti.",
  keywords: 'civil contractors Wellington quote, drainage contractors Wellington, earthworks Wellington, water mains Wellington',
  alternates: { canonical: 'https://robbtaylor.co.nz/contact' },
  openGraph: {
    title: "Free Quote — Wellington's Trusted Civil Contractors | Robb & Taylor",
    description: 'Takes 60 seconds. Free, no-obligation quotes for civil contracting in Wellington. Water mains, drainage, earthworks, retaining & piling, and civil construction.',
    url: 'https://robbtaylor.co.nz/contact',
    type: 'website',
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://robbtaylor.co.nz' },
    { '@type': 'ListItem', position: 2, name: 'Get a Quote', item: 'https://robbtaylor.co.nz/contact' },
  ],
};

export default function ContactPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <ContactPageContent />
    </>
  );
}
