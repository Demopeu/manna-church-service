import { Suspense } from 'react';
import { AlbumsList, GALLERY_UI } from '@/widgets/gallery-list';
import { CreateAlbumButton } from '@/features/gallery';
import { ListSkeleton } from '@/shared/ui';

export default async function GalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q, page } = await searchParams;

  const searchQuery = q || '';
  const currentPage = Math.max(1, Number(page) || 1);
  return (
    <div className="space-y-6">
      <CreateAlbumButton />
      <Suspense
        fallback={
          <ListSkeleton
            title={GALLERY_UI.TITLE}
            description={GALLERY_UI.DESCRIPTION}
          />
        }
      >
        <AlbumsList searchQuery={searchQuery} currentPage={currentPage} />
      </Suspense>
    </div>
  );
}
