'use client';

import { Button, Input, Label } from '@/shared/ui';
import { Plus, Star, X } from 'lucide-react';
import { cn } from '@repo/ui/lib';
import Image from 'next/image';
import type { GalleryImage } from '../model/use-album-form';

interface Props {
  editTitle: string;
  editDate: string;
  editImages: GalleryImage[];
  editDragActive: boolean;
  setEditTitle: (value: string) => void;
  setEditDate: (value: string) => void;
  handleEditDrag: (e: React.DragEvent) => void;
  handleEditDrop: (e: React.DragEvent) => void;
  handleEditFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeEditImage: (id: string) => void;
  setEditThumbnail: (id: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export function EditAlbumDialogContent({
  editTitle,
  editDate,
  editImages,
  editDragActive,
  setEditTitle,
  setEditDate,
  handleEditDrag,
  handleEditDrop,
  handleEditFileSelect,
  removeEditImage,
  setEditThumbnail,
  onSave,
  onCancel,
}: Props) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="edit-title" className="text-base">
            앨범 제목 *
          </Label>
          <Input
            id="edit-title"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="h-12 text-base"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-date" className="text-base">
            날짜 *
          </Label>
          <Input
            id="edit-date"
            type="date"
            value={editDate}
            onChange={(e) => setEditDate(e.target.value)}
            className="h-12 text-base"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-base">사진</Label>
        <p className="text-muted-foreground text-sm">
          별표(★)를 눌러 대표 이미지를 선택하세요.
        </p>

        <div
          className={cn(
            'rounded-lg border-2 border-dashed p-4 transition-colors',
            editDragActive ? 'border-primary bg-primary/5' : 'border-border',
          )}
          onDragEnter={handleEditDrag}
          onDragLeave={handleEditDrag}
          onDragOver={handleEditDrag}
          onDrop={handleEditDrop}
        >
          <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
            {editImages.map((image) => (
              <div key={image.id} className="group relative">
                <div className="relative aspect-square w-full">
                  <Image
                    src={image.url}
                    alt="사진"
                    fill
                    className={cn(
                      'rounded-lg border-2 object-cover',
                      image.isThumbnail
                        ? 'border-primary'
                        : 'border-transparent',
                    )}
                  />
                </div>
                <Button
                  type="button"
                  variant={image.isThumbnail ? 'default' : 'secondary'}
                  size="icon"
                  className={cn(
                    'absolute top-1 left-1 h-6 w-6',
                    image.isThumbnail
                      ? ''
                      : 'opacity-0 group-hover:opacity-100',
                  )}
                  onClick={() => setEditThumbnail(image.id)}
                >
                  <Star
                    className={cn(
                      'h-3 w-3',
                      image.isThumbnail && 'fill-current',
                    )}
                  />
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                  onClick={() => removeEditImage(image.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
            <label className="border-border hover:border-primary hover:bg-primary/5 flex aspect-square w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed transition-colors">
              <Plus className="text-muted-foreground h-6 w-6" />
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleEditFileSelect}
                className="hidden"
              />
            </label>
          </div>
          <p className="text-muted-foreground mt-3 text-sm">
            {editImages.length}개 사진 • 드래그하여 추가 업로드 가능
          </p>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onCancel}>
          취소
        </Button>
        <Button
          onClick={onSave}
          disabled={!editTitle || !editDate || editImages.length === 0}
        >
          저장
        </Button>
      </div>
    </div>
  );
}
