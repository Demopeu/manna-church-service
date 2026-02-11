import type { MetadataRoute } from 'next';
import { getRecentAnnouncementShortIds } from '@/entities/announcement';
import { getRecentBulletinDates } from '@/entities/bulletin';
import { getRecentEventShortIds } from '@/entities/event';
import { getRecentGalleryShortIds } from '@/entities/gallery';
import { BASE_URL } from '@/shared/config';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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
  const [bulletinDates, announcementIds, eventIds, galleryIds] =
    await Promise.all([
      getRecentBulletinDates(50).catch(() => []),
      getRecentAnnouncementShortIds(100).catch(() => []),
      getRecentEventShortIds(50).catch(() => []),
      getRecentGalleryShortIds(50).catch(() => []),
    ]);

  const bulletinRoutes: MetadataRoute.Sitemap = bulletinDates.map((item) => ({
    url: `${baseUrl}/about/bulletins/${item.date}`,
    lastModified: new Date(item.date),
    changeFrequency: 'weekly' as const,
    priority: 0.4,
  }));

  const announcementRoutes: MetadataRoute.Sitemap = announcementIds.map(
    (item) => ({
      url: `${baseUrl}/news/announcements/${item.id}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.4,
    }),
  );

  const eventRoutes: MetadataRoute.Sitemap = eventIds.map((item) => ({
    url: `${baseUrl}/news/events/${item.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.4,
  }));

  const galleryRoutes: MetadataRoute.Sitemap = galleryIds.map((item) => ({
    url: `${baseUrl}/news/gallery/${item.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.4,
  }));

  return [
    ...staticRoutes,
    ...bulletinRoutes,
    ...announcementRoutes,
    ...eventRoutes,
    ...galleryRoutes,
  ];
}
