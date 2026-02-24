import type { MissionaryDto } from '../api/dto';
import type { Missionary } from '../model/missionary';

export function mapMissionary(dto: MissionaryDto): Missionary {
  return {
    id: dto.id,
    name: dto.name,
    country: dto.country,
    imageUrl: dto.image_url,
    description: dto.description || '',
    createdAt: dto.created_at,
  };
}
