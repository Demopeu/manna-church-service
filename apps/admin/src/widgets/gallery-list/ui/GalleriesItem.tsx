'use client';

import { DeleteGalleryButton, EditGalleryButton } from '@/features/gallery';
import { GalleryWithImages } from '@/entities/gallery';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui';
import { GalleriesImage } from './GalleriesImage';

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
        <GalleriesImage
          images={gallery.images}
          thumbnailUrl={gallery.thumbnailUrl}
          galleryTitle={gallery.title}
        />
      </CardContent>
    </Card>
  );
}
