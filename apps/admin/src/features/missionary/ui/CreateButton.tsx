'use client';

import { FormTriggerButton } from '@/shared/ui';
import { MissionaryForm } from './Form';

export function CreateMissionaryButton() {
  return (
    <FormTriggerButton title="선교사 추가">
      {({ close }) => <MissionaryForm onCancel={close} onSuccess={close} />}
    </FormTriggerButton>
  );
}
