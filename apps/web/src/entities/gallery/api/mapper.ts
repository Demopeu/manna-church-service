import type {
  GalleryDto,
  GalleryImageDto,
  GalleryWithCountDto,
} from '../api/dto';
import type { Gallery, GalleryImage, GalleryListItem } from '../model/gallery';

export function mapGallery(dto: GalleryDto): Gallery {
  return {
    id: dto.id,
    shortId: dto.short_id,
    title: dto.title,
    eventDate: dto.event_date,
    thumbnailUrl: dto.thumbnail_url,
    createdAt: dto.created_at,
  };
}

export function mapGalleryWithCount(dto: GalleryWithCountDto): GalleryListItem {
  return {
    id: dto.id!,
    shortId: dto.short_id!,
    title: dto.title!,
    eventDate: dto.event_date!,
    thumbnailUrl: dto.thumbnail_url ?? null,
    createdAt: dto.created_at!,
    imagesCount: dto.images_count ?? 0,
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
