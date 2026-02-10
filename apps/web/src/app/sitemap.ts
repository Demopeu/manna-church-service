import type { MetadataRoute } from 'next';

import { BASE_URL } from '@/shared/config/metadata';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = BASE_URL;

  // --- Static Routes ---
  const staticRoutes: MetadataRoute.Sitemap = [
    // Priority 1.0 — 홈
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },

    // Priority 0.8 — 교회 소개 메인 섹션
    {
      url: `${baseUrl}/about/intro`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about/worship`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about/servants`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about/location`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.8,
    },

    // Priority 0.7 — 소식 섹션 리스트
    {
      url: `${baseUrl}/news/announcements`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/news/events`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/news/gallery`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },

    // Priority 0.5 — 서브 페이지
    {
      url: `${baseUrl}/about/bulletins`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/about/missionary`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // --- Dynamic Routes ---
  // TODO: API 연결 필요 — 주보 상세 페이지
  // const bulletinDates = await fetchBulletinDates();
  // const bulletinRoutes: MetadataRoute.Sitemap = bulletinDates.map((date) => ({
  //   url: `${baseUrl}/about/bulletins/${date}`,
  //   lastModified: new Date(date),
  //   changeFrequency: 'weekly' as const,
  //   priority: 0.4,
  // }));

  // TODO: API 연결 필요 — 공지사항 상세 페이지
  // const announcements = await fetchAnnouncements();
  // const announcementRoutes: MetadataRoute.Sitemap = announcements.map((item) => ({
  //   url: `${baseUrl}/news/announcements/${item.id}`,
  //   lastModified: new Date(item.updatedAt),
  //   changeFrequency: 'monthly' as const,
  //   priority: 0.4,
  // }));

  // TODO: API 연결 필요 — 이벤트 상세 페이지
  // const events = await fetchEvents();
  // const eventRoutes: MetadataRoute.Sitemap = events.map((item) => ({
  //   url: `${baseUrl}/news/events/${item.id}`,
  //   lastModified: new Date(item.updatedAt),
  //   changeFrequency: 'monthly' as const,
  //   priority: 0.4,
  // }));

  // TODO: API 연결 필요 — 갤러리 상세 페이지
  // const galleries = await fetchGalleries();
  // const galleryRoutes: MetadataRoute.Sitemap = galleries.map((item) => ({
  //   url: `${baseUrl}/news/gallery/${item.id}`,
  //   lastModified: new Date(item.updatedAt),
  //   changeFrequency: 'monthly' as const,
  //   priority: 0.4,
  // }));

  return [
    ...staticRoutes,
    // ...bulletinRoutes,
    // ...announcementRoutes,
    // ...eventRoutes,
    // ...galleryRoutes,
  ];
}
