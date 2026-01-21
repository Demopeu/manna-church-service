import { createClient } from '@repo/database/client';

export async function getMyProfile() {
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
    console.error('Error fetching profile:', error);
    return { name: null };
  }
}
