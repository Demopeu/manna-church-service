'use server';

import { createGallerySchema } from './schema';
import { ActionState } from '@/shared/model';
import { revalidatePath } from 'next/cache';

export async function createGalleryAction(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await new Promise((resolve) => setTimeout(resolve, 500));

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

  console.log('✅ 서버 액션 성공:', {
    title: validatedFields.data.title,
    eventDate: validatedFields.data.eventDate,
    imagesCount: validatedFields.data.images.length,
    thumbnailIndex,
  });

  revalidatePath('/gallery');

  return {
    success: true,
    message: '앨범이 성공적으로 등록되었습니다.',
  };
}

export async function updateGalleryAction(
  id: string,
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await new Promise((resolve) => setTimeout(resolve, 500));

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

  console.log(`📝 앨범 수정 완료 (${id}):`, {
    title: validatedFields.data.title,
    eventDate: validatedFields.data.eventDate,
    imagesCount: validatedFields.data.images.length,
  });

  revalidatePath('/gallery');

  return {
    success: true,
    message: '앨범이 수정되었습니다.',
  };
}
