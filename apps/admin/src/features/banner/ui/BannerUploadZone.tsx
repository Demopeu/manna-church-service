'use client';

import { Upload } from 'lucide-react';

interface BannerUploadZoneProps {
  onFileSelect: (file: File) => void;
  maxSizeMb?: number;
}

export function BannerUploadZone({
  onFileSelect,
  maxSizeMb,
}: BannerUploadZoneProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
    e.target.value = '';
  };

  return (
    <label className="hover:bg-muted/50 flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors">
      <Upload className="text-muted-foreground mb-2 h-8 w-8" />
      <span className="text-muted-foreground text-sm">
        배너 이미지 추가 (권장: 1920x600)
      </span>
      {maxSizeMb && (
        <span className="text-muted-foreground/70 mt-1 text-xs">
          최대 {maxSizeMb}MB · 저장 시 WebP 자동 변환 및 압축
        </span>
      )}
      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
    </label>
  );
}
