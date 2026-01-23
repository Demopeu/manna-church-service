'use client';

import {
  startTransition,
  useActionState,
  useEffect,
  useEffectEvent,
} from 'react';
import { Control, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Sermon } from '@/entities/sermon';
import { useToastAndRefresh } from '@/shared/lib';
import { createSermonAction, updateSermonAction } from '../api/actions';
import { extractVideoId } from '../lib/extract-video-id';
import { getDefaultValues, toFormData } from './mapper';
import { CreateSermonInput, createSermonSchema, initialState } from './schema';

interface Params {
  sermon?: Sermon;
  onSuccess?: () => void;
  successMessage: string;
}

function useYoutubePreview(control: Control<CreateSermonInput>) {
  const url = useWatch({ control, name: 'videoUrl' });
  const id = extractVideoId(url);
  return { url, id, isValid: !!id };
}

export function useSermonForm({ sermon, onSuccess, successMessage }: Params) {
  const { complete } = useToastAndRefresh(onSuccess);
  const MODE = sermon ? 'EDIT' : 'CREATE';

  const actionFn =
    MODE === 'EDIT'
      ? updateSermonAction.bind(null, sermon!.id)
      : createSermonAction;

  const [state, action, isPending] = useActionState(actionFn, initialState);

  const form = useForm<CreateSermonInput>({
    resolver: zodResolver(createSermonSchema),
    defaultValues: getDefaultValues(sermon),
  });

  const preview = useYoutubePreview(form.control);
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
              form.setError(field as keyof CreateSermonInput, {
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
    preview,
  };
}
