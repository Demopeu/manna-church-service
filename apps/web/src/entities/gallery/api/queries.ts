// 'use cache';
import { cache } from 'react';
// import { cacheLife, cacheTag } from 'next/cache';
import { createClient } from '@repo/database/client';
import type { GalleryWithImages } from '../model/gallery';
import { mapGallery, mapGalleryImage } from './mapper';

interface GetGalleriesParams {
  query?: string;
  page?: number;
  limit?: number;
}

interface GetGalleriesResult {
  galleries: GalleryWithImages[];
  totalPages: number;
  totalCount: number;
}

export const getGalleries = cache(
  async ({
    query = '',
    page = 1,
    limit = 10,
  }: GetGalleriesParams = {}): Promise<GetGalleriesResult> => {
    // cacheTag('gallery-list');
    // cacheLife('hours');

    const supabase = await createClient();

    let queryBuilder = supabase
      .from('galleries')
      .select('*, gallery_images(*)', { count: 'exact' })
      .order('event_date', { ascending: false });

    if (query) {
      queryBuilder = queryBuilder.ilike('title', `%${query}%`);
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await queryBuilder.range(from, to);

    if (error) {
      throw new Error(`Failed to fetch galleries: ${error.message}`);
    }

    const validCount = count ?? 0;

    const galleries: GalleryWithImages[] = (data || []).map((gallery) => {
      const images = (gallery.gallery_images || []).map(mapGalleryImage);
      return {
        ...mapGallery(gallery),
        images,
      };
    });

    return {
      galleries,
      totalPages: Math.ceil(validCount / limit),
      totalCount: validCount,
    };
  },
);

export const getGalleryByShortId = cache(
  async (shortId: string): Promise<GalleryWithImages | null> => {
    // cacheTag(`gallery-${shortId}`);
    // cacheLife('days');

    if (!shortId) return null;

    const supabase = await createClient();

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

export const getRecentGalleries = cache(
  async (): Promise<GalleryWithImages[]> => {
    // cacheTag('gallery-recent');
    // cacheLife('hours');
    const supabase = await createClient();

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
