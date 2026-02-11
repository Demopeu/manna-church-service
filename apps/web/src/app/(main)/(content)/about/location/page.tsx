import type { Metadata } from 'next';
import { LocationContent, locationData } from '@/widgets/location-section';
import { MainWrapper } from '@/shared/ui';

export const metadata: Metadata = {
  title: '오시는 길',
  description:
    '부산 사하구 다대로429번길 23 (다대동). 1호선 낫개역 4번 출구 도보 3분. 교회 옆 하나돈까스 앞 주차장 이용 가능합니다.',
  openGraph: {
    title: '만나교회 오시는 길',
    description:
      '부산 사하구 다대로429번길 23. (1호선 낫개역 4번 출구 3분 거리)',
    images: [{ url: '/map_preview.png' }],
  },
};

export default function LocationPage() {
  return (
    <MainWrapper heroBannerData={locationData}>
      <LocationContent />
    </MainWrapper>
  );
}
