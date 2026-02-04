import { cache } from 'react';
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
}

export const getGalleries = cache(
  async ({
    query = '',
    page = 1,
    limit = 10,
  }: GetGalleriesParams = {}): Promise<GetGalleriesResult> => {
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

    const totalPages = count ? Math.ceil(count / limit) : 0;

    const galleries: GalleryWithImages[] = (data || []).map((gallery) => {
      const images = (gallery.gallery_images || []).map(mapGalleryImage);
      return {
        ...mapGallery(gallery),
        images,
      };
    });

    return {
      galleries,
      totalPages,
    };
  },
);

export const getRecentGalleries = cache(
  async (): Promise<GalleryWithImages[]> => {
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
