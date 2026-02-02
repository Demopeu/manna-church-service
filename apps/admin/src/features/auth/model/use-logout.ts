import * as Sentry from '@sentry/nextjs';
import { logoutAction } from '../api/actions';

export function useLogout() {
  const logout = async () => {
    try {
      await logoutAction();
    } catch (error) {
      Sentry.captureException(error);
      console.error('로그아웃 실패', error);
    }
  };

  return { logout };
}
