'use client';

import { useState } from 'react';
import {
  Button,
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/shared/ui';
import { Pencil } from 'lucide-react';
import { Servant } from '@/entities/servant';
import { ServantForm } from './Form';

interface Props {
  servant: Servant;
}

export function EditServantButton({ servant }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Pencil className="text-muted-foreground hover:text-primary h-4 w-4" />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="sm:max-w-[600px]">
        <AlertDialogHeader>
          <AlertDialogTitle>섬기는 사람 수정</AlertDialogTitle>
        </AlertDialogHeader>

        <ServantForm
          servant={servant}
          onSuccess={() => setOpen(false)}
          onCancel={() => setOpen(false)}
          isDialog={true}
        />
      </AlertDialogContent>
    </AlertDialog>
  );
}
