import type { StaticImageData } from 'next/image';
import { HeroBanner } from './components/HeroBanner';
import type { HeroBannerProps } from './components/HeroBanner';

interface MainWrapperProps {
  heroBannerData: HeroBannerProps;
  heroBannerImage: StaticImageData;
  children: React.ReactNode;
}

export function MainWrapper({
  heroBannerData,
  heroBannerImage,
  children,
}: MainWrapperProps) {
  return (
    <main className="mb-10 min-w-0 flex-1 space-y-10">
      <HeroBanner
        backgroundImage={heroBannerImage}
        title={heroBannerData.title}
        subtitle={heroBannerData.subtitle}
        breadcrumbs={heroBannerData.breadcrumbs}
      />
      {children}
    </main>
  );
}
