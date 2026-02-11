import type { Metadata } from 'next';
import { WorshipContent, worshipData } from '@/widgets/worship-section';
import { MainWrapper } from '@/shared/ui';

export const metadata: Metadata = {
  title: '예배 안내',
  description:
    '만나교회 예배 시간 안내입니다. 주일예배, 새벽기도회, 수요 저녁 기도회, 다음세대 예배 등 하나님과 만나는 거룩한 시간을 안내합니다.',
  openGraph: {
    title: '예배 안내',
    description:
      '만나교회 예배 시간 안내입니다. 주일예배, 새벽기도회, 수요 저녁 기도회, 다음세대 예배 등 하나님과 만나는 거룩한 시간을 안내합니다.',
  },
};

export default function WorshipPage() {
  return (
    <MainWrapper heroBannerData={worshipData}>
      <WorshipContent />
    </MainWrapper>
  );
}
