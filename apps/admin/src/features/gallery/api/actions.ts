'use server';

import { tryCatchAction, tryCatchVoid } from '@/shared/api';
import { requireAuth } from '@/shared/lib';
import { ActionState } from '@/shared/model';
import { createGallerySchema, updateGallerySchema } from '../model/schema';
import { createGallery } from './create';
import { deleteGallery } from './delete';
import { updateGallery } from './update';

export async function createGalleryAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const authState = await requireAuth();
  if (authState) {
    return authState;
  }

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
  const authState = await requireAuth();
  if (authState) {
    return authState;
  }

  const title = formData.get('title');
  const eventDate = formData.get('eventDate');
  const thumbnailIndex = formData.get('thumbnailIndex');
  const keepImageIdsStr = formData.get('keepImageIds');

  const imageFiles: File[] = [];

  let idx = 0;
  while (formData.has(`image-${idx}`)) {
    const file = formData.get(`image-${idx}`) as File;
    imageFiles.push(file);
    idx++;
  }

  const thumbnailIdx = Number(formData.get('thumbnailIndex') || '0');
  const images = imageFiles.map((file, index) => ({
    file,
    isThumbnail: index === thumbnailIdx,
  }));

  const rawData = {
    title,
    eventDate,
    images: images.length > 0 ? images : undefined,
    keepImageIds: keepImageIdsStr ? JSON.parse(keepImageIdsStr as string) : [],
    thumbnailIndex: thumbnailIndex ? Number(thumbnailIndex) : undefined,
  };

  const validatedFields = updateGallerySchema.safeParse(rawData);

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
  await requireAuth(true);
  await tryCatchVoid(() => deleteGallery(id));
}
