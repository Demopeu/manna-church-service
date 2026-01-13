import { DashboardCardWrapper } from './dashboard-card-wrapper';
import { Images } from 'lucide-react';
import Image from 'next/image';

export function RecentGalleryCard() {
  const galleryItems = [
    { src: '/image.png', alt: '최근 갤러리 1' },
    { src: '/image.png', alt: '최근 갤러리 2' },
    { src: '/image.png', alt: '최근 갤러리 3' },
  ];

  return (
    <DashboardCardWrapper title="최근 갤러리" icon={Images} href="/gallery">
      <div className="flex items-center gap-4">
        <div className="grid flex-1 grid-cols-3 gap-2">
          {galleryItems.map((item) => (
            <div
              key={item.alt}
              className="relative aspect-square w-full overflow-hidden rounded-lg"
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(max-width: 768px) 33vw, 160px"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </DashboardCardWrapper>
  );
}
