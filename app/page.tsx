import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

import HeroSection from '@/components/home/HeroSection';
import PartnerSection from '@/components/home/PartnerSection';
import ServicesPreview from '@/components/home/ServicesPreview';
import InfrastructureSection from '@/components/home/InfrastructureSection';
import TrustSection from '@/components/home/TrustSection';
import ContactCTA from '@/components/home/ContactCTA';

export const metadata: Metadata = {
  title: 'Civil Contractors Wellington | Robb & Taylor Contracting',
  description:
    "Wellington's #1 civil contractors. Robb & Taylor Contracting deliver water infrastructure, drainage, earthworks, trenching and civil construction across Wellington, Lower Hutt, Upper Hutt and Porirua. Free quotes.",
  alternates: { canonical: 'https://www.robbtaylor.co.nz' },
  openGraph: {
    title: 'Civil Contractors Wellington | Robb & Taylor Contracting',
    description: "Wellington's trusted civil contractors. Water infrastructure, drainage, earthworks, trenching, pipe installation and civil construction. Call for a free quote.",
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What civil contracting services do Robb & Taylor offer in Wellington?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Robb & Taylor Contracting provides civil construction, water infrastructure installation, stormwater drainage, bulk earthworks, trenching, pipe installation (HDPE, PVC, ductile iron), retaining & piling, and site preparation services across the Wellington Region including Lower Hutt, Upper Hutt, Porirua and Kapiti Coast.',
      },
    },
    {
      '@type': 'Question',
      name: 'Are Robb & Taylor approved Wellington Water contractors?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Robb & Taylor Contracting are Wellington Water approved contractors, NZS 4404 certified, and ConstructSafe accredited. We carry $10M public liability insurance and hold Site Safe Gold membership.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I get a civil contracting quote in Wellington?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You can request a free quote by visiting our contact page at robbtaylor.co.nz/contact, calling +64 21 027 4447, or emailing Rene@RobbTaylor.co.nz. We typically respond within 1 business day.',
      },
    },
    {
      '@type': 'Question',
      name: 'What areas does Robb & Taylor service?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Robb & Taylor operates across the Wellington Region including Wellington City, Lower Hutt, Upper Hutt, Porirua, Kapiti Coast and the Wairarapa.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is Robb & Taylor NZS 4404 certified?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Robb & Taylor Contracting holds NZS 4404 certification (New Zealand standard for land development and subdivision infrastructure) and is recognised by Wellington Water and Wellington City Council as a qualified civil contractor.',
      },
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <HeroSection />
      <ServicesPreview />
      <PartnerSection />
      <InfrastructureSection />
      <TrustSection />
      <ContactCTA />
    </>
  );
}
