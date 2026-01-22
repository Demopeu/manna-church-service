'use client';

import Image from 'next/image';
import { Star } from 'lucide-react';
import { DeleteGalleryButton, EditGalleryButton } from '@/features/gallery';
import { GalleryWithImages } from '@/entities/gallery';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui';

interface Props {
  gallery: GalleryWithImages;
}

export function GalleriesItem({ gallery }: Props) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base">{gallery.title}</CardTitle>
            <CardDescription>
              {gallery.eventDate} • {gallery.images.length}장
            </CardDescription>
          </div>
          <div className="flex gap-1">
            <EditGalleryButton gallery={gallery} />
            <DeleteGalleryButton
              galleryId={gallery.id}
              galleryTitle={gallery.title}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-2">
          {gallery.images.slice(0, 4).map((image, index) => (
            <div key={image.id} className="relative">
              <div className="relative aspect-square w-full">
                <Image
                  src={image.storagePath}
                  alt={`${gallery.title} ${index + 1}`}
                  fill
                  className={`rounded-lg border-2 object-cover ${index === 0 ? 'border-primary' : 'border-transparent'}`}
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
        {gallery.images.length > 4 && (
          <p className="text-muted-foreground mt-2 text-sm">
            +{gallery.images.length - 4}장 더 보기
          </p>
        )}
      </CardContent>
    </Card>
  );
}
