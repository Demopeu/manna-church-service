'use server';

import { tryCatchAction, tryCatchVoid } from '@/shared/api';
import { requireAuth } from '@/shared/lib';
import { ActionState } from '@/shared/model';
import { createEventSchema, updateEventSchema } from '../model/schema';
import { createEvent } from './create';
import { deleteEvent } from './delete';
import { updateEvent } from './update';

export async function createEventAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const authState = await requireAuth();
  if (authState) {
    return authState;
  }

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
  const authState = await requireAuth();
  if (authState) {
    return authState;
  }

  const rawData = {
    title: formData.get('title'),
    description: formData.get('description'),
    startDate: formData.get('startDate'),
    photoFile: formData.get('photoFile'),
  };

  const validatedFields = updateEventSchema.safeParse(rawData);

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
  await requireAuth(true);
  await tryCatchVoid(() => deleteEvent(id));
}
