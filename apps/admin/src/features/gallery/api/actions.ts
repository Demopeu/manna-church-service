'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@repo/database/client';
import { tryCatchAction, tryCatchVoid } from '@/shared/api';
import { ActionState } from '@/shared/model';
import { type CreateGalleryInput, createGallerySchema } from '../model/schema';

async function createGallery(
  validatedFields: CreateGalleryInput,
): Promise<ActionState> {
  const supabase = await createClient();

  // TODO: 실제 구현 - 파일 업로드 및 DB 저장
  const { error } = await supabase.from('galleries').insert({
    title: validatedFields.title,
    event_date: validatedFields.eventDate,
    thumbnail_url: 'temp_thumbnail_url', // TODO: Storage 업로드
    image_urls: [], // TODO: Storage 업로드
  });

  if (error) {
    console.error('앨범 등록 실패:', error);
    return {
      success: false,
      message: '앨범 등록에 실패했습니다.',
    };
  }

  revalidatePath('/gallery');

  return {
    success: true,
  };
}

async function updateGallery(
  id: string,
  validatedFields: CreateGalleryInput,
): Promise<ActionState> {
  const supabase = await createClient();

  // TODO: 실제 구현
  const { error } = await supabase
    .from('galleries')
    .update({
      title: validatedFields.title,
      event_date: validatedFields.eventDate,
    })
    .eq('id', id);

  if (error) {
    console.error('앨범 수정 실패:', error);
    return {
      success: false,
      message: '앨범 수정에 실패했습니다.',
    };
  }

  revalidatePath('/gallery');

  return {
    success: true,
  };
}

async function deleteGallery(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from('galleries').delete().eq('id', id);

  if (error) {
    console.error('앨범 삭제 실패:', error);
    throw new Error('앨범 삭제에 실패했습니다.');
  }
}

export async function createGalleryAction(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const title = formData.get('title');
  const eventDate = formData.get('eventDate');

  const imageFiles: File[] = [];
  const thumbnailIndex = Number(formData.get('thumbnailIndex') || '0');

  let idx = 0;
  while (formData.has(`image-${idx}`)) {
    const file = formData.get(`image-${idx}`) as File;
    imageFiles.push(file);
    idx++;
  }

  const images = imageFiles.map((file, index) => ({
    file,
    isThumbnail: index === thumbnailIndex,
  }));

  const rawData = {
    title,
    eventDate,
    images,
  };

  const validatedFields = createGallerySchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      message: '입력 내용을 확인해주세요.',
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  return await tryCatchAction(() => createGallery(validatedFields.data));
}

export async function updateGalleryAction(
  id: string,
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const title = formData.get('title');
  const eventDate = formData.get('eventDate');

  const imageFiles: File[] = [];
  const thumbnailIndex = Number(formData.get('thumbnailIndex') || '0');

  let idx = 0;
  while (formData.has(`image-${idx}`)) {
    const file = formData.get(`image-${idx}`) as File;
    imageFiles.push(file);
    idx++;
  }

  const images = imageFiles.map((file, index) => ({
    file,
    isThumbnail: index === thumbnailIndex,
  }));

  const rawData = {
    title,
    eventDate,
    images,
  };

  const validatedFields = createGallerySchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      message: '입력 내용을 확인해주세요.',
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  return await tryCatchAction(() => updateGallery(id, validatedFields.data));
}

export async function deleteGalleryAction(id: string): Promise<void> {
  await tryCatchVoid(() => deleteGallery(id));
}
