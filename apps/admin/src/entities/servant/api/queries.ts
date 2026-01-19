import { mapServant } from '../lib/mapper';
import type { Servant } from '../model/servant';
import type { ServantDto } from './dto';

const MOCK_SERVANTS: ServantDto[] = [
  {
    id: '1',
    name: '김목사',
    role: '담임목사',
    photo_url: '/DEFAULT_USER.png',
    contact: '010-1234-5678',
    introduction: '담임 목회, 주일 예배 설교',
    is_public: true,
    sort_order: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: '이목사',
    role: '목사',
    photo_url: '/DEFAULT_USER.png',
    contact: '010-2345-6789',
    introduction: '교육 담당',
    is_public: true,
    sort_order: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    name: '박구역장',
    role: '구역장',
    photo_url: '/DEFAULT_USER.png',
    contact: '',
    introduction: '1구역 담당',
    is_public: false,
    sort_order: 3,
    created_at: new Date().toISOString(),
  },
  {
    id: '4',
    name: '최구역장',
    role: '구역장',
    photo_url: '/DEFAULT_USER.png',
    contact: '010-3456-7890',
    introduction: '2구역 담당',
    is_public: true,
    sort_order: 4,
    created_at: new Date().toISOString(),
  },
];

interface GetServantsParams {
  query?: string;
  role?: string;
  isPublic?: string;
  page?: number;
  limit?: number;
}

export async function getServants(
  params: GetServantsParams = {},
): Promise<{ servants: Servant[]; totalPages: number }> {
  const { query = '', role = '', isPublic = '', page = 1, limit = 10 } = params;

  let filtered = [...MOCK_SERVANTS];

  if (query) {
    const lowercaseQuery = query.toLowerCase();
    filtered = filtered.filter(
      (s) =>
        s.name.toLowerCase().includes(lowercaseQuery) ||
        s.role.toLowerCase().includes(lowercaseQuery),
    );
  }

  if (role) {
    filtered = filtered.filter((s) => s.role === role);
  }

  if (isPublic === 'true') {
    filtered = filtered.filter((s) => s.is_public === true);
  } else if (isPublic === 'false') {
    filtered = filtered.filter((s) => s.is_public === false);
  }

  filtered.sort((a, b) => a.sort_order - b.sort_order);

  const totalPages = Math.ceil(filtered.length / limit);
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginatedServants = filtered.slice(start, end);

  return {
    servants: paginatedServants.map(mapServant),
    totalPages,
  };
}

export async function getServantById(id: string): Promise<Servant | null> {
  const servant = MOCK_SERVANTS.find((s) => s.id === id);
  return servant ? mapServant(servant) : null;
}
