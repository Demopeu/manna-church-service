import type { BulletinDto } from '../api/dto';
import type { Bulletin } from '../model/bulletin';

export function mapBulletin(dto: BulletinDto): Bulletin {
  return {
    id: dto.id,
    publishedAt: dto.published_at,
    coverImageUrl: dto.cover_image_url || '',
    contentImageUrls: dto.content_image_urls,
    originalPdfUrl: dto.original_pdf_url || '',
    createdAt: dto.created_at,
  };
}
