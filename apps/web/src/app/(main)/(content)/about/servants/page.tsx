import type { Metadata } from 'next';
import SERVANTS_BANNER from '@/app/asset/hero-banner/servants.webp';
import { ServantsContent, servantsData } from '@/widgets/servants-section';
import { MainWrapper } from '@/shared/ui';

export const metadata: Metadata = {
  title: '섬기는 사람들',
  description:
    '만나교회 담임목사와 부교역자, 그리고 성도들을 돌보는 구역장들을 소개합니다. 말씀 사역과 구역 모임을 통해 섬기는 일꾼들입니다.',
  alternates: {
    canonical: '/about/servants',
  },
  openGraph: {
    title: '섬기는 사람들',
    description:
      '만나교회 담임목사와 부교역자, 그리고 성도들을 돌보는 구역장들을 소개합니다. 말씀 사역과 구역 모임을 통해 섬기는 일꾼들입니다.',
  },
};

export default function ServantsPage() {
  return (
    <MainWrapper
      heroBannerImage={SERVANTS_BANNER}
      heroBannerData={servantsData}
    >
      <ServantsContent />
    </MainWrapper>
  );
}
