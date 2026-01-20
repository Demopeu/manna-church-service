'use client';

import Image from 'next/image';
import { ImageIcon, X } from 'lucide-react';
import { cn } from '@repo/ui/lib';
import { POSITION_OPTIONS, Servant } from '@/entities/servant';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
  Textarea,
} from '@/shared/ui';
import { useServantForm } from '../model/use-form';
import { getFormText } from './form-data';

interface Props {
  servant?: Servant;
  onSuccess: () => void;
  onCancel: () => void;
  isDialog?: boolean;
}

export function ServantForm({
  servant,
  onSuccess,
  onCancel,
  isDialog = false,
}: Props) {
  const uiText = getFormText(servant);

  const { form, handleSubmit, isSubmitting, photoFile } = useServantForm({
    servant,
    onSuccess,
    successMessage: uiText.successDescription,
  });

  const errors = form.formState.errors;

  const FormContent = (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.root && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-500">
          ⚠️ {errors.root.message}
        </div>
      )}

      <div className="space-y-2">
        <Label>
          프로필 사진 <span className="text-destructive">*</span>
        </Label>
        <div
          className={cn(
            'relative rounded-lg border-2 border-dashed transition-colors',
            photoFile.dragActive
              ? 'border-primary bg-primary/5'
              : 'border-border',
            photoFile.file ? 'p-4' : 'p-8',
          )}
          onDragEnter={photoFile.handleDrag}
          onDragLeave={photoFile.handleDrag}
          onDragOver={photoFile.handleDrag}
          onDrop={photoFile.handleDrop}
        >
          {photoFile.file ? (
            <div className="flex items-center gap-4">
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg">
                <Image
                  src={photoFile.file.preview}
                  alt="프로필 사진 미리보기"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <p className="font-medium">{photoFile.file.file.name}</p>
                <p className="text-muted-foreground text-sm">
                  {(photoFile.file.file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={photoFile.removePhotoFile}
              >
                <X className="h-4 w-4" />
              </Button>
              <input
                type="file"
                name="photoFile"
                accept="image/*"
                className="hidden"
                ref={(input) => {
                  if (input && photoFile.file) {
                    const dataTransfer = new DataTransfer();
                    dataTransfer.items.add(photoFile.file.file);
                    input.files = dataTransfer.files;
                  }
                }}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center text-center">
              <ImageIcon className="text-muted-foreground mb-4 h-12 w-12" />
              <p className="mb-1 text-lg font-medium">
                이미지를 드래그하거나 클릭해서 선택
              </p>
              <p className="text-muted-foreground text-sm">
                💡 JPG, PNG, WebP 파일 (최대 5MB)
              </p>
              <input
                type="file"
                name="photoFile"
                accept="image/*"
                onChange={photoFile.handleFileSelect}
                className="absolute inset-0 cursor-pointer opacity-0"
              />
            </div>
          )}
        </div>
        {errors.photoFile && (
          <p className="text-sm text-red-500">{errors.photoFile.message}</p>
        )}
        {servant?.photoUrl && !photoFile.file && (
          <p className="text-muted-foreground text-sm">
            📎 현재 사진: {servant.photoUrl}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">
          이름 <span className="text-destructive">*</span>
        </Label>
        <Input
          id="name"
          className="h-12 text-base"
          placeholder="예: 홍길동"
          disabled={isSubmitting}
          {...form.register('name')}
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">
          직분 <span className="text-destructive">*</span>
        </Label>
        <Select
          disabled={isSubmitting}
          value={form.watch('role')}
          onValueChange={(value) =>
            form.setValue('role', value, { shouldDirty: true })
          }
        >
          <SelectTrigger className="h-12">
            <SelectValue placeholder="직분을 선택하세요" />
          </SelectTrigger>
          <SelectContent>
            {POSITION_OPTIONS.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.role && (
          <p className="text-sm text-red-500">{errors.role.message}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="sortOrder">정렬 순서</Label>
          <Input
            id="sortOrder"
            type="number"
            min="1"
            className="h-12 text-base"
            disabled={isSubmitting}
            {...form.register('sortOrder', { valueAsNumber: true })}
          />
          {errors.sortOrder && (
            <p className="text-sm text-red-500">{errors.sortOrder.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact">연락처 (선택)</Label>
          <Input
            id="contact"
            type="tel"
            className="h-12 text-base"
            disabled={isSubmitting}
            {...form.register('contact')}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="introduction">담당/소개</Label>
        <Textarea
          id="introduction"
          className="min-h-24 text-base"
          placeholder="예: 찬양 인도"
          disabled={isSubmitting}
          {...form.register('introduction')}
        />
        {errors.introduction && (
          <p className="text-sm text-red-500">{errors.introduction.message}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="sortOrder">정렬 순서</Label>
          <Input
            id="sortOrder"
            type="number"
            min="1"
            className="h-12 text-base"
            disabled={isSubmitting}
            {...form.register('sortOrder', { valueAsNumber: true })}
          />
          {errors.sortOrder && (
            <p className="text-sm text-red-500">{errors.sortOrder.message}</p>
          )}
        </div>

        <div className="flex items-center space-x-2 pt-8">
          <Switch
            id="isPublic"
            checked={form.watch('isPublic')}
            onCheckedChange={(checked) =>
              form.setValue('isPublic', checked, { shouldDirty: true })
            }
            disabled={isSubmitting}
          />
          <Label htmlFor="isPublic" className="cursor-pointer">
            웹사이트에 공개
          </Label>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting || !photoFile.file}
        >
          {isSubmitting ? uiText.loadingBtn : uiText.submitBtn}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
          size="lg"
        >
          취소
        </Button>
      </div>
    </form>
  );

  if (isDialog) {
    return (
      <Card className="border-none shadow-none">
        <CardContent className="p-0">{FormContent}</CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{uiText.title}</CardTitle>
        <CardDescription>섬기는 사람 정보를 입력해주세요.</CardDescription>
      </CardHeader>
      <CardContent>{FormContent}</CardContent>
    </Card>
  );
}
