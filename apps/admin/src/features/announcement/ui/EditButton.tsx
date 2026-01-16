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
import { Announcement } from '@/entities/announcement';
import { AnnouncementForm } from './Form';

interface Props {
  announcement: Announcement;
}

export function EditAnnouncementButton({ announcement }: Props) {
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
          <AlertDialogTitle>공지 수정</AlertDialogTitle>
        </AlertDialogHeader>

        <AnnouncementForm
          announcement={announcement}
          onSuccess={() => setOpen(false)}
          onCancel={() => setOpen(false)}
          isDialog={true}
        />
      </AlertDialogContent>
    </AlertDialog>
  );
}
