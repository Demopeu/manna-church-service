'use cache';

import { cache } from 'react';
import { cacheLife, cacheTag } from 'next/cache';
import { createPublicClient } from '@repo/database/client';
import type { GalleryListItem, GalleryWithImages } from '../model/gallery';
import { mapGallery, mapGalleryImage, mapGalleryWithCount } from './mapper';

interface GetGalleriesParams {
  query?: string;
  page?: number;
  limit?: number;
}

interface GetGalleriesResult {
  galleries: GalleryListItem[];
  totalPages: number;
  totalCount: number;
}

export const getGalleries = cache(
  async ({
    query = '',
    page = 1,
    limit = 9,
  }: GetGalleriesParams = {}): Promise<GetGalleriesResult> => {
    cacheTag('gallery-list');
    cacheLife('hours');

    const supabase = createPublicClient();

    let queryBuilder = supabase
      .from('galleries_with_count')
      .select('*', { count: 'exact' })
      .order('event_date', { ascending: false });

    if (query) {
      const sanitizedQuery = query.replace(/[,.()]/g, '');
      queryBuilder = queryBuilder.ilike('title', `%${sanitizedQuery}%`);
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await queryBuilder.range(from, to);

    if (error) {
      throw new Error(`Failed to fetch galleries: ${error.message}`);
    }

    const validCount = count ?? 0;

    const galleries: GalleryListItem[] = (data || []).map(mapGalleryWithCount);

    return {
      galleries,
      totalPages: Math.ceil(validCount / limit),
      totalCount: validCount,
    };
  },
);

export const getGalleryByShortId = cache(
  async (shortId: string): Promise<GalleryWithImages | null> => {
    cacheTag(`gallery-${shortId}`);
    cacheLife('days');

    if (!shortId) return null;

    const supabase = createPublicClient();

    const { data, error } = await supabase
      .from('galleries')
      .select('*, gallery_images(*)')
      .eq('short_id', shortId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        console.warn(`갤러리 ShortID ${shortId}를 찾을 수 없습니다.`);
        return null;
      }

      console.error('갤러리 상세 조회 중 Supabase 에러 발생:', error);
      throw new Error(
        `[갤러리 조회 실패] 서버 응답 오류입니다. (${error.message})`,
      );
    }

    if (!data) return null;

    const images = (data.gallery_images || []).map(mapGalleryImage);
    return {
      ...mapGallery(data),
      images,
    };
  },
);

export const getRecentGalleryShortIds = cache(
  async (limit: number = 10): Promise<{ id: string }[]> => {
    cacheTag('gallery-slugs');
    cacheLife('hours');

    const supabase = createPublicClient();

    const { data, error } = await supabase
      .from('galleries')
      .select('title, short_id')
      .order('event_date', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Failed to fetch gallery slugs: ${error.message}`);
    }

    return (data || []).map((item) => {
      const safeTitle = item.title
        .replace(/\s+/g, '-')
        .replace(/[^\wㄱ-ㅎ가-힣-]/g, '');

      return {
        id: `${safeTitle}-${item.short_id}`,
      };
    });
  },
);

export const getRecentGalleries = cache(
  async (): Promise<GalleryWithImages[]> => {
    cacheTag('gallery-recent');
    cacheLife('hours');
    const supabase = createPublicClient();

    const { data, error } = await supabase
      .from('galleries')
      .select('*, gallery_images(*)')
      .order('event_date', { ascending: false })
      .limit(4);

    if (error) {
      console.error(`Failed to fetch recent galleries: ${error.message}`);
      return [];
    }

    return (data || []).map((gallery) => {
      const images = (gallery.gallery_images || []).map(mapGalleryImage);
      return {
        ...mapGallery(gallery),
        images,
      };
    });
  },
);
