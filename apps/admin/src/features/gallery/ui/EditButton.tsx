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
import { GalleryWithImages } from '@/entities/gallery';
import { GalleryForm } from './Form';

interface Props {
  gallery: GalleryWithImages;
}

export function EditAlbumButton({ gallery }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Pencil className="text-muted-foreground hover:text-primary h-4 w-4" />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="sm:max-w-[800px]">
        <AlertDialogHeader>
          <AlertDialogTitle>앨범 수정</AlertDialogTitle>
        </AlertDialogHeader>

        <GalleryForm
          gallery={gallery}
          onSuccess={() => setOpen(false)}
          onCancel={() => setOpen(false)}
          isDialog={true}
        />
      </AlertDialogContent>
    </AlertDialog>
  );
}
