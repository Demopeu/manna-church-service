'use client';

import { Controller } from 'react-hook-form';
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
  LoadingProgress,
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

  const { form, imageUI, handler, status } = useServantForm({
    servant,
    onSuccess,
    successMessage: uiText.successDescription,
  });

  const { errors, isValid } = form.formState;

  const FormContent = (
    <form onSubmit={handler.submit} className="space-y-4">
      <LoadingProgress
        isPending={status.isPending}
        message={
          status.mode === 'EDIT'
            ? '수정된 정보를 서버에 저장하고 있습니다...'
            : '정보를 서버에 등록하고 있습니다...'
        }
      />
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
            imageUI.dragActive
              ? 'border-primary bg-primary/5'
              : 'border-border',
            imageUI.preview ? 'p-4' : 'p-8',
          )}
          onDragEnter={imageUI.handleDrag}
          onDragLeave={imageUI.handleDrag}
          onDragOver={imageUI.handleDrag}
          onDrop={imageUI.handleDrop}
        >
          {imageUI.preview ? (
            <div className="flex items-center gap-4">
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg">
                <Image
                  src={imageUI.preview}
                  alt="프로필 사진 미리보기"
                  fill
                  className="object-cover"
                  sizes="96px"
                  unoptimized
                />
              </div>
              <div className="w-0 flex-1">
                <p className="truncate text-sm font-medium">
                  {imageUI.rawFile?.name}
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="shrink-0"
                onClick={imageUI.removeFile}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center">
              <ImageIcon className="text-muted-foreground mb-4 h-12 w-12" />
              <p className="mb-1 text-lg font-medium">이미지 선택</p>
              <input
                type="file"
                accept="image/*"
                onChange={imageUI.handleFileSelect}
                className="absolute inset-0 cursor-pointer opacity-0"
              />
            </div>
          )}
        </div>
        {errors.photoFile && (
          <p className="text-sm text-red-500">{errors.photoFile.message}</p>
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
          disabled={status.isPending}
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
        <Controller
          control={form.control}
          name="role"
          render={({ field }) => (
            <Select
              onValueChange={field.onChange}
              value={field.value}
              disabled={status.isPending}
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
          )}
        />
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
            disabled={status.isPending}
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
            disabled={status.isPending}
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
          disabled={status.isPending}
          {...form.register('introduction')}
        />
        {errors.introduction && (
          <p className="text-sm text-red-500">{errors.introduction.message}</p>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Controller
          control={form.control}
          name="isPublic"
          render={({ field }) => (
            <Switch
              id="isPublic"
              checked={!!field.value}
              onCheckedChange={field.onChange}
              disabled={status.isPending}
            />
          )}
        />
        <Label htmlFor="isPublic" className="cursor-pointer">
          웹사이트에 공개
        </Label>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="submit"
          size="lg"
          disabled={
            status.isPending ||
            !imageUI.preview ||
            !isValid ||
            !status.hasChanges
          }
        >
          {status.isPending ? uiText.loadingBtn : uiText.submitBtn}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={status.isPending}
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
