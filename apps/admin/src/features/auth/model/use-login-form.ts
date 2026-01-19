import {
  startTransition,
  useActionState,
  useEffect,
  useEffectEvent,
} from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginState, loginAction } from './actions';
import { LoginSchema, loginSchema } from './schema';

export function useLoginForm() {
  const [state, action, isPending] = useActionState(loginAction, null);

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const handleError = useEffectEvent((currentState: LoginState) => {
    if (currentState && !currentState.success && currentState.message) {
      form.setError('root', {
        type: 'server',
        message: currentState.message,
      });
    }
  });

  useEffect(() => {
    handleError(state);
  }, [state]);

  const handleLogin = (data: LoginSchema) => {
    startTransition(() => {
      action(data);
    });
  };

  return {
    register: form.register,
    handleSubmit: form.handleSubmit(handleLogin),
    errors: form.formState.errors,
    isSubmitting: form.formState.isSubmitting || isPending,
  };
}
