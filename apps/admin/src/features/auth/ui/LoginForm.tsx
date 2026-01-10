'use client';

import { useLoginForm } from '../model/use-login-form';
import { Button } from '@/shared/Button';
import { Input } from '@/shared/Input';
import { Label } from '@/shared/Label';
import { Loader2 } from 'lucide-react';

export function LoginForm() {
  const { register, handleSubmit, errors, isSubmitting } = useLoginForm();

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username">아이디</Label>
        <Input
          id="username"
          placeholder="admin"
          variant={errors.username ? 'error' : 'default'}
          {...register('username')}
          disabled={isSubmitting}
        />
        {errors.username && (
          <p className="text-destructive text-sm">{errors.username.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">비밀번호</Label>
        <Input
          id="password"
          type="password"
          placeholder="admin"
          variant={errors.password ? 'error' : 'default'}
          {...register('password')}
          disabled={isSubmitting}
        />
        {errors.password && (
          <p className="text-destructive text-sm">{errors.password.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            로그인 중...
          </>
        ) : (
          '로그인'
        )}
      </Button>
    </form>
  );
}
