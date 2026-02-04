import { cache } from 'react';
import { createClient } from '@repo/database/client';
import type { Banner } from '../model/banner';
import { mapBanner } from './mapper';

export const getBanners = cache(async (): Promise<Banner[]> => {
  const supabase = await createClient();

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
