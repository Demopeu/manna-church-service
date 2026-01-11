import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { loginSchema, LoginSchema } from './login-schema';

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
      alert('아이디 비번 틀림');
    }
  };

  return {
    register: form.register,
    handleSubmit: form.handleSubmit(handleLogin),
    errors: form.formState.errors,
    isSubmitting: form.formState.isSubmitting,
  };
}
