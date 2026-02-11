import type { Metadata } from 'next';
import { Noto_Sans_KR } from 'next/font/google';
import Script from 'next/script';
import '@repo/ui/styles.css';
import { churchData } from '@/shared/config';
import './styles/globals.css';

const notoSansKR = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-noto-sans-kr',
});

export const metadata: Metadata = {
  title: {
    default: `${churchData.name} | ${churchData.altName}`,
    template: `%s | ${churchData.name}`,
  },
  description: churchData.description,
  keywords: churchData.keywords,
  generator: 'demopeu',
  alternates: {
    canonical: './',
  },
  metadataBase: new URL(churchData.url),
  openGraph: {
    title: {
      default: churchData.name,
      template: `%s | ${churchData.name}`,
    },
    description: churchData.description,
    url: churchData.url,
    siteName: churchData.name,
    locale: 'ko_KR',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: churchData.name,
    description: churchData.description,
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Church',
    'name': churchData.name,
    'alternateName': churchData.altName,
    'description': churchData.description,
    'url': churchData.url,
    'foundingDate': churchData.foundingDate,
    'telephone': churchData.contact.smartCall,
    'email': churchData.contact.email,
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': churchData.address.street,
      'addressLocality': churchData.address.city,
      'addressRegion': churchData.address.region,
      'postalCode': churchData.address.postalCode,
      'addressCountry': churchData.address.country,
    },
    'geo': {
      '@type': 'GeoCoordinates',
      'latitude': churchData.geo.latitude,
      'longitude': churchData.geo.longitude,
    },
    'keywords': churchData.keywords.join(', '),
  };
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={`${notoSansKR.variable} font-sans antialiased`}>
        <Script
          id="json-ld-schema"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
