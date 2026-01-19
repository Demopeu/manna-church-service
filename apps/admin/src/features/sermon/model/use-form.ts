'use client';

import {
  startTransition,
  useActionState,
  useEffect,
  useEffectEvent,
} from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Sermon } from '@/entities/sermon';
import { FORM_TEXT } from '../config/form';
import { extractVideoId } from '../lib/extract-video-id';
import { getDefaultValues } from '../lib/mapper';
import { createSermonAction, updateSermonAction } from './actions';
import { CreateSermonInput, createSermonSchema, initialState } from './schema';

interface Params {
  sermon?: Sermon;
  onSuccess?: () => void;
}

export function useSermonForm({ sermon, onSuccess }: Params) {
  const router = useRouter();
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

  const youtubeUrl = useWatch({ control: form.control, name: 'youtubeUrl' });
  const videoId = extractVideoId(youtubeUrl);
  const isValidVideo = !!videoId;

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
      alert(currentState.message);
      router.refresh();
      onSuccess?.();
    }
  });

  useEffect(() => {
    handleError(state);
    handleSuccess(state);
  }, [state]);

  const handleSubmit = form.handleSubmit((data) => {
    startTransition(() => {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('preacher', data.preacher);
      formData.append('date', data.date);
      formData.append('youtubeUrl', data.youtubeUrl);
      action(formData);
    });
  });

  const uiText = FORM_TEXT[MODE];

  return {
    form,
    handleSubmit,
    isSubmitting: form.formState.isSubmitting || isPending,
    hasChanges,
    uiText,
    preview: {
      url: youtubeUrl,
      id: videoId,
      isValid: isValidVideo,
    },
  };
}
