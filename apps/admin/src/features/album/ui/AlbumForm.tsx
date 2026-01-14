'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Label,
} from '@/shared/ui';
import { Upload, X, Plus, Star } from 'lucide-react';
import { cn } from '@repo/ui/lib';
import { useAlbumForm } from '../model/use-album-form';
import Image from 'next/image';

interface AlbumFormProps {
  onCancel: () => void;
}

export function AlbumForm({ onCancel }: AlbumFormProps) {
  const {
    formData,
    dragActive,
    previews,
    updateField,
    handleDrag,
    handleDrop,
    handleFileSelect,
    removePreview,
    setThumbnail,
    handleSubmit,
  } = useAlbumForm(undefined, undefined, onCancel);

  return (
    <Card>
      <CardHeader>
        <CardTitle>앨범 만들기</CardTitle>
        <CardDescription>
          새 앨범을 만들고 사진을 업로드합니다. 별표를 눌러 대표 이미지를
          선택하세요.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-base">
                앨범 제목 *
              </Label>
              <Input
                id="title"
                placeholder="예: 2024 신년 예배"
                value={formData.title}
                onChange={(e) => updateField('title', e.target.value)}
                className="h-12 text-base"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date" className="text-base">
                날짜 *
              </Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => updateField('date', e.target.value)}
                className="h-12 text-base"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-base">사진 업로드 *</Label>
            <p className="text-muted-foreground text-sm">
              여러 장 업로드 후 별표(★)를 눌러 대표 이미지 1개를 선택하세요.
            </p>
            <div
              className={cn(
                'relative rounded-lg border-2 border-dashed transition-colors',
                dragActive ? 'border-primary bg-primary/5' : 'border-border',
                previews.length > 0 ? 'p-4' : 'p-8',
              )}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {previews.length > 0 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
                    {previews.map((preview) => (
                      <div key={preview.id} className="group relative">
                        <div className="relative aspect-square w-full">
                          <Image
                            src={preview.url}
                            alt="사진"
                            fill
                            className={cn(
                              'rounded-lg border-2 object-cover',
                              preview.isThumbnail
                                ? 'border-primary'
                                : 'border-transparent',
                            )}
                          />
                        </div>
                        <Button
                          type="button"
                          variant={
                            preview.isThumbnail ? 'default' : 'secondary'
                          }
                          size="icon"
                          className={cn(
                            'absolute top-1 left-1 h-6 w-6',
                            preview.isThumbnail
                              ? ''
                              : 'opacity-0 group-hover:opacity-100',
                          )}
                          onClick={() => setThumbnail(preview.id)}
                        >
                          <Star
                            className={cn(
                              'h-3 w-3',
                              preview.isThumbnail && 'fill-current',
                            )}
                          />
                        </Button>
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute -top-2 -right-2 h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                          onClick={() => removePreview(preview.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                    <label className="border-border hover:border-primary hover:bg-primary/5 flex aspect-square w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed transition-colors">
                      <Plus className="text-muted-foreground h-8 w-8" />
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    {previews.length}개 사진 선택됨
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center text-center">
                  <Upload className="text-muted-foreground mb-4 h-12 w-12" />
                  <p className="mb-1 text-lg font-medium">
                    사진을 드래그하거나 클릭해서 선택
                  </p>
                  <p className="text-muted-foreground text-sm">
                    여러 장의 사진을 한번에 업로드할 수 있습니다
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileSelect}
                    className="absolute inset-0 cursor-pointer opacity-0"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              size="lg"
              disabled={
                previews.length === 0 || !formData.title || !formData.date
              }
            >
              앨범 만들기
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={onCancel}
            >
              취소
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
