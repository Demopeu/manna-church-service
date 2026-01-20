'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@repo/database/client';
import { tryCatchAction, tryCatchVoid } from '@/shared/api';
import { ActionState } from '@/shared/model';
import { type CreateEventInput, createEventSchema } from '../model/schema';

async function createEvent(
  validatedFields: CreateEventInput,
): Promise<ActionState> {
  const supabase = await createClient();

  // TODO: 실제 구현 - 파일 업로드 및 DB 저장
  const { error } = await supabase.from('events').insert({
    title: validatedFields.title,
    description: validatedFields.description,
    start_date: validatedFields.startDate,
    photo_url: 'temp_photo_url', // TODO: Storage 업로드
  });

  if (error) {
    console.error('이벤트 등록 실패:', error);
    return {
      success: false,
      message: '이벤트 등록에 실패했습니다.',
    };
  }

  revalidatePath('/events');

  return {
    success: true,
  };
}

async function updateEvent(
  id: string,
  validatedFields: CreateEventInput,
): Promise<ActionState> {
  const supabase = await createClient();

  // TODO: 실제 구현 - 파일 업로드 및 DB 업데이트
  const { error } = await supabase
    .from('events')
    .update({
      title: validatedFields.title,
      description: validatedFields.description,
      start_date: validatedFields.startDate,
    })
    .eq('id', id);

  if (error) {
    console.error('이벤트 수정 실패:', error);
    return {
      success: false,
      message: '이벤트 수정에 실패했습니다.',
    };
  }

  revalidatePath('/events');

  return {
    success: true,
  };
}

async function deleteEvent(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from('events').delete().eq('id', id);

  if (error) {
    console.error('이벤트 삭제 실패:', error);
    throw new Error('이벤트 삭제에 실패했습니다.');
  }
}

export async function createEventAction(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
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

  return await tryCatchAction(() => createEvent(validatedFields.data));
}

export async function updateEventAction(
  id: string,
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
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

  return await tryCatchAction(() => updateEvent(id, validatedFields.data));
}

export async function deleteEventAction(id: string): Promise<void> {
  await tryCatchVoid(() => deleteEvent(id));
}
