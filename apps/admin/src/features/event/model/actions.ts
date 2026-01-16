'use server';

import { createEventSchema } from './schema';
import { ActionState } from '@/shared/model';
import { revalidatePath } from 'next/cache';

export async function createEventAction(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const rawData = {
    title: formData.get('title'),
    description: formData.get('description'),
    startDate: formData.get('startDate'),
    photoFile: formData.get('photoFile'),
  };

  const validatedFields = createEventSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      message: '입력 내용을 확인해주세요.',
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  console.log('✅ 서버 액션 성공:', validatedFields.data);

  revalidatePath('/events');

  return {
    success: true,
    message: '이벤트가 성공적으로 등록되었습니다.',
  };
}

export async function updateEventAction(
  id: string,
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const rawData = {
    title: formData.get('title'),
    description: formData.get('description'),
    startDate: formData.get('startDate'),
    photoFile: formData.get('photoFile'),
  };

  const validatedFields = createEventSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      message: '입력 내용을 확인해주세요.',
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  console.log(`📝 이벤트 수정 완료 (${id}):`, validatedFields.data);

  revalidatePath('/events');

  return {
    success: true,
    message: '이벤트가 수정되었습니다.',
  };
}
