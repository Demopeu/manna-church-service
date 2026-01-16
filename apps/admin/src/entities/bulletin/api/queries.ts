import type { Bulletin } from '../model/bulletin';
import type { BulletinDto } from './dto';
import { mapBulletin } from '../lib/mapper';

const MOCK_BULLETINS: BulletinDto[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    published_at: '2024-01-21',
    cover_image_url: 'https://example.com/cover1.webp',
    content_image_urls: [
      'https://example.com/page1.webp',
      'https://example.com/page2.webp',
    ],
    original_pdf_url: 'https://example.com/bulletin1.pdf',
    created_at: '2024-01-20T10:00:00Z',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    published_at: '2024-01-14',
    cover_image_url: 'https://example.com/cover2.webp',
    content_image_urls: [
      'https://example.com/page3.webp',
      'https://example.com/page4.webp',
    ],
    original_pdf_url: 'https://example.com/bulletin2.pdf',
    created_at: '2024-01-13T10:00:00Z',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    published_at: '2024-01-07',
    cover_image_url: 'https://example.com/cover3.webp',
    content_image_urls: [
      'https://example.com/page5.webp',
      'https://example.com/page6.webp',
    ],
    original_pdf_url: 'https://example.com/bulletin3.pdf',
    created_at: '2024-01-06T10:00:00Z',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440004',
    published_at: '2024-01-01',
    cover_image_url: 'https://example.com/cover4.webp',
    content_image_urls: [
      'https://example.com/page7.webp',
      'https://example.com/page8.webp',
    ],
    original_pdf_url: 'https://example.com/bulletin4.pdf',
    created_at: '2023-12-31T10:00:00Z',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440005',
    published_at: '2023-12-25',
    cover_image_url: 'https://example.com/cover5.webp',
    content_image_urls: [
      'https://example.com/page9.webp',
      'https://example.com/page10.webp',
    ],
    original_pdf_url: 'https://example.com/bulletin5.pdf',
    created_at: '2023-12-24T10:00:00Z',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440006',
    published_at: '2023-12-24',
    cover_image_url: 'https://example.com/cover6.webp',
    content_image_urls: [
      'https://example.com/page11.webp',
      'https://example.com/page12.webp',
    ],
    original_pdf_url: 'https://example.com/bulletin6.pdf',
    created_at: '2023-12-23T10:00:00Z',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440007',
    published_at: '2023-12-17',
    cover_image_url: 'https://example.com/cover7.webp',
    content_image_urls: [
      'https://example.com/page13.webp',
      'https://example.com/page14.webp',
    ],
    original_pdf_url: 'https://example.com/bulletin7.pdf',
    created_at: '2023-12-16T10:00:00Z',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440008',
    published_at: '2023-12-10',
    cover_image_url: 'https://example.com/cover8.webp',
    content_image_urls: [
      'https://example.com/page15.webp',
      'https://example.com/page16.webp',
    ],
    original_pdf_url: 'https://example.com/bulletin8.pdf',
    created_at: '2023-12-09T10:00:00Z',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440009',
    published_at: '2023-12-03',
    cover_image_url: 'https://example.com/cover9.webp',
    content_image_urls: [
      'https://example.com/page17.webp',
      'https://example.com/page18.webp',
    ],
    original_pdf_url: 'https://example.com/bulletin9.pdf',
    created_at: '2023-12-02T10:00:00Z',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440010',
    published_at: '2023-11-26',
    cover_image_url: 'https://example.com/cover10.webp',
    content_image_urls: [
      'https://example.com/page19.webp',
      'https://example.com/page20.webp',
    ],
    original_pdf_url: 'https://example.com/bulletin10.pdf',
    created_at: '2023-11-25T10:00:00Z',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440011',
    published_at: '2023-11-19',
    cover_image_url: 'https://example.com/cover11.webp',
    content_image_urls: [
      'https://example.com/page21.webp',
      'https://example.com/page22.webp',
    ],
    original_pdf_url: 'https://example.com/bulletin11.pdf',
    created_at: '2023-11-18T10:00:00Z',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440012',
    published_at: '2023-11-12',
    cover_image_url: 'https://example.com/cover12.webp',
    content_image_urls: [
      'https://example.com/page23.webp',
      'https://example.com/page24.webp',
    ],
    original_pdf_url: 'https://example.com/bulletin12.pdf',
    created_at: '2023-11-11T10:00:00Z',
  },
];

interface GetBulletinsParams {
  query: string;
  page: number;
  pageSize?: number;
}

export async function getBulletins({
  query,
  page,
  pageSize = 10,
}: GetBulletinsParams): Promise<{ bulletins: Bulletin[]; totalPages: number }> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  let filteredData = MOCK_BULLETINS;
  if (query) {
    const lowerQuery = query.toLowerCase();
    filteredData = MOCK_BULLETINS.filter((b) =>
      b.published_at.toLowerCase().includes(lowerQuery),
    );
  }
  const totalCount = filteredData.length;
  const from = (page - 1) * pageSize;
  const to = from + pageSize;
  const paginatedData = filteredData.slice(from, to);

  return {
    bulletins: paginatedData.map(mapBulletin),
    totalPages: Math.ceil(totalCount / pageSize),
  };
}

export async function getLatestBulletin(): Promise<Bulletin | null | boolean> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const latest = MOCK_BULLETINS[0];
  if (!latest) return null;
  return false;
}
