import { cache } from 'react';
import { createClient } from '@repo/database/client';
import type { Servant } from '../model/servant';
import { mapServant } from './mapper';

export const getAllServants = cache(async (): Promise<Servant[]> => {
  const supabase = await createClient();

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
