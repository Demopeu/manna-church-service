'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@repo/database/client';
import { ActionState } from '@/shared/model';
import { createSermonSchema } from './schema';

export async function createSermonAction(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
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

  const supabase = await createClient();

  const { error } = await supabase.from('sermons').insert({
    title: validatedFields.data.title,
    preacher: validatedFields.data.preacher,
    preached_at: validatedFields.data.date,
    video_url: validatedFields.data.youtubeUrl,
  });

  if (error) {
    console.error('설교 등록 실패:', error);
    return {
      success: false,
      message: '설교 등록에 실패했습니다.',
    };
  }

  revalidatePath('/sermons');

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

  const supabase = await createClient();

  const { error } = await supabase
    .from('sermons')
    .update({
      title: validatedFields.data.title,
      preacher: validatedFields.data.preacher,
      preached_at: validatedFields.data.date,
      video_url: validatedFields.data.youtubeUrl,
    })
    .eq('id', id);

  if (error) {
    console.error('설교 수정 실패:', error);
    return {
      success: false,
      message: '설교 수정에 실패했습니다.',
    };
  }

  revalidatePath('/sermons');

  return {
    success: true,
    message: '설교가 수정되었습니다.',
  };
}

export async function deleteSermonAction(id: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase.from('sermons').delete().eq('id', id);

  if (error) {
    console.error('설교 삭제 실패:', error);
    throw new Error('설교 삭제에 실패했습니다.');
  }

  revalidatePath('/sermons');
}
