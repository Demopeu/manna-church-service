import type { Metadata } from 'next';
import { GalleryList, galleryData } from '@/widgets/gallery-section';
import { MainWrapper } from '@/shared/ui';

export const metadata: Metadata = {
  title: '갤러리',
  description: '만나교회의 소중한 순간들을 사진으로 만나보세요.',
  openGraph: {
    title: '갤러리',
    description: '만나교회의 소중한 순간들을 사진으로 만나보세요.',
    images: [{ url: '/hero-banner/gallery.webp' }],
  },
};

export default async function GalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; page?: string }>;
}) {
  const filterParams = searchParams.then((sp) => ({
    query: sp.query || '',
    page: sp.page ? Number(sp.page) : 1,
  }));

  return (
    <MainWrapper heroBannerData={galleryData}>
      <GalleryList filterParams={filterParams} />
    </MainWrapper>
  );
}
