import { cache } from 'react';
import * as Sentry from '@sentry/nextjs';
import { createClient } from '@repo/database/client';

export const getMyProfile = cache(async () => {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { name: null };
    }

    return { name: user.user_metadata || null };
  } catch (error) {
    Sentry.captureException(error);
    console.error('Error fetching profile:', error);
    return { name: null };
  }
});
