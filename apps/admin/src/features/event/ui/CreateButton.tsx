'use client';

import { EventForm } from './Form';
import { FormTriggerButton } from '@/shared/ui';

export function CreateEventButton() {
  return (
    <FormTriggerButton title="이벤트 등록">
      {({ close }) => <EventForm onCancel={close} onSuccess={close} />}
    </FormTriggerButton>
  );
}
