'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@repo/database/client';
import { ActionState } from '@/shared/model';
import { LoginSchema, loginSchema } from '../model/schema';

export type LoginState = ActionState | null;

export async function loginAction(
  prevState: LoginState,
  data: LoginSchema,
): Promise<LoginState> {
  const validated = loginSchema.safeParse(data);

  if (!validated.success) {
    console.error('Validation Error:', validated.error);
    return {
      success: false,
      message: '입력값이 올바르지 않습니다.',
      fieldErrors: validated.error.flatten().fieldErrors,
    };
  }
  try {
    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email: validated.data.email,
      password: validated.data.password,
    });

    if (error) {
      console.error('Login Error:', error);
      return {
        success: false,
        message: '아이디(이메일) 또는 비밀번호가 잘못되었습니다.',
      };
    }
  } catch (err) {
    console.error('System Error:', err);
    return {
      success: false,
      message: '일시적인 시스템 오류입니다. 잠시 후 다시 시도해주세요.',
    };
  }
  redirect('/');
}

export async function logoutAction(): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Logout Error:', error);
    throw new Error('로그아웃에 실패했습니다.');
  }

  redirect('/login');
}
