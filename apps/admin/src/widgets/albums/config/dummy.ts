import type { GalleryImage } from '@/features/album';

export interface Album {
  id: string;
  title: string;
  date: string;
  images: GalleryImage[];
}

export const mockAlbums: Album[] = [
  {
    id: '1',
    title: '2024 신년 예배',
    date: '2024-01-01',
    images: [
      { id: '1', url: '/image.png', isThumbnail: true },
      { id: '2', url: '/image.png', isThumbnail: false },
      { id: '3', url: '/image.png', isThumbnail: false },
    ],
  },
  {
    id: '2',
    title: '성탄절 행사',
    date: '2023-12-25',
    images: [
      { id: '4', url: '/image.png', isThumbnail: true },
      { id: '5', url: '/image.png', isThumbnail: false },
    ],
  },
];
