'use client';

import Image from 'next/image';
import { FileText, ImageIcon, Upload, X } from 'lucide-react';
import { cn } from '@repo/ui/lib';
import { Bulletin } from '@/entities/bulletin';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from '@/shared/ui';
import { useBulletinForm } from '../model/use-form';
import { getFormText } from './form-data';

interface Props {
  bulletin?: Bulletin;
  onSuccess: () => void;
  onCancel: () => void;
  isDialog?: boolean;
}

export function BulletinForm({
  bulletin,
  onSuccess,
  onCancel,
  isDialog = false,
}: Props) {
  const uiText = getFormText(bulletin);

  const { form, handler, status, pdfFile, coverImageFile } = useBulletinForm({
    bulletin,
    onSuccess,
    successMessage: uiText.successDescription,
  });

  const { errors, isValid } = form.formState;

  const FormContent = (
    <form onSubmit={handler.submit} className="space-y-4">
      {errors.root && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-500">
          ⚠️ {errors.root.message}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="publishedAt">게시일 *</Label>
        <Input
          id="publishedAt"
          type="date"
          className="h-12 text-base"
          disabled={status.isPending}
          {...form.register('publishedAt')}
        />
        {errors.publishedAt && (
          <p className="text-sm text-red-500">{errors.publishedAt.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>주보 PDF *</Label>
        <div
          className={cn(
            'relative rounded-lg border-2 border-dashed transition-colors',
            pdfFile.dragActive
              ? 'border-primary bg-primary/5'
              : 'border-border',
            pdfFile.rawFile ? 'p-4' : 'p-8',
          )}
          onDragEnter={pdfFile.handleDrag}
          onDragLeave={pdfFile.handleDrag}
          onDragOver={pdfFile.handleDrag}
          onDrop={pdfFile.handleDrop}
        >
          {pdfFile.rawFile ? (
            <div className="flex items-center gap-4">
              <div className="flex flex-1 items-center gap-3">
                <div className="bg-primary/10 rounded-lg p-3">
                  <FileText className="text-primary h-8 w-8" />
                </div>
                <div>
                  <p className="font-medium">{pdfFile.fileName}</p>
                  <p className="text-muted-foreground text-sm">PDF 파일</p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={pdfFile.removeFile}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center">
              <Upload className="text-muted-foreground mb-4 h-12 w-12" />
              <p className="mb-1 text-lg font-medium">
                PDF를 드래그하거나 클릭해서 선택
              </p>
              <p className="text-muted-foreground text-sm">{uiText.pdfHelp}</p>
              <input
                type="file"
                name="pdfFile"
                accept="application/pdf"
                onChange={pdfFile.handleFileSelect}
                className="absolute inset-0 cursor-pointer opacity-0"
              />
            </div>
          )}
        </div>
        {errors.pdfFile && (
          <p className="text-sm text-red-500">{errors.pdfFile.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>주보 표지 이미지</Label>
        <div
          className={cn(
            'relative rounded-lg border-2 border-dashed transition-colors',
            coverImageFile.dragActive
              ? 'border-primary bg-primary/5'
              : 'border-border',
            coverImageFile.rawFile ? 'p-4' : 'p-8',
          )}
          onDragEnter={coverImageFile.handleDrag}
          onDragLeave={coverImageFile.handleDrag}
          onDragOver={coverImageFile.handleDrag}
          onDrop={coverImageFile.handleDrop}
        >
          {coverImageFile.preview ? (
            <div className="flex items-center gap-4">
              <div className="relative h-24 w-24 shrink-0">
                <Image
                  src={coverImageFile.preview}
                  alt="주보 표지 미리보기"
                  fill
                  className="rounded-lg object-cover"
                />
              </div>
              <div className="flex-1">
                {coverImageFile.rawFile && (
                  <p className="font-medium">{coverImageFile.rawFile.name}</p>
                )}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={coverImageFile.removeFile}
              >
                <X className="h-4 w-4" />
              </Button>
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
                name="coverImageFile"
                accept="image/*"
                onChange={coverImageFile.handleFileSelect}
                className="absolute inset-0 cursor-pointer opacity-0"
              />
            </div>
          )}
        </div>
        {errors.coverImageFile && (
          <p className="text-sm text-red-500">
            {errors.coverImageFile.message}
          </p>
        )}
        {bulletin?.coverImageUrl && !coverImageFile.rawFile && (
          <p className="text-muted-foreground text-sm">
            📎 현재 표지: {bulletin.coverImageUrl}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="submit"
          size="lg"
          disabled={
            status.isPending ||
            !pdfFile.rawFile ||
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
        <CardDescription>{uiText.description}</CardDescription>
      </CardHeader>
      <CardContent>{FormContent}</CardContent>
    </Card>
  );
}
