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
import { Sermon } from '@/entities/sermons';
import { SermonForm } from './Form';

interface Props {
  sermon: Sermon;
}

export function EditSermonButton({ sermon }: Props) {
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
          <AlertDialogTitle>설교 수정</AlertDialogTitle>
        </AlertDialogHeader>

        <SermonForm
          sermon={sermon}
          onSuccess={() => setOpen(false)}
          onCancel={() => setOpen(false)}
          isDialog={true}
        />
      </AlertDialogContent>
    </AlertDialog>
  );
}
