'use client';
import { useState } from 'react';
import { Button } from '@/shared/ui';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@repo/ui/shadcn';
import { Pencil } from 'lucide-react';
import { Bulletin } from '@/entities/bulletin';
import { BulletinForm } from './Form';

interface Props {
  bulletin: Bulletin;
}

export function EditBulletinButton({ bulletin }: Props) {
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
          <AlertDialogTitle>주보 수정</AlertDialogTitle>
        </AlertDialogHeader>

        <BulletinForm
          bulletin={bulletin}
          onSuccess={() => setOpen(false)}
          onCancel={() => setOpen(false)}
          isDialog={true}
        />
      </AlertDialogContent>
    </AlertDialog>
  );
}
