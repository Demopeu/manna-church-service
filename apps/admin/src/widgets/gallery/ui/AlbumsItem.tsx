import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui';
import { EditAlbumButton, DeleteAlbumButton } from '@/features/album';
import type { GalleryImage } from '@/features/album';
import { Star } from 'lucide-react';
import { cn } from '@repo/ui/lib';
import Image from 'next/image';

interface Props {
  id: string;
  title: string;
  date: string;
  images: GalleryImage[];
  onEdit: () => void;
}

export function AlbumsItem({ id, title, date, images, onEdit }: Props) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base">{title}</CardTitle>
            <CardDescription>
              {date} • {images.length}장
            </CardDescription>
          </div>
          <div className="flex gap-1">
            <EditAlbumButton onEdit={onEdit} />
            <DeleteAlbumButton albumId={id} albumTitle={title} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-2">
          {images.slice(0, 4).map((image, index) => (
            <div key={image.id} className="relative">
              <div className="relative aspect-square w-full">
                <Image
                  src={image.url}
                  alt={`${title} ${index + 1}`}
                  fill
                  className={cn(
                    'rounded-lg border-2 object-cover',
                    image.isThumbnail ? 'border-primary' : 'border-transparent',
                  )}
                />
              </div>
              {image.isThumbnail && (
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
      </CardContent>
    </Card>
  );
}
