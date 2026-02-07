import type { Metadata } from 'next';
import { Noto_Sans_KR } from 'next/font/google';
import '@repo/ui/styles.css';
import './styles/globals.css';

const notoSansKR = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-noto-sans-kr',
});

export const metadata: Metadata = {
  title: '만나교회 | Manna Church',
  description:
    '하나님을 만나고 이웃을 만나는 교회 - 만나교회에 오신 것을 환영합니다',
  generator: 'demopeu',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={`${notoSansKR.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
