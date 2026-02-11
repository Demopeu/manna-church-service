import type { Metadata } from 'next';
import {
  MissionarySection,
  missionaryData,
} from '@/widgets/missionary-section';
import { MainWrapper } from '@/shared/ui';

export const metadata: Metadata = {
  title: '선교사 소개',
  description:
    '부산 만나교회 협력 선교 현황입니다. 땅끝까지 복음을 전하는 선교사님들의 사역을 소개하고 기도로 함께합니다.',
  alternates: {
    canonical: '/about/missionary',
  },
  openGraph: {
    title: '선교사 소개',
    description:
      '부산 만나교회 협력 선교 현황입니다. 땅끝까지 복음을 전하는 선교사님들의 사역을 소개하고 기도로 함께합니다.',
  },
};

export default function MissionaryPage() {
  return (
    <MainWrapper heroBannerData={missionaryData}>
      <MissionarySection />
    </MainWrapper>
  );
}
