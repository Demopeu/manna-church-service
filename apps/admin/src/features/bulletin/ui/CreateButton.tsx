'use client';

import { FormTriggerButton } from '@/shared/ui';
import { BulletinForm } from './Form';

export function CreateBulletinButton() {
  return (
    <FormTriggerButton title="주보 등록">
      {({ close }) => <BulletinForm onCancel={close} onSuccess={close} />}
    </FormTriggerButton>
  );
}
