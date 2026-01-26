'use client';
import { useState } from 'react';
import { Pencil } from 'lucide-react';
import { Announcement } from '@/entities/announcement';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
} from '@/shared/ui';
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
          <AlertDialogDescription className="sr-only">
            공지 정보를 수정하는 폼입니다. 내용을 변경하고 저장하세요.
          </AlertDialogDescription>
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
