import type { ServantDto } from '../api/dto';
import type { Servant } from '../model/servant';

export function mapServant(dto: ServantDto): Servant {
  return {
    id: dto.id,
    name: dto.name,
    role: dto.role,
    photoFile: dto.photo_url || '',
    contact: dto.contact || '',
    introduction: dto.introduction || '',
    isPublic: dto.is_public,
    sortOrder: dto.sort_order,
    createdAt: dto.created_at,
  };
}
