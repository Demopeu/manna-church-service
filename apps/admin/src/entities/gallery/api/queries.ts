import { mapGallery, mapGalleryImage } from '../lib/mapper';
import type { GalleryDto, GalleryImageDto } from './dto';
import type { GalleryWithImages } from '../model/gallery';

const MOCK_GALLERY_IMAGES: GalleryImageDto[] = [
  {
    id: 'img-1',
    gallery_id: '1',
    storage_path: '/image.png',
    width: 1920,
    height: 1080,
    created_at: '2024-01-01T10:00:00Z',
  },
  {
    id: 'img-2',
    gallery_id: '1',
    storage_path: '/image.png',
    width: 1920,
    height: 1080,
    created_at: '2024-01-01T10:01:00Z',
  },
  {
    id: 'img-3',
    gallery_id: '1',
    storage_path: '/image.png',
    width: 1920,
    height: 1080,
    created_at: '2024-01-01T10:02:00Z',
  },
  {
    id: 'img-4',
    gallery_id: '2',
    storage_path: '/image.png',
    width: 1920,
    height: 1080,
    created_at: '2023-12-25T14:00:00Z',
  },
  {
    id: 'img-5',
    gallery_id: '2',
    storage_path: '/image.png',
    width: 1920,
    height: 1080,
    created_at: '2023-12-25T14:01:00Z',
  },
  {
    id: 'img-6',
    gallery_id: '3',
    storage_path: '/image.png',
    width: 1920,
    height: 1080,
    created_at: '2024-03-31T09:00:00Z',
  },
  {
    id: 'img-7',
    gallery_id: '3',
    storage_path: '/image.png',
    width: 1920,
    height: 1080,
    created_at: '2024-03-31T09:01:00Z',
  },
  {
    id: 'img-8',
    gallery_id: '3',
    storage_path: '/image.png',
    width: 1920,
    height: 1080,
    created_at: '2024-03-31T09:02:00Z',
  },
  {
    id: 'img-9',
    gallery_id: '3',
    storage_path: '/image.png',
    width: 1920,
    height: 1080,
    created_at: '2024-03-31T09:03:00Z',
  },
  {
    id: 'img-10',
    gallery_id: '4',
    storage_path: '/image.png',
    width: 1920,
    height: 1080,
    created_at: '2024-07-15T13:00:00Z',
  },
  {
    id: 'img-11',
    gallery_id: '4',
    storage_path: '/image.png',
    width: 1920,
    height: 1080,
    created_at: '2024-07-15T13:01:00Z',
  },
  {
    id: 'img-12',
    gallery_id: '4',
    storage_path: '/image.png',
    width: 1920,
    height: 1080,
    created_at: '2024-07-15T13:02:00Z',
  },
  {
    id: 'img-13',
    gallery_id: '5',
    storage_path: '/image.png',
    width: 1920,
    height: 1080,
    created_at: '2024-08-10T11:00:00Z',
  },
  {
    id: 'img-14',
    gallery_id: '5',
    storage_path: '/image.png',
    width: 1920,
    height: 1080,
    created_at: '2024-08-10T11:01:00Z',
  },
  {
    id: 'img-15',
    gallery_id: '6',
    storage_path: '/image.png',
    width: 1920,
    height: 1080,
    created_at: '2024-09-15T10:00:00Z',
  },
  {
    id: 'img-16',
    gallery_id: '6',
    storage_path: '/image.png',
    width: 1920,
    height: 1080,
    created_at: '2024-09-15T10:01:00Z',
  },
  {
    id: 'img-17',
    gallery_id: '6',
    storage_path: '/image.png',
    width: 1920,
    height: 1080,
    created_at: '2024-09-15T10:02:00Z',
  },
  {
    id: 'img-18',
    gallery_id: '7',
    storage_path: '/image.png',
    width: 1920,
    height: 1080,
    created_at: '2024-10-05T15:00:00Z',
  },
  {
    id: 'img-19',
    gallery_id: '7',
    storage_path: '/image.png',
    width: 1920,
    height: 1080,
    created_at: '2024-10-05T15:01:00Z',
  },
  {
    id: 'img-20',
    gallery_id: '8',
    storage_path: '/image.png',
    width: 1920,
    height: 1080,
    created_at: '2024-11-20T12:00:00Z',
  },
  {
    id: 'img-21',
    gallery_id: '8',
    storage_path: '/image.png',
    width: 1920,
    height: 1080,
    created_at: '2024-11-20T12:01:00Z',
  },
  {
    id: 'img-22',
    gallery_id: '8',
    storage_path: '/image.png',
    width: 1920,
    height: 1080,
    created_at: '2024-11-20T12:02:00Z',
  },
  {
    id: 'img-23',
    gallery_id: '9',
    storage_path: '/image.png',
    width: 1920,
    height: 1080,
    created_at: '2024-05-12T16:00:00Z',
  },
  {
    id: 'img-24',
    gallery_id: '10',
    storage_path: '/image.png',
    width: 1920,
    height: 1080,
    created_at: '2024-06-20T14:00:00Z',
  },
  {
    id: 'img-25',
    gallery_id: '10',
    storage_path: '/image.png',
    width: 1920,
    height: 1080,
    created_at: '2024-06-20T14:01:00Z',
  },
  {
    id: 'img-26',
    gallery_id: '11',
    storage_path: '/image.png',
    width: 1920,
    height: 1080,
    created_at: '2024-04-07T11:00:00Z',
  },
  {
    id: 'img-27',
    gallery_id: '11',
    storage_path: '/image.png',
    width: 1920,
    height: 1080,
    created_at: '2024-04-07T11:01:00Z',
  },
  {
    id: 'img-28',
    gallery_id: '11',
    storage_path: '/image.png',
    width: 1920,
    height: 1080,
    created_at: '2024-04-07T11:02:00Z',
  },
  {
    id: 'img-29',
    gallery_id: '12',
    storage_path: '/image.png',
    width: 1920,
    height: 1080,
    created_at: '2024-12-24T18:00:00Z',
  },
  {
    id: 'img-30',
    gallery_id: '12',
    storage_path: '/image.png',
    width: 1920,
    height: 1080,
    created_at: '2024-12-24T18:01:00Z',
  },
];

