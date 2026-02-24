'use server';

import { tryCatchAction, tryCatchVoid } from '@/shared/api';
import { requireAuth } from '@/shared/lib';
import { ActionState } from '@/shared/model';
import { createMissionarySchema, updateMissionarySchema } from '../model/schema';
import { createMissionary } from './create';
import { deleteMissionary } from './delete';
import { updateMissionary } from './update';

export async function createMissionaryAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const authState = await requireAuth();
  if (authState) {
    return authState;
  }

  const photoFile = formData.get('photoFile') as File | null;

  const rawData = {
    name: formData.get('name'),
    country: formData.get('country'),
    photoFile: photoFile,
    description: formData.get('description') || undefined,
  };

  const validatedFields = createMissionarySchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      message: '입력 내용을 확인해주세요.',
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  return await tryCatchAction(() => createMissionary(validatedFields.data));
}

export async function updateMissionaryAction(
  id: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const authState = await requireAuth();
  if (authState) {
    return authState;
  }

  const photoFile = formData.get('photoFile') as File | null;

  const rawData = {
    name: formData.get('name'),
    country: formData.get('country'),
    photoFile: photoFile,
    description: formData.get('description') || undefined,
  };

  const validatedFields = updateMissionarySchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      message: '입력 내용을 확인해주세요.',
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  return await tryCatchAction(() => updateMissionary(id, validatedFields.data));
}

export async function deleteMissionaryAction(id: string): Promise<void> {
  await requireAuth(true);
  await tryCatchVoid(() => deleteMissionary(id));
}
