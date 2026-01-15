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
import { extractVideoId } from '../lib/extract-video-id';
import { useCreateSermon } from '../model/use-create-sermon';

interface Props {
  onCancel: () => void;
}

export function CreateSermonForm({ onCancel }: Props) {
  const { formData, updateField, handleSubmit } = useCreateSermon(onCancel);

  return (
    <Card>
      <CardHeader>
        <CardTitle>설교 등록</CardTitle>
        <CardDescription>새 설교 영상을 등록합니다.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-base">
                설교 제목 *
              </Label>
              <Input
                id="title"
                placeholder="예: 은혜의 능력"
                value={formData.title}
                onChange={(e) => updateField('title', e.target.value)}
                className="h-12 text-base"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="preacher" className="text-base">
                설교자 *
              </Label>
              <Input
                id="preacher"
                placeholder="예: 김목사"
                value={formData.preacher}
                onChange={(e) => updateField('preacher', e.target.value)}
                className="h-12 text-base"
                required
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="date" className="text-base">
                설교 날짜 *
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
            <div className="space-y-2">
              <Label htmlFor="youtubeUrl" className="text-base">
                유튜브 링크 *
              </Label>
              <Input
                id="youtubeUrl"
                type="url"
                placeholder="https://youtube.com/watch?v=..."
                value={formData.youtubeUrl}
                onChange={(e) => updateField('youtubeUrl', e.target.value)}
                className="h-12 text-base"
                required
              />
              <p className="text-muted-foreground text-sm">
                💡 유튜브 영상 주소를 붙여넣으면 영상 ID를 자동 추출합니다
              </p>
              {formData.youtubeUrl && extractVideoId(formData.youtubeUrl) && (
                <p className="text-primary text-sm">
                  ✓ 영상 ID: {extractVideoId(formData.youtubeUrl)}
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" size="lg">
              등록하기
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
