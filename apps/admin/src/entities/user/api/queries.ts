'use server';

import { createClient } from '@repo/database/client';

export async function getMyProfile() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { name: null };
  }

  return { name: user.user_metadata || null };
}
