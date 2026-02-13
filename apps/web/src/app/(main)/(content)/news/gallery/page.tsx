import type { Metadata } from 'next';
import GALLERY_BANNER from '@/app/asset/hero-banner/gallery.webp';
import { GalleryList, galleryData } from '@/widgets/gallery-section';
import { MainWrapper } from '@/shared/ui';

export const metadata: Metadata = {
  title: '갤러리',
  description: '만나교회의 소중한 순간들을 사진으로 만나보세요.',
  alternates: {
    canonical: '/news/gallery',
  },
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
    page: sp.page || '1',
  }));

  return (
    <MainWrapper heroBannerImage={GALLERY_BANNER} heroBannerData={galleryData}>
      <GalleryList filterParams={filterParams} />
    </MainWrapper>
  );
}
