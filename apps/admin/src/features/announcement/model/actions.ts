'use server';

import { revalidatePath } from 'next/cache';
import { ActionState } from '@/shared/model';
import { createAnnouncementSchema } from './schema';

export async function createAnnouncementAction(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const rawData = {
    title: formData.get('title'),
    content: formData.get('content'),
    isUrgent: formData.get('isUrgent') === 'true',
  };

  const validatedFields = createAnnouncementSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      message: '입력 내용을 확인해주세요.',
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  console.log('✅ 서버 액션 성공:', validatedFields.data);

  revalidatePath('/announcements');

  return {
    success: true,
    message: '공지사항이 성공적으로 등록되었습니다.',
  };
}

export async function updateAnnouncementAction(
  id: string,
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const rawData = {
    title: formData.get('title'),
    content: formData.get('content'),
    isUrgent: formData.get('isUrgent') === 'true',
  };

  const validatedFields = createAnnouncementSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      message: '입력 내용을 확인해주세요.',
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  console.log(`📝 공지사항 수정 완료 (${id}):`, validatedFields.data);

  revalidatePath('/announcements');

  return {
    success: true,
    message: '공지사항이 수정되었습니다.',
  };
}
