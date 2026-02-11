'use cache';

import { cache } from 'react';
import { cacheLife, cacheTag } from 'next/cache';
import { createPublicClient } from '@repo/database/client';
import type { Banner } from '../model/banner';
import { mapBanner } from './mapper';

export const getBanners = cache(async (): Promise<Banner[]> => {
  cacheTag('banner-list');
  cacheLife('days');

  const supabase = createPublicClient();

  const { data, error } = await supabase
    .from('banners')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch banners: ${error.message}`);
  }

  return data.map(mapBanner) || [];
});
