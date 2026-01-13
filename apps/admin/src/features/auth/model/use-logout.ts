import { useRouter } from 'next/navigation';

export function useLogout() {
  const router = useRouter();

  const logout = async () => {
    try {
      console.log('로그아웃 로직 실행...');
      router.push('/login');
    } catch (error) {
      console.error('로그아웃 실패', error);
    }
  };

  return { logout };
}
