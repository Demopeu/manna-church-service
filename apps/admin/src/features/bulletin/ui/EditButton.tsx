'use client';
import { useState } from 'react';
import { Pencil } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
} from '@repo/ui/shadcn';
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
          <AlertDialogDescription className="sr-only">
            주보 정보를 수정하는 폼입니다. 내용을 변경하고 저장하세요.
          </AlertDialogDescription>
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
