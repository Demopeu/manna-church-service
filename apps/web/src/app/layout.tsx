import type { Metadata } from 'next';
import { Noto_Sans_KR } from 'next/font/google';
import Script from 'next/script';
import '@repo/ui/styles.css';
import { jsonConfig } from '@/shared/config';
import './styles/globals.css';

const notoSansKR = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-noto-sans-kr',
});

export const metadata: Metadata = {
  title: {
    default: `${jsonConfig.name} | ${jsonConfig.altName}`,
    template: `%s | ${jsonConfig.name}`,
  },
  description: jsonConfig.description,
  keywords: jsonConfig.keywords,
  generator: 'demopeu',
  alternates: {
    canonical: './',
  },
  metadataBase: new URL(jsonConfig.url),
  openGraph: {
    title: {
      default: jsonConfig.name,
      template: `%s | ${jsonConfig.name}`,
    },
    description: jsonConfig.description,
    url: jsonConfig.url,
    siteName: jsonConfig.name,
    locale: 'ko_KR',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: jsonConfig.name,
    description: jsonConfig.description,
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
    'name': jsonConfig.name,
    'alternateName': jsonConfig.altName,
    'description': jsonConfig.description,
    'url': jsonConfig.url,
    'foundingDate': jsonConfig.foundingDate,
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': jsonConfig.address.street,
      'addressLocality': jsonConfig.address.city,
      'addressRegion': jsonConfig.address.region,
      'postalCode': jsonConfig.address.postalCode,
      'addressCountry': jsonConfig.address.country,
    },
    'keywords': jsonConfig.keywords.join(', '),
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
