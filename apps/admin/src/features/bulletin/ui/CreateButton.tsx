'use client';

import { BulletinForm } from './Form';
import { FormTriggerButton } from '@/shared/ui';

export function CreateBulletinButton() {
  return (
    <FormTriggerButton title="주보 등록">
      {({ close }) => <BulletinForm onCancel={close} onSuccess={close} />}
    </FormTriggerButton>
  );
}
