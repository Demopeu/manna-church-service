'use client';

import { useReducer, useState } from 'react';
import { toast } from 'sonner';
import type { Banner } from '@/entities/banner';

const MAX_FILE_SIZE_MB = 10;

interface State {
  localBanners: Banner[];
  pendingFiles: Record<string, File>;
  pendingDeleteIds: string[];
  deleteTarget: Banner | null;
  draggedId: string | null;
}

type Action =
  | { type: 'RESET'; banners: Banner[] }
  | { type: 'SET_DELETE_TARGET'; target: Banner | null }
  | { type: 'DRAG_START'; id: string }
  | { type: 'DRAG_END' }
  | { type: 'REORDER'; overId: string }
  | { type: 'TITLE_CHANGE'; id: string; title: string }
  | {
      type: 'ADD';
      tempId: string;
      previewUrl: string;
      file: File;
      createdAt: string;
    }
  | { type: 'DELETE_CONFIRM' };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'RESET':
      return initState(action.banners);

    case 'SET_DELETE_TARGET':
      return { ...state, deleteTarget: action.target };

    case 'DRAG_START':
      return { ...state, draggedId: action.id };

    case 'DRAG_END':
      return { ...state, draggedId: null };

    case 'REORDER': {
      if (!state.draggedId || state.draggedId === action.overId) return state;
      const from = state.localBanners.findIndex(
        (b) => b.id === state.draggedId,
      );
      const to = state.localBanners.findIndex((b) => b.id === action.overId);
      if (from === -1 || to === -1) return state;
      const next = [...state.localBanners];
      const [moved] = next.splice(from, 1) as [Banner];
      next.splice(to, 0, moved);
      return { ...state, localBanners: next };
    }

    case 'TITLE_CHANGE':
      return {
        ...state,
        localBanners: state.localBanners.map((b) =>
          b.id === action.id ? { ...b, title: action.title } : b,
        ),
      };

    case 'ADD': {
      const newBanner: Banner = {
        id: action.tempId,
        title: '',
        imageUrl: action.previewUrl,
        sortOrder: state.localBanners.length,
        createdAt: action.createdAt,
      };
      return {
        ...state,
        localBanners: [...state.localBanners, newBanner],
        pendingFiles: { ...state.pendingFiles, [action.tempId]: action.file },
      };
    }

    case 'DELETE_CONFIRM': {
      if (!state.deleteTarget) return state;
      const targetId = state.deleteTarget.id;
      const isNew = Boolean(state.pendingFiles[targetId]);
      return {
        ...state,
        localBanners: state.localBanners.filter((b) => b.id !== targetId),
        pendingFiles: isNew
          ? Object.fromEntries(
              Object.entries(state.pendingFiles).filter(
                ([k]) => k !== targetId,
              ),
            )
          : state.pendingFiles,
        pendingDeleteIds: isNew
          ? state.pendingDeleteIds
          : [...state.pendingDeleteIds, targetId],
        deleteTarget: null,
      };
    }

    default:
      return state;
  }
}

function initState(banners: Banner[]): State {
  return {
    localBanners: banners,
    pendingFiles: {},
    pendingDeleteIds: [],
    deleteTarget: null,
    draggedId: null,
  };
}

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
  const [prevBanners, setPrevBanners] = useState(initialBanners);
  const [state, dispatch] = useReducer(reducer, initialBanners, initState);

  if (prevBanners !== initialBanners) {
    setPrevBanners(initialBanners);
    dispatch({ type: 'RESET', banners: initialBanners });
  }

  const setDeleteTarget = (banner: Banner | null) =>
    dispatch({ type: 'SET_DELETE_TARGET', target: banner });

  const onDragStart = (id: string) => dispatch({ type: 'DRAG_START', id });

  const onDragOver = (e: React.DragEvent, overId: string) => {
    e.preventDefault();
    dispatch({ type: 'REORDER', overId });
  };

  const onDragEnd = () => dispatch({ type: 'DRAG_END' });

  const onTitleChange = (id: string, title: string) =>
    dispatch({ type: 'TITLE_CHANGE', id, title });

  const onUpload = (file: File) => {
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      toast.error(
        `이미지 크기는 최대 ${MAX_FILE_SIZE_MB}MB까지 업로드 가능합니다.`,
      );
      return;
    }
    const tempId = crypto.randomUUID();
    const previewUrl = URL.createObjectURL(file);
    dispatch({
      type: 'ADD',
      tempId,
      previewUrl,
      file,
      createdAt: new Date().toISOString(),
    });
  };

  const onDeleteConfirm = () => {
    if (state.deleteTarget && state.pendingFiles[state.deleteTarget.id]) {
      URL.revokeObjectURL(state.deleteTarget.imageUrl);
    }
    dispatch({ type: 'DELETE_CONFIRM' });
  };

  return {
    localBanners: state.localBanners,
    pendingFiles: state.pendingFiles,
    pendingDeleteIds: state.pendingDeleteIds,
    deleteTarget: state.deleteTarget,
    draggedId: state.draggedId,
    setDeleteTarget,
    onDragStart,
    onDragOver,
    onDragEnd,
    onTitleChange,
    onUpload,
    onDeleteConfirm,
  };
}
