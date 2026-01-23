import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: '이메일을 입력해주세요.' })
    .email({ message: '올바른 이메일 형식이 아닙니다.' }),

  password: z
    .string()
    .min(1, { message: '비밀번호를 입력해주세요.' })
    .regex(/^(?=.*[a-zA-Z])(?=.*[0-9])/, {
      message: '비밀번호는 영문과 숫자를 반드시 포함해야 합니다.',
    }),
});

export type LoginSchema = z.infer<typeof loginSchema>;
