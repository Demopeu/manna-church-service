import type { Sermon } from '../model/sermon';
import type { SermonDto } from './dto';
import { mapSermon } from '../lib/mapper';

const MOCK_SERMONS: SermonDto[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    title: '고난 속에 피어나는 소망',
    preacher: '김목사',
    preached_at: '2024-01-21',
    video_url: 'https://youtu.be/dummy1',
    created_at: '2024-01-21T10:00:00Z',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    title: '믿음으로 건너는 요단강',
    preacher: '이목사',
    preached_at: '2024-01-14',
    video_url: 'https://youtu.be/dummy2',
    created_at: '2024-01-14T10:00:00Z',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    title: '은혜의 보좌 앞으로',
    preacher: '김목사',
    preached_at: '2024-01-07',
    video_url: 'https://youtu.be/dummy3',
    created_at: '2024-01-07T10:00:00Z',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440004',
    title: '새해를 여는 기도',
    preacher: '김목사',
    preached_at: '2024-01-01',
    video_url: 'https://youtu.be/dummy4',
    created_at: '2024-01-01T10:00:00Z',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440005',
    title: '성탄의 참된 의미',
    preacher: '박목사',
    preached_at: '2023-12-25',
    video_url: 'https://youtu.be/dummy5',
    created_at: '2023-12-25T10:00:00Z',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440006',
    title: '감사를 잊지 않는 삶',
    preacher: '이목사',
    preached_at: '2023-12-24',
    video_url: 'https://youtu.be/dummy6',
    created_at: '2023-12-24T10:00:00Z',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440007',
    title: '광야에서 만나는 하나님',
    preacher: '김목사',
    preached_at: '2023-12-17',
    video_url: 'https://youtu.be/dummy7',
    created_at: '2023-12-17T10:00:00Z',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440008',
    title: '사랑은 실패하지 않는다',
    preacher: '김목사',
    preached_at: '2023-12-10',
    video_url: 'https://youtu.be/dummy8',
    created_at: '2023-12-10T10:00:00Z',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440009',
    title: '두려워하지 말라',
    preacher: '박목사',
    preached_at: '2023-12-03',
    video_url: 'https://youtu.be/dummy9',
    created_at: '2023-12-03T10:00:00Z',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440010',
    title: '다시 일어설 힘',
    preacher: '이목사',
    preached_at: '2023-11-26',
    video_url: 'https://youtu.be/dummy10',
    created_at: '2023-11-26T10:00:00Z',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440011',
    title: '기쁨의 비밀',
    preacher: '김목사',
    preached_at: '2023-11-19',
    video_url: 'https://youtu.be/dummy11',
    created_at: '2023-11-19T10:00:00Z',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440012',
    title: '좁은 길을 걸으며',
    preacher: '김목사',
    preached_at: '2023-11-12',
    video_url: 'https://youtu.be/dummy12',
    created_at: '2023-11-12T10:00:00Z',
  },
];

interface GetSermonsParams {
  query: string;
  page: number;
  pageSize?: number;
}

export async function getSermons({
  query,
  page,
  pageSize = 10,
}: GetSermonsParams): Promise<{ sermons: Sermon[]; totalPages: number }> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  let filteredData = MOCK_SERMONS;
  if (query) {
    const lowerQuery = query.toLowerCase();
    filteredData = MOCK_SERMONS.filter(
      (s) =>
        s.title.toLowerCase().includes(lowerQuery) ||
        s.preacher.toLowerCase().includes(lowerQuery),
    );
  }
  const totalCount = filteredData.length;
  const from = (page - 1) * pageSize;
  const to = from + pageSize;
  const paginatedData = filteredData.slice(from, to);

  return {
    sermons: paginatedData.map(mapSermon),
    totalPages: Math.ceil(totalCount / pageSize),
  };
}

export async function getLatestSermon(): Promise<Sermon | null> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const latest = MOCK_SERMONS[0];
  if (!latest) return null;
  return mapSermon(latest);
}
