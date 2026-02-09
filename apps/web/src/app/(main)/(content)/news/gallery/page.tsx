import { GalleryList, galleryData } from '@/widgets/gallery-section';
import { MainWrapper } from '@/shared/ui';

export default async function GalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; page?: string }>;
}) {
  const { query, page } = await searchParams;
  const currentQuery = query || '';
  const pageNum = page ? Number(page) : 1;

  return (
    <MainWrapper heroBannerData={galleryData}>
      <GalleryList
        key={`${currentQuery}-${pageNum}`}
        query={currentQuery}
        page={pageNum}
      />
    </MainWrapper>
  );
}
