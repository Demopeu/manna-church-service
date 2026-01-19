'use client';

import { FormTriggerButton } from '@/shared/ui';
import { SermonForm } from './Form';

export function CreateSermonButton() {
  return (
    <FormTriggerButton title="설교 등록">
      {({ close }) => <SermonForm onCancel={close} onSuccess={close} />}
    </FormTriggerButton>
  );
}
