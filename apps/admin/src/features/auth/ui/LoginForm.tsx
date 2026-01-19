'use client';

import { Loader2 } from 'lucide-react';
import { Button, Input, Label } from '@/shared/ui';
import { LOGIN_FORM_FIELDS } from '../config/form-fields';
import { useLoginForm } from '../model/use-login-form';

export function LoginForm() {
  const { register, handleSubmit, errors, isSubmitting } = useLoginForm();

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {LOGIN_FORM_FIELDS.map((field) => (
        <div key={field.id} className="space-y-2">
          <Label htmlFor={field.id}>{field.label}</Label>
          <Input
            id={field.id}
            type={field.type}
            placeholder={field.placeholder}
            variant={errors.root ? 'error' : 'default'}
            {...register(field.id)}
            disabled={isSubmitting}
          />
        </div>
      ))}

      {errors.root && (
        <p className="text-destructive text-center text-sm">
          아이디 또는 비밀번호 오류
        </p>
      )}

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
