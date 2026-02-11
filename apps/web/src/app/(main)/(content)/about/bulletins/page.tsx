import type { Metadata } from 'next';
import { BulletinList, bulletinsData } from '@/widgets/bulletins-section';
import { MainWrapper } from '@/shared/ui';

export const metadata: Metadata = {
  title: '주보',
  description: '만나교회 주보입니다. 매주 예배와 교회 소식을 전합니다.',
  openGraph: {
    title: '주보',
    description: '만나교회 주보입니다. 매주 예배와 교회 소식을 전합니다.',
  },
};

export default async function BulletinsPage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string; month?: string; page?: string }>;
}) {
  const filterParams = searchParams.then((sp) => ({
    year: sp.year && sp.year !== 'all' ? Number(sp.year) : 0,
    month: sp.month && sp.month !== 'all' ? Number(sp.month) : 0,
    page: sp.page ? Number(sp.page) : 1,
  }));
  return (
    <MainWrapper heroBannerData={bulletinsData}>
      <BulletinList filterParams={filterParams} />
    </MainWrapper>
  );
}
