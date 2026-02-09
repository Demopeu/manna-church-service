'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@repo/database/client';
import { tryCatchAction, tryCatchVoid } from '@/shared/api';
import { requireAuth } from '@/shared/lib';
import { ActionState } from '@/shared/model';
import {
  type CreateAnnouncementInput,
  createAnnouncementSchema,
} from '../model/schema';

async function createAnnouncement(
  validatedFields: CreateAnnouncementInput,
): Promise<ActionState> {
  const supabase = await createClient();

  const { error } = await supabase.from('notices').insert({
    title: validatedFields.title,
    content: validatedFields.content,
    is_urgent: validatedFields.isUrgent,
  });

  if (error) {
    console.error('공지사항 등록 실패:', error);
    return {
      success: false,
      message: '공지사항 등록에 실패했습니다.',
    };
  }

  revalidatePath('/announcements');

  return {
    success: true,
  };
}

async function updateAnnouncement(
  id: string,
  validatedFields: CreateAnnouncementInput,
): Promise<ActionState> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('notices')
    .update({
      title: validatedFields.title,
      content: validatedFields.content,
      is_urgent: validatedFields.isUrgent,
    })
    .eq('id', id);

  if (error) {
    console.error('공지사항 수정 실패:', error);
    return {
      success: false,
      message: '공지사항 수정에 실패했습니다.',
    };
  }

  revalidatePath('/announcements');

  return {
    success: true,
  };
}

async function deleteAnnouncement(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from('notices').delete().eq('id', id);

  if (error) {
    console.error('공지사항 삭제 실패:', error);
    throw new Error('공지사항 삭제에 실패했습니다.');
  }
}

export async function createAnnouncementAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const authState = await requireAuth();
  if (authState) {
    return authState;
  }
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

  return await tryCatchAction(() => createAnnouncement(validatedFields.data));
}

export async function updateAnnouncementAction(
  id: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const authState = await requireAuth();
  if (authState) {
    return authState;
  }
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

  return await tryCatchAction(() =>
    updateAnnouncement(id, validatedFields.data),
  );
}

export async function deleteAnnouncementAction(id: string): Promise<void> {
  await requireAuth(true);
  await tryCatchVoid(() => deleteAnnouncement(id));
}
