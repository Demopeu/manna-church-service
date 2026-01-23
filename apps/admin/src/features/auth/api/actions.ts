'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@repo/database/client';
import { tryCatchAction, tryCatchVoid } from '@/shared/api/try-catch-wrapper';
import { ActionState } from '@/shared/model';
import { LoginSchema, loginSchema } from '../model/schema';

export type LoginState = ActionState | null;

async function Login(data: LoginSchema): Promise<LoginState> {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  if (error) {
    console.error('Login Error:', error);
    return {
      success: false,
      message: '아이디(이메일) 또는 비밀번호가 잘못되었습니다.',
    };
  }
  return null;
}

async function logout() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Logout Error:', error);
    throw new Error('로그아웃에 실패했습니다.');
  }
}

export async function loginAction(
  _prevState: LoginState,
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

  const result = await tryCatchAction(() => Login(validated.data));

  if (result) {
    return result;
  }

  redirect('/');
}

export async function logoutAction(): Promise<void> {
  await tryCatchVoid(logout);

  redirect('/login');
}
