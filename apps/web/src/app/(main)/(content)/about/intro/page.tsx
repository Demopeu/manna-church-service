import type { Metadata } from 'next';
import INTRO_BANNER from '@/app/asset/hero-banner/intro.webp';
import { PastorGreetingIntroSection, introData } from '@/widgets/intro-section';
import { MainWrapper } from '@/shared/ui';

export const metadata: Metadata = {
  title: '교회 소개',
  description:
    '대한예수교 장로회(고신) 다대동 만나교회 김정환 담임목사 인사말. 하나님을 만나고 이웃을 만나는 신앙 공동체의 비전을 소개합니다.',
  alternates: {
    canonical: '/about/intro',
  },
  openGraph: {
    title: '교회 소개',
    description: '김정환 담임목사 인사말 및 교회 비전 소개',
  },
};

export default function IntroPage() {
  return (
    <MainWrapper heroBannerImage={INTRO_BANNER} heroBannerData={introData}>
      <PastorGreetingIntroSection />
    </MainWrapper>
  );
}
