import { DashboardCardWrapper } from './dashboard-card-wrapper';
import { Images } from 'lucide-react';
import { getLatestGalleryImages } from '@/entities/gallery';
import { GalleryItem } from './GalleryItem';
import { CardSkeleton } from './CardSkeleton';
import { CardError } from './CardError';
import { withAsyncBoundary } from '@/shared/ui';

async function GalleryCard() {
  const galleryItems = await getLatestGalleryImages();

  return (
    <DashboardCardWrapper title="최근 갤러리" icon={Images} href="/gallery">
      <div className="flex items-center gap-4">
        {galleryItems.map((item) => (
          <GalleryItem key={item.alt} src={item.src} alt={item.alt} />
        ))}
      </div>
    </DashboardCardWrapper>
  );
}

export const RecentGalleryCard = withAsyncBoundary(GalleryCard, {
  loadingFallback: <CardSkeleton title="최근 갤러리" icon={Images} />,
  errorFallback: <CardError title="최근 갤러리" />,
});
