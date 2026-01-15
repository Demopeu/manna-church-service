import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { loginSchema, LoginSchema } from './schema';

export function useLoginForm() {
  const router = useRouter();

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),

    defaultValues: {
      username: '',
      password: '',
    },
  });

  // 나중에 api
  const handleLogin = (data: LoginSchema) => {
    if (data.username === 'admin' && data.password === '1234') {
      router.push('/');
    } else {
      form.setError('root', {
        type: 'manual',
        message: '아이디 또는 비밀번호가 일치하지 않습니다.',
      });
    }
  };

  return {
    register: form.register,
    handleSubmit: form.handleSubmit(handleLogin),
    errors: form.formState.errors,
    isSubmitting: form.formState.isSubmitting,
  };
}
