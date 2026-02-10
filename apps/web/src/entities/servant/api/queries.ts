// 'use cache';
import { cache } from 'react';
// import { cacheLife, cacheTag } from 'next/cache';
import { createPublicClient } from '@repo/database/client';
import type { Servant } from '../model/servant';
import { mapServant } from './mapper';

export const getAllServants = cache(async (): Promise<Servant[]> => {
  // cacheTag('servant-list');
  // cacheLife('days');

  const supabase = createPublicClient();

  const { data, error } = await supabase
    .from('members')
    .select('*')
    .eq('is_public', true)
    .order('sort_order', { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch servants: ${error.message}`);
  }

  return (data || []).map(mapServant);
});
