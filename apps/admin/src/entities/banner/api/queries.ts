import { cache } from 'react';
import { createClient } from '@repo/database/client';
import type { Banner } from '../model/banner';
import { mapBanner } from './mapper';

export const getBanners = cache(async (): Promise<Banner[]> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('banners')
    .select('*')
    .order('sort_order', { ascending: true, nullsFirst: false });

  if (error) {
    throw new Error(`배너 조회 실패: ${error.message}`);
  }

  return (data || []).map(mapBanner);
});
