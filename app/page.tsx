import type { Metadata } from 'next';

import HeroSection from '@/components/home/HeroSection';
import ServicesPreview from '@/components/home/ServicesPreview';
import InfrastructureSection from '@/components/home/InfrastructureSection';
import TrustSection from '@/components/home/TrustSection';
import ContactCTA from '@/components/home/ContactCTA';

export const metadata: Metadata = {
  title: 'Civil Contractors Wellington | Robb & Taylor Contracting',
  description:
    "Robb & Taylor Contracting provide civil construction, earthworks, retaining and piling, trenching, and pavement works across Wellington, Lower Hutt, Upper Hutt and Porirua. Request a quote.",
  alternates: { canonical: 'https://www.robbtaylor.co.nz' },
  openGraph: {
    title: 'Civil Contractors Wellington | Robb & Taylor Contracting',
    description: "Wellington civil contractors for earthworks, retaining and piling, trenching, pavements and civil construction. Call for a quote.",
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
        text: 'Robb & Taylor Contracting provides civil construction, bulk earthworks, trenching, retaining and piling, pavement preparation, and site preparation across the Wellington Region including Lower Hutt, Upper Hutt, Porirua and Kapiti Coast.',
      },
    },
    {
      '@type': 'Question',
      name: 'What types of retaining and piling work does Robb & Taylor undertake?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Contact Robb & Taylor about retaining structures and piling requirements for residential, commercial and civil construction projects. The team can discuss scope and site conditions before quoting.',
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
      name: 'How can I discuss a civil construction project with Robb & Taylor?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Send a project outline using the online enquiry form, or contact the team by phone or email to discuss scope, site access and project timing.',
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
      <InfrastructureSection />
      <TrustSection />
      <ContactCTA />
    </>
  );
}
