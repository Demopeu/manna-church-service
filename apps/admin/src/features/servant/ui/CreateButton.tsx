'use client';

import { FormTriggerButton } from '@/shared/ui';
import { ServantForm } from './Form';

export function CreateServantButton() {
  return (
    <FormTriggerButton title="섬기는 사람 추가">
      {({ close }) => <ServantForm onCancel={close} onSuccess={close} />}
    </FormTriggerButton>
  );
}
