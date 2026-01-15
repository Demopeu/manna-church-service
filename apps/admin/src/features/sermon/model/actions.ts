'use server';

import { createSermonSchema } from './schema';
import { ActionState } from '@/shared/model';
import { revalidatePath } from 'next/cache';

export async function createSermonAction(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const rawData = {
    title: formData.get('title'),
    preacher: formData.get('preacher'),
    date: formData.get('date'),
    youtubeUrl: formData.get('youtubeUrl'),
  };

  const validatedFields = createSermonSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      message: '입력 내용을 확인해주세요.',
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  console.log('✅ 서버 액션 성공:', validatedFields.data);

  return {
    success: true,
    message: '설교가 성공적으로 등록되었습니다.',
  };
}

export async function updateSermonAction(
  id: string,
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const rawData = {
    title: formData.get('title'),
    preacher: formData.get('preacher'),
    date: formData.get('date'),
    youtubeUrl: formData.get('youtubeUrl'),
  };

  const validatedFields = createSermonSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      message: '입력 내용을 확인해주세요.',
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // 4. (나중에) Supabase Update 로직
  // await supabase.from('sermons').update(rawData).eq('id', id);

  console.log(`📝 설교 수정 완료 (${id}):`, validatedFields.data);

  revalidatePath('/sermons');

  return {
    success: true,
    message: '설교가 수정되었습니다.',
  };
}
