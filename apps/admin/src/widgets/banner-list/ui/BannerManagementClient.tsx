'use client';

import { ImageIcon, Save } from 'lucide-react';
import {
  BannerItem,
  BannerUploadZone,
  useBannerSave,
  useBanners,
} from '@/features/banner';
import type { Banner } from '@/entities/banner';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  DeleteDialog,
  LoadingProgress,
} from '@/shared/ui';
import { BANNER_MANAGEMENT_UI } from './labels';

interface Props {
  banners: Banner[];
}

export function BannerManagementClient({ banners }: Props) {
  const {
    localBanners,
    pendingFiles,
    pendingDeleteIds,
    deleteTarget,
    draggedId,
    setDeleteTarget,
    onDragStart,
    onDragOver,
    onDragEnd,
    onTitleChange,
    onUpload,
    onDeleteConfirm,
  } = useBanners(banners);

  const { isSaving, canSave, handleSave } = useBannerSave({
    initialBanners: banners,
    localBanners,
    pendingFiles,
    pendingDeleteIds,
  });

  const { MAX_BANNERS } = BANNER_MANAGEMENT_UI;

  return (
    <>
      <LoadingProgress
        isPending={isSaving}
        message="설정을 저장하고 있습니다..."
      />
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                {BANNER_MANAGEMENT_UI.TITLE}
              </CardTitle>
              <CardDescription>
                {BANNER_MANAGEMENT_UI.DESCRIPTION_LINE1}
                <br />
                {BANNER_MANAGEMENT_UI.DESCRIPTION_LINE2_FN(
                  localBanners.length,
                  MAX_BANNERS,
                )}
              </CardDescription>
            </div>
            <Button
              size="lg"
              onClick={handleSave}
              disabled={isSaving || !canSave}
              className="shrink-0"
            >
              <Save className="mr-2 h-5 w-5" />
              {isSaving ? '저장 중...' : '설정 저장'}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {localBanners.map((banner, index) => (
              <BannerItem
                key={banner.id}
                banner={banner}
                index={index}
                isDragging={draggedId === banner.id}
                onDelete={setDeleteTarget}
                onTitleChange={onTitleChange}
                onDragStart={onDragStart}
                onDragOver={onDragOver}
                onDragEnd={onDragEnd}
              />
            ))}
          </div>

          {localBanners.length < MAX_BANNERS && (
            <BannerUploadZone
              onFileSelect={onUpload}
              maxSizeMb={BANNER_MANAGEMENT_UI.MAX_FILE_SIZE_MB}
            />
          )}
        </CardContent>
      </Card>

      <DeleteDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        onConfirm={onDeleteConfirm}
        title={BANNER_MANAGEMENT_UI.DELETE_TITLE}
        description={BANNER_MANAGEMENT_UI.DELETE_DESCRIPTION}
      />
    </>
  );
}
