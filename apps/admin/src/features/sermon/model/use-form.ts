'use client';

import { useState, useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { extractVideoId } from '../lib/extract-video-id';
import { createSermonAction, updateSermonAction } from './actions';
import { initialState } from './schema';
import { Sermon } from '@/entities/sermons';
import { getDefaultValues } from '../lib/mapper';
import { FORM_TEXT } from '../config/form';

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

  const [previewUrl, setPreviewUrl] = useState(sermon?.videoUrl || '');
  const videoId = extractVideoId(previewUrl);
  const isValidVideo = !!videoId;

  useEffect(() => {
    if (state.success) {
      alert(state.message);
      router.refresh();
      onSuccess?.();
    }
  }, [state.success, state.message, router, onSuccess]);

  const uiText = FORM_TEXT[MODE];
  const defaultValues = getDefaultValues(sermon);

  return {
    state,
    action,
    isPending,
    defaultValues,
    uiText,
    preview: {
      url: previewUrl,
      setUrl: setPreviewUrl,
      id: videoId,
      isValid: isValidVideo,
    },
  };
}
