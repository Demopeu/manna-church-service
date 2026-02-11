import { GalleryList, galleryData } from '@/widgets/gallery-section';
import { MainWrapper } from '@/shared/ui';

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
