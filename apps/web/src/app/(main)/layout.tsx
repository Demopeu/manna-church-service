import { MainFooter, MainHeader, ScrollFAB } from '@/widgets/main-layout';

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <MainHeader />
      {children}
      <MainFooter />
      <ScrollFAB />
    </div>
  );
}
