import type { Metadata } from 'next';
import { Noto_Sans_KR } from 'next/font/google';

import '@repo/ui/styles.css';

import './styles/globals.css';

const notoSansKR = Noto_Sans_KR({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '만나교회 관리자',
  description: '만나교회 관리자 페이지',
  generator: 'demopeu',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={`${notoSansKR.className} antialiased`}>{children}</body>
    </html>
  );
}
