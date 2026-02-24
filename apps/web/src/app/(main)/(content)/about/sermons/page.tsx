import type { Metadata } from 'next';
import SERMONS_BANNER from '@/app/asset/hero-banner/sermons.webp';
import { SermonList, sermonsData } from '@/widgets/sermons-section';
import { MainWrapper } from '@/shared/ui';

export const metadata: Metadata = {
  title: '1분 메시지',
  description:
    '만나교회 설교 영상을 압축한 1분 메시지입니다. 말씀을 통해 은혜와 감동을 나눕니다.',
  alternates: {
    canonical: '/about/sermons',
  },
  openGraph: {
    title: '1분 메시지',
    description:
      '만나교회 설교 영상을 압축한 1분 메시지입니다. 말씀을 통해 은혜와 감동을 나눕니다.',
  },
};

export default async function SermonsPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; page?: string }>;
}) {
  const filterParams = searchParams.then((sp) => ({
    query: sp.query || '',
    page: sp.page ? Number(sp.page) : 1,
  }));

  return (
    <MainWrapper heroBannerImage={SERMONS_BANNER} heroBannerData={sermonsData}>
      <SermonList filterParams={filterParams} />
    </MainWrapper>
  );
}
