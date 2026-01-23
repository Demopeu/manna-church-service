'use server';

import { tryCatchAction, tryCatchVoid } from '@/shared/api';
import { requireAuth } from '@/shared/lib';
import { ActionState } from '@/shared/model';
import { createServantSchema, updateServantSchema } from '../model/schema';
import { createServant } from './create';
import { deleteServant } from './delete';
import { updateServant } from './update';

export async function createServantAction(
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
    role: formData.get('role'),
    photoFile: photoFile,
    contact: formData.get('contact') || undefined,
    introduction: formData.get('introduction') || undefined,
    isPublic: formData.get('isPublic') === 'true',
    sortOrder: Number(formData.get('sortOrder')),
  };

  const validatedFields = createServantSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      message: '입력 내용을 확인해주세요.',
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  return await tryCatchAction(() => createServant(validatedFields.data));
}

export async function updateServantAction(
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
    role: formData.get('role'),
    photoFile: photoFile,
    contact: formData.get('contact') || undefined,
    introduction: formData.get('introduction') || undefined,
    isPublic: formData.get('isPublic') === 'true',
    sortOrder: Number(formData.get('sortOrder')),
  };

  const validatedFields = updateServantSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      message: '입력 내용을 확인해주세요.',
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  return await tryCatchAction(() => updateServant(id, validatedFields.data));
}

export async function deleteServantAction(id: string): Promise<void> {
  await requireAuth(true);
  await tryCatchVoid(() => deleteServant(id));
}
