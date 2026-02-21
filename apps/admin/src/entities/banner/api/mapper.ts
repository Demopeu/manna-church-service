import type { BannerDto } from './dto';
import type { Banner } from '../model/banner';

export function mapBanner(dto: BannerDto): Banner {
  return {
    id: dto.id,
    title: dto.title,
    imageUrl: dto.image_url,
    sortOrder: dto.sort_order,
    createdAt: dto.created_at,
  };
}
