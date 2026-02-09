'use cache';

import { cache } from 'react';
import { cacheLife, cacheTag } from 'next/cache';
import { createClient } from '@repo/database/client';
import type { Missionary } from '../model/missionary';
import { mapMissionary } from './mapper';

export const getAllMissionaries = cache(async (): Promise<Missionary[]> => {
  cacheTag('missionary-list');
  cacheLife('days');

  const supabase = await createClient();

  const { data, error } = await supabase
    .from('missionaries')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch all missionaries: ${error.message}`);
  }

  return (data || []).map(mapMissionary);
});
