import { logoutAction } from './actions';

export function useLogout() {
  const logout = async () => {
    try {
      await logoutAction();
    } catch (error) {
      console.error('로그아웃 실패', error);
    }
  };

  return { logout };
}
