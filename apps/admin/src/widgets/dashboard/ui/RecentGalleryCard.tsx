import Image from 'next/image';
import { Images } from 'lucide-react';
import { getLatestGallery } from '@/entities/gallery';
import { withAsyncBoundary } from '@/shared/ui';
import { CardError } from './CardError';
import { CardSkeleton } from './CardSkeleton';
import { DashboardCardWrapper } from './dashboard-card-wrapper';

async function GalleryCard() {
  const data = await getLatestGallery();

  if (!data) {
    return (
      <DashboardCardWrapper title="최근 갤러리" icon={Images} href="/gallery">
        <div className="text-muted-foreground flex h-full min-h-[60px] items-center justify-center text-sm">
          등록된 사진이 없습니다.
        </div>
      </DashboardCardWrapper>
    );
  }

  const displayImages = data.images.slice(0, 3);

  return (
    <DashboardCardWrapper title="최근 갤러리" icon={Images} href="/gallery">
      <div className="space-y-2">
        <h3 className="pb-2 font-medium">{data.title}</h3>
        <div className="grid grid-cols-3 gap-2">
          {displayImages.map((image) => (
            <div key={image.id} className="relative aspect-square">
              <Image
                src={image.storagePath}
                alt={data.title}
                fill
                className="rounded object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </DashboardCardWrapper>
  );
}

export const RecentGalleryCard = withAsyncBoundary(GalleryCard, {
  loadingFallback: <CardSkeleton title="최근 갤러리" icon={Images} />,
  errorFallback: <CardError title="최근 갤러리" />,
});
