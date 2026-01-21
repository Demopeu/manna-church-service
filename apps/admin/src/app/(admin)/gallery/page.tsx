import { AlbumsList } from '@/widgets/gallery-list';
import { CreateAlbumButton } from '@/features/gallery';

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
      <AlbumsList searchQuery={searchQuery} currentPage={currentPage} />
    </div>
  );
}
