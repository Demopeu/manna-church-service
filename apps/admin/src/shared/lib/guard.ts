import { verifySession } from '@repo/database/auth';
import { ActionState } from '@/shared/model';

export async function requireAuth(
  shouldThrow = false,
): Promise<ActionState | null> {
  const user = await verifySession();

  if (!user) {
    if (shouldThrow) {
      throw new Error('로그인이 필요합니다.');
    }

    return {
      success: false,
      message: '로그인이 필요합니다.',
    };
  }

  return null;
}
