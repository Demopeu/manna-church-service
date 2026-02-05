import { HeroBanner } from './HeroBanner';
import type { HeroBannerProps } from './HeroBanner';

interface MainWrapperProps {
  heroBannerData: HeroBannerProps;
  children: React.ReactNode;
}

export function MainWrapper({ heroBannerData, children }: MainWrapperProps) {
  return (
    <main className="mb-10 min-w-0 flex-1 space-y-10">
      <HeroBanner {...heroBannerData} />
      {children}
    </main>
  );
}
