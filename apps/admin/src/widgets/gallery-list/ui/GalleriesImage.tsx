'use client';

import Image from 'next/image';
import { Star } from 'lucide-react';
import { GalleryImage } from '@/entities/gallery';
import { MultiImageDialog } from '@/shared/ui';

interface Props {
  images: GalleryImage[];
  thumbnailUrl: string | null;
  galleryTitle: string;
}

export function GalleriesImage({ images, thumbnailUrl, galleryTitle }: Props) {
  const sortedImages = [...images].sort((a, b) => {
    if (thumbnailUrl) {
      if (a.storagePath === thumbnailUrl) return -1;
      if (b.storagePath === thumbnailUrl) return 1;
    }
    return 0;
  });

  return (
    <MultiImageDialog
      images={sortedImages.map((img) => img.storagePath)}
      title={`${galleryTitle} 갤러리`}
    >
      <div className="cursor-pointer">
        <div className="grid grid-cols-4 gap-2">
          {sortedImages.slice(0, 4).map((image, index) => (
            <div key={image.id} className="relative">
              <div className="relative aspect-square w-full">
                <Image
                  src={image.storagePath}
                  alt={`${galleryTitle} ${index + 1}`}
                  fill
                  className={`rounded-lg border-2 object-cover ${index === 0 ? 'border-primary' : 'border-transparent'}`}
                  sizes="(max-width: 640px) 25vw, (max-width: 768px) 20vw, 150px"
                  unoptimized
                />
              </div>
              {index === 0 && (
                <div className="bg-primary absolute top-1 left-1 flex h-5 w-5 items-center justify-center rounded">
                  <Star className="text-primary-foreground h-2.5 w-2.5 fill-current" />
                </div>
              )}
            </div>
          ))}
        </div>
        {images.length > 4 && (
          <p className="text-muted-foreground mt-2 text-sm">
            +{images.length - 4}장 더 보기
          </p>
        )}
      </div>
    </MultiImageDialog>
  );
}
