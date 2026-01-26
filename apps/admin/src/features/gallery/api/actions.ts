'use server';

import { tryCatchAction, tryCatchVoid } from '@/shared/api';
import { requireAuth } from '@/shared/lib';
import { ActionState } from '@/shared/model';
import {
  type ImageObject,
  createGallerySchema,
  updateGallerySchema,
} from '../model/schema';
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

  const images: ImageObject[] = [];
  const thumbnailIndex = Number(formData.get('thumbnailIndex') || '0');

  let idx = 0;
  while (formData.has(`image-${idx}`)) {
    const file = formData.get(`image-${idx}`) as File;
    images.push({
      file,
      isThumbnail: idx === thumbnailIndex,
    });

    idx++;
  }

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
  id: string, // bind로 넘어온 ID
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const authState = await requireAuth();
  if (authState) return authState;

  const title = formData.get('title')?.toString() || '';
  const eventDate = formData.get('eventDate')?.toString() || '';
  const thumbnailIndex = Number(formData.get('thumbnailIndex') || '0');

  const combinedImages: ImageObject[] = [];

  const keepImageIds = formData.getAll('keepImageIds').map(String);

  keepImageIds.forEach((keepId) => {
    combinedImages.push({
      file: null,
      id: keepId,
      isThumbnail: false,
    });
  });

  let idx = 0;
  while (formData.has(`image-${idx}`)) {
    const file = formData.get(`image-${idx}`) as File;
    combinedImages.push({
      file,
      isThumbnail: false,
    });
    idx++;
  }

  const targetImage = combinedImages[thumbnailIndex];

  if (targetImage) {
    targetImage.isThumbnail = true;
  } else if (combinedImages.length > 0) {
    const firstImage = combinedImages[0];
    if (firstImage) firstImage.isThumbnail = true;
  }

  const rawData = {
    id,
    title,
    eventDate,
    images: combinedImages,
  };

  const validatedFields = updateGallerySchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      message: '입력 내용을 확인해주세요.',
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  return await tryCatchAction(() => updateGallery(validatedFields.data));
}

export async function deleteGalleryAction(id: string): Promise<void> {
  await requireAuth(true);
  await tryCatchVoid(() => deleteGallery(id));
}
