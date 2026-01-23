'use client';

import {
  startTransition,
  useActionState,
  useEffect,
  useEffectEvent,
} from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Announcement } from '@/entities/announcement';
import { useToastAndRefresh } from '@/shared/lib';
import {
  createAnnouncementAction,
  updateAnnouncementAction,
} from '../api/actions';
import { getDefaultValues, toFormData } from '../lib/mapper';
import {
  CreateAnnouncementInput,
  createAnnouncementSchema,
  initialState,
} from './schema';

interface Params {
  announcement?: Announcement;
  onSuccess?: () => void;
  successMessage: string;
}

export function useAnnouncementForm({
  announcement,
  onSuccess,
  successMessage,
}: Params) {
  const { complete } = useToastAndRefresh(onSuccess);
  const MODE = announcement ? 'EDIT' : 'CREATE';

  const actionFn =
    MODE === 'EDIT'
      ? updateAnnouncementAction.bind(null, announcement!.id)
      : createAnnouncementAction;

  const [state, action, isPending] = useActionState(actionFn, initialState);

  const form = useForm<CreateAnnouncementInput>({
    resolver: zodResolver(createAnnouncementSchema),
    defaultValues: getDefaultValues(announcement),
  });

  const hasChanges = MODE === 'CREATE' || form.formState.isDirty;

  const handleError = useEffectEvent((currentState: typeof state) => {
    if (currentState && !currentState.success) {
      if (currentState.message) {
        form.setError('root', {
          type: 'server',
          message: currentState.message,
        });
      }
      if (currentState.fieldErrors) {
        Object.entries(currentState.fieldErrors).forEach(
          ([field, messages]) => {
            if (messages && messages[0]) {
              form.setError(field as keyof CreateAnnouncementInput, {
                type: 'server',
                message: messages[0],
              });
            }
          },
        );
      }
    }
  });

  const handleSuccess = useEffectEvent((currentState: typeof state) => {
    if (currentState?.success) {
      complete(successMessage);
    }
  });

  useEffect(() => {
    handleError(state);
    handleSuccess(state);
  }, [state]);

  const handleSubmit = form.handleSubmit((data) => {
    startTransition(() => {
      action(toFormData(data));
    });
  });

  return {
    form,
    handleSubmit,
    isSubmitting: form.formState.isSubmitting || isPending,
    isPending,
    hasChanges,
  };
}
