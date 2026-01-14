import { AlbumsList } from '@/widgets/albums';
import { CreateAlbumButton } from '@/features/album';

export default function GalleryPage() {
  return (
    <div className="space-y-6">
      <CreateAlbumButton />
      <AlbumsList />
    </div>
  );
}
