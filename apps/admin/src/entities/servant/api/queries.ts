import { cache } from 'react';
import { createClient } from '@repo/database/client';
import type { Servant } from '../model/servant';
import { mapServant } from './mapper';

interface GetServantsParams {
  query?: string;
  role?: string;
  isPublic?: string;
  page?: number;
  limit?: number;
}

export const getServants = cache(
  async (
    params: GetServantsParams = {},
  ): Promise<{ servants: Servant[]; totalPages: number }> => {
    const {
      query = '',
      role = '',
      isPublic = '',
      page = 1,
      limit = 10,
    } = params;
    const supabase = await createClient();

    let queryBuilder = supabase
      .from('members')
      .select('*', { count: 'exact' })
      .order('sort_order', { ascending: true });

    if (query) {
      queryBuilder = queryBuilder.or(
        `name.ilike.%${query}%,role.ilike.%${query}%`,
      );
    }

    if (role) {
      queryBuilder = queryBuilder.eq('role', role);
    }

    if (isPublic === 'true') {
      queryBuilder = queryBuilder.eq('is_public', true);
    } else if (isPublic === 'false') {
      queryBuilder = queryBuilder.eq('is_public', false);
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await queryBuilder.range(from, to);

    if (error) {
      throw new Error(`Failed to fetch servants: ${error.message}`);
    }

    const totalPages = count ? Math.ceil(count / limit) : 0;

    return {
      servants: (data || []).map(mapServant),
      totalPages,
    };
  },
);

export const getServantById = cache(
  async (id: string): Promise<Servant | null> => {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('members')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Failed to fetch servant: ${error.message}`);
    }

    return data ? mapServant(data) : null;
  },
);
