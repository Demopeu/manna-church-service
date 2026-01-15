'use client';

import { CreateSermonForm } from './CreateSermonForm';
import { FormTriggerButton } from '@/shared/ui';

export function CreateSermonButton() {
  return (
    <FormTriggerButton title="설교 등록">
      {({ close }) => <CreateSermonForm onCancel={close} />}
    </FormTriggerButton>
  );
}