const MOCK_GALLERIES: GalleryDto[] = [
  {
    id: '1',
    title: '2024 신년 예배',
    event_date: '2024-01-01',
    thumbnail_url: '/image.png',
    created_at: '2024-01-01T10:00:00Z',
  },
  {
    id: '2',
    title: '성탄절 행사',
    event_date: '2023-12-25',
    thumbnail_url: '/image.png',
    created_at: '2023-12-25T14:00:00Z',
  },
  {
    id: '3',
    title: '부활절 연합예배',
    event_date: '2024-03-31',
    thumbnail_url: '/image.png',
    created_at: '2024-03-31T09:00:00Z',
  },
  {
    id: '4',
    title: '여름성경학교',
    event_date: '2024-07-15',
    thumbnail_url: '/image.png',
    created_at: '2024-07-15T13:00:00Z',
  },
  {
    id: '5',
    title: '청년부 수련회',
    event_date: '2024-08-10',
    thumbnail_url: '/image.png',
    created_at: '2024-08-10T11:00:00Z',
  },
  {
    id: '6',
    title: '추석 감사예배',
    event_date: '2024-09-15',
    thumbnail_url: '/image.png',
    created_at: '2024-09-15T10:00:00Z',
  },
  {
    id: '7',
    title: '교회창립기념일',
    event_date: '2024-10-05',
    thumbnail_url: '/image.png',
    created_at: '2024-10-05T15:00:00Z',
  },
  {
    id: '8',
    title: '추수감사절',
    event_date: '2024-11-20',
    thumbnail_url: '/image.png',
    created_at: '2024-11-20T12:00:00Z',
  },
  {
    id: '9',
    title: '어린이날 행사',
    event_date: '2024-05-12',
    thumbnail_url: '/image.png',
    created_at: '2024-05-12T16:00:00Z',
  },
  {
    id: '10',
    title: '단기선교 파송예배',
    event_date: '2024-06-20',
    thumbnail_url: '/image.png',
    created_at: '2024-06-20T14:00:00Z',
  },
  {
    id: '11',
    title: '사순절 특별새벽기도회',
    event_date: '2024-04-07',
    thumbnail_url: '/image.png',
    created_at: '2024-04-07T11:00:00Z',
  },
  {
    id: '12',
    title: '성탄절 칸타타',
    event_date: '2024-12-24',
    thumbnail_url: '/image.png',
    created_at: '2024-12-24T18:00:00Z',
  },
];

interface GetGalleriesParams {
  query?: string;
  page?: number;
  limit?: number;
}

interface GetGalleriesResult {
  galleries: GalleryWithImages[];
  totalPages: number;
}

export async function getGalleries({
  query = '',
  page = 1,
  limit = 10,
}: GetGalleriesParams = {}): Promise<GetGalleriesResult> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  let filteredGalleries = MOCK_GALLERIES;

  if (query) {
    const lowerQuery = query.toLowerCase();
    filteredGalleries = MOCK_GALLERIES.filter((gallery) =>
      gallery.title.toLowerCase().includes(lowerQuery),
    );
  }

  const totalPages = Math.ceil(filteredGalleries.length / limit);
  const startIdx = (page - 1) * limit;
  const endIdx = startIdx + limit;

  const paginatedGalleries = filteredGalleries.slice(startIdx, endIdx);

  const galleriesWithImages: GalleryWithImages[] = paginatedGalleries.map(
    (gallery) => {
      const images = MOCK_GALLERY_IMAGES.filter(
        (img) => img.gallery_id === gallery.id,
      ).map(mapGalleryImage);

      return {
        ...mapGallery(gallery),
        images,
      };
    },
  );

  return {
    galleries: galleriesWithImages,
    totalPages,
  };
}

export async function getLatestGallery(): Promise<GalleryWithImages | null> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const latest = MOCK_GALLERIES[0];
  if (!latest) return null;

  const images = MOCK_GALLERY_IMAGES.filter(
    (img) => img.gallery_id === latest.id,
  ).map(mapGalleryImage);

  return {
    ...mapGallery(latest),
    images,
  };
}

export async function getLatestGalleryImages() {
  const latest = await getLatestGallery();
  if (!latest) return [];
  return latest.images.slice(0, 3).map((img) => ({
    src: img.storagePath,
    alt: latest.title,
  }));
}
