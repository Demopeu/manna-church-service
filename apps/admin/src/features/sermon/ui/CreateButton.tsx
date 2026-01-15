'use client';

import { SermonForm } from './Form';
import { FormTriggerButton } from '@/shared/ui';

export function CreateSermonButton() {
  return (
    <FormTriggerButton title="설교 등록">
      {({ close }) => <SermonForm onCancel={close} onSuccess={close} />}
    </FormTriggerButton>
  );
}
