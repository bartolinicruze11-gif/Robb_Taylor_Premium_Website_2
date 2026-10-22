import ConsentTracking from '@/components/ConsentTracking';
import { TOTIKA_CERTIFICATION } from '@/lib/totika';
import './globals.css';
import type { Metadata } from 'next';

import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import SmoothScrollProvider from '@/components/SmoothScrollProvider';
import ScrollProgress from '@/components/ScrollProgress';
import ConversionTracking from '@/components/ConversionTracking';
import CookieConsent from '@/components/CookieConsent';

const BASE_URL = 'https://www.robbtaylor.co.nz';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Civil Contractors Wellington | Robb & Taylor Contracting',
    template: '%s | Robb & Taylor Contracting',
  },
  description: "Tōtika-prequalified civil contractors in Wellington and Kāpiti. Civil construction, earthworks, retaining, piling and trenching. Request a quote.",
  keywords: [
    "Totika prequalified civil contractors Wellington",
    "Tōtika civil contractors",
    "Totika Robb & Taylor Contracting",
    "Tōtika health and safety prequalification",

    'civil contractors Wellington',
    'civil construction Wellington',
    'civil construction company Wellington NZ',
    'earthworks contractors Wellington',
    'bulk earthworks Wellington',
    'trenching contractors Wellington',
    'site preparation Wellington',
    'civil engineering contractors Wellington NZ',
    'infrastructure contractors Wellington',
    'civil works Lower Hutt',
    'civil works Upper Hutt',
    'civil works Porirua',
    'civil works Kapiti Coast',
    'Robb Taylor Contracting Wellington',
    'civil contractor Wellington Region NZ',
    'NZS 4404 contractor Wellington',
    'ConstructSafe Wellington',
    'Wellington civil contractor quote',
  ],
  authors: [{ name: 'Robb & Taylor Contracting Ltd' }],
  creator: 'Robb & Taylor Contracting Ltd',
  publisher: 'Robb & Taylor Contracting Ltd',
  category: 'Civil Contracting',
  openGraph: {
    type: 'website',
    locale: 'en_NZ',
    url: BASE_URL,
    siteName: 'Robb & Taylor Contracting',
    title: 'Civil Contractors Wellington | Robb & Taylor Contracting',
    description: "Tōtika-prequalified civil contractors in Wellington and Kāpiti. Civil construction, earthworks, retaining, piling and trenching. Request a quote.",
    images: [
      {
        url: '/images/WhatsApp_Image_2026-05-04_at_12.13.08_PM_(4).jpeg',
        width: 1200,
        height: 630,
        alt: 'Robb & Taylor Contracting — Civil Contractors Wellington — HDPE pipe installation',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Civil Contractors Wellington | Robb & Taylor Contracting',
    description: "Tōtika-prequalified civil contractors in Wellington and Kāpiti. Civil construction, earthworks, retaining, piling and trenching. Request a quote.",
    images: ['/images/WhatsApp_Image_2026-05-04_at_12.13.08_PM_(4).jpeg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: BASE_URL,
  },
};

const localBusinessSchema = {
  hasCertification: TOTIKA_CERTIFICATION,
  '@context': 'https://schema.org',
  '@type': ['LocalBusiness', 'GeneralContractor'],
  '@id': `${BASE_URL}/#business`,
  name: 'Robb & Taylor Contracting Ltd',
  legalName: 'Robb & Taylor Contracting Ltd',
  description:
    "Tōtika-prequalified civil contractors in Wellington and Kāpiti. Civil construction, earthworks, retaining, piling and trenching. Request a quote.",
  url: BASE_URL,
  telephone: '+64-21-0274-2447',
  email: 'Rene@RobbTaylor.co.nz',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Wellington',
    addressRegion: 'Wellington',
    postalCode: '6011',
    addressCountry: 'NZ',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: -41.2865,
    longitude: 174.7762,
  },
  areaServed: [
    { '@type': 'City', name: 'Wellington' },
    { '@type': 'City', name: 'Lower Hutt' },
    { '@type': 'City', name: 'Upper Hutt' },
    { '@type': 'City', name: 'Porirua' },
    { '@type': 'AdministrativeArea', name: 'Kapiti Coast' },
    { '@type': 'AdministrativeArea', name: 'Wairarapa' },
    { '@type': 'AdministrativeArea', name: 'Wellington Region' },
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Civil Contracting Services Wellington',
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Civil Construction Wellington', description: 'Full-scope civil construction including roading, kerb and channel, retaining structures and utilities in Wellington.', url: `${BASE_URL}/services/civil-construction` } },

      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Earthworks Wellington', description: 'Bulk earthworks, cut and fill, compaction and subgrade preparation for Wellington subdivisions.', url: `${BASE_URL}/services/earthworks` } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Trenching Wellington', description: 'Precision trenching for utility and pipeline installation across Wellington Region.', url: `${BASE_URL}/services/trenching` } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Retaining & Piling Works Wellington', description: 'Retaining walls and piling for residential, commercial and infrastructure projects.', url: `${BASE_URL}/services/retaining-piling` } },
    ],
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '07:00',
      closes: '17:30',
    },
  ],
  priceRange: '$$',
  paymentAccepted: 'Invoice',
  currenciesAccepted: 'NZD',
  numberOfEmployees: { '@type': 'QuantitativeValue', minValue: 10, maxValue: 50 },
  foundingDate: '2010',
  knowsAbout: [
    'Civil Construction',

    'Earthworks',
    'Pipeline Installation',
    'NZS 4404',
    'Wellington Water',
    'ConstructSafe',
  ],
  award: ['ConstructSafe Accredited', 'NZS 4404 Certified', 'Site Safe Gold Member'],
};

const organizationSchema = {
  hasCertification: TOTIKA_CERTIFICATION,
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${BASE_URL}/#organization`,
  name: 'Robb & Taylor Contracting Ltd',
  url: BASE_URL,
  logo: {
    '@type': 'ImageObject',
    url: `${BASE_URL}/images/logo.png`,
    width: 1024,
    height: 687,
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+64-21-0274-2447',
    contactType: 'customer service',
    areaServed: 'NZ',
    availableLanguage: 'English',
  },
  sameAs: [],
};

const webSiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${BASE_URL}/#website`,
  url: BASE_URL,
  name: 'Robb & Taylor Contracting — Civil Contractors Wellington',
  description: "Tōtika-prequalified civil contractors in Wellington and Kāpiti. Civil construction, earthworks, retaining, piling and trenching. Request a quote.",
  publisher: { '@id': `${BASE_URL}/#organization` },
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-NZ">
      <head>
        <meta name="geo.region" content="NZ-WGN" />
        <meta name="geo.placename" content="Wellington, New Zealand" />
        <meta name="geo.position" content="-41.2865;174.7762" />
        <meta name="ICBM" content="-41.2865, 174.7762" />
        <meta name="format-detection" content="telephone=yes" />
        <meta name="google-site-verification" content="OptknRZm8o5RgCP4veqvnBLvdtRR_Er_6qy4-hAcqp4" />
        <meta name="theme-color" content="#020c18" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
        />
      </head>
      <body className="bg-[#020c18] text-white antialiased" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
        <ScrollProgress />
        <SmoothScrollProvider>
          <Nav />
          <main>{children}</main>
          <Footer />
          <CookieConsent />
        </SmoothScrollProvider>
        <ConsentTracking />
        <ConversionTracking />
      </body>
    </html>
  );
}
