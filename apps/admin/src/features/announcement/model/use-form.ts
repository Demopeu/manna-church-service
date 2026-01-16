'use client';

import { useActionState, useEffect, useState } from 'react';
import { createAnnouncementAction, updateAnnouncementAction } from './actions';
import { initialState } from './schema';
import { getDefaultValues } from '../lib/mapper';
import { FORM_TEXT } from '../config/form';
import { Announcement } from '@/entities/announcement';

interface UseAnnouncementFormProps {
  announcement?: Announcement;
  onSuccess: () => void;
}

export function useAnnouncementForm({
  announcement,
  onSuccess,
}: UseAnnouncementFormProps) {
  const isEditMode = !!announcement;
  const action = isEditMode
    ? updateAnnouncementAction.bind(null, announcement.id)
    : createAnnouncementAction;

  const [state, formAction, isPending] = useActionState(action, initialState);

  const defaultValues = getDefaultValues(announcement);
  const uiText = isEditMode ? FORM_TEXT.EDIT : FORM_TEXT.CREATE;

  const [isUrgent, setIsUrgent] = useState(defaultValues.isUrgent);

  useEffect(() => {
    if (state.success) {
      onSuccess();
    }
  }, [state.success, onSuccess]);

  return {
    state,
    action: formAction,
    isPending,
    defaultValues,
    uiText,
    isUrgent: {
      value: isUrgent,
      setValue: setIsUrgent,
    },
  };
}
