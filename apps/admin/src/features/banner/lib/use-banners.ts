'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import type { Banner } from '@/entities/banner';

const MAX_FILE_SIZE_MB = 10;

export interface BannersState {
  localBanners: Banner[];
  pendingFiles: Record<string, File>;
  pendingDeleteIds: string[];
  deleteTarget: Banner | null;
  draggedId: string | null;
  setDeleteTarget: (banner: Banner | null) => void;
  onDragStart: (id: string) => void;
  onDragOver: (e: React.DragEvent, overId: string) => void;
  onDragEnd: () => void;
  onTitleChange: (id: string, title: string) => void;
  onUpload: (file: File) => void;
  onDeleteConfirm: () => void;
}

export function useBanners(initialBanners: Banner[]): BannersState {
  const [prevInitialBanners, setPrevInitialBanners] = useState(initialBanners);
  const [localBanners, setLocalBanners] = useState<Banner[]>(initialBanners);
  const [pendingFiles, setPendingFiles] = useState<Record<string, File>>({});
  const [pendingDeleteIds, setPendingDeleteIds] = useState<string[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<Banner | null>(null);
  const [draggedId, setDraggedId] = useState<string | null>(null);

  if (prevInitialBanners !== initialBanners) {
    setPrevInitialBanners(initialBanners);
    setLocalBanners(initialBanners);
    setPendingFiles({});
    setPendingDeleteIds([]);
  }

  const onDragStart = (id: string) => setDraggedId(id);

  const onDragOver = (e: React.DragEvent, overId: string) => {
    e.preventDefault();
    if (!draggedId || draggedId === overId) return;
    setLocalBanners((prev) => {
      const from = prev.findIndex((b) => b.id === draggedId);
      const to = prev.findIndex((b) => b.id === overId);
      if (from === -1 || to === -1) return prev;
      const next = [...prev];
      const [moved] = next.splice(from, 1) as [Banner];
      next.splice(to, 0, moved);
      return next;
    });
  };

  const onDragEnd = () => setDraggedId(null);

  const onTitleChange = (id: string, title: string) => {
    setLocalBanners((prev) =>
      prev.map((b) => (b.id === id ? { ...b, title } : b)),
    );
  };

  const onUpload = (file: File) => {
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      toast.error(
        `이미지 크기는 최대 ${MAX_FILE_SIZE_MB}MB까지 업로드 가능합니다.`,
      );
      return;
    }
    const tempId = crypto.randomUUID();
    const previewUrl = URL.createObjectURL(file);
    const newBanner: Banner = {
      id: tempId,
      title: '',
      imageUrl: previewUrl,
      sortOrder: localBanners.length,
      createdAt: new Date().toISOString(),
    };
    setLocalBanners((prev) => [...prev, newBanner]);
    setPendingFiles((prev) => ({ ...prev, [tempId]: file }));
  };

  const onDeleteConfirm = () => {
    if (!deleteTarget) return;
    const isNewBanner = Boolean(pendingFiles[deleteTarget.id]);
    if (isNewBanner) {
      URL.revokeObjectURL(deleteTarget.imageUrl);
      setPendingFiles((prev) => {
        const next = { ...prev };
        delete next[deleteTarget.id];
        return next;
      });
    } else {
      setPendingDeleteIds((prev) => [...prev, deleteTarget.id]);
    }
    setLocalBanners((prev) => prev.filter((b) => b.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  return {
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
  };
}
