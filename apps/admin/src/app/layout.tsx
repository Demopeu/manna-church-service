import type { Metadata } from 'next';
import { Noto_Sans_KR } from 'next/font/google';
import '@repo/ui/styles.css';
import { Toaster } from '@/shared/ui';
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
      <body className={`${notoSansKR.className} antialiased`}>
        {children}
        <Toaster
          position="top-center"
          richColors
          duration={4000}
          toastOptions={{
            style: {
              fontSize: '18px',
              fontWeight: 'bold',
              padding: '20px',
            },
            classNames: {
              toast: 'w-full max-w-md',
            },
          }}
        />
      </body>
    </html>
  );
}
