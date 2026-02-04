import type { GalleryDto, GalleryImageDto } from '../api/dto';
import type { Gallery, GalleryImage } from '../model/gallery';

export function mapGallery(dto: GalleryDto): Gallery {
  return {
    id: dto.id,
    title: dto.title,
    eventDate: dto.event_date,
    thumbnailUrl: dto.thumbnail_url,
    createdAt: dto.created_at,
  };
}

export function mapGalleryImage(dto: GalleryImageDto): GalleryImage {
  return {
    id: dto.id,
    galleryId: dto.gallery_id,
    storagePath: dto.storage_path,
    width: dto.width,
    height: dto.height,
    createdAt: dto.created_at,
  };
}
