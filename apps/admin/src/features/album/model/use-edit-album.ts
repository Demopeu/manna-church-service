'use client';

import { useState, useCallback } from 'react';
import type { GalleryImage } from './use-album-form';

export function useEditAlbum() {
  const [isOpen, setIsOpen] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editImages, setEditImages] = useState<GalleryImage[]>([]);
  const [editDragActive, setEditDragActive] = useState(false);

  const openDialog = (title: string, date: string, images: GalleryImage[]) => {
    setEditTitle(title);
    setEditDate(date);
    setEditImages([...images]);
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
  };

  const handleEditDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setEditDragActive(true);
    } else if (e.type === 'dragleave') {
      setEditDragActive(false);
    }
  }, []);

  const handleEditDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setEditDragActive(false);

    const files = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith('image/'),
    );
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const newImage: GalleryImage = {
          id: Date.now().toString() + Math.random(),
          url: reader.result as string,
          isThumbnail: false,
        };
        setEditImages((prev) => [...prev, newImage]);
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const handleEditFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter((f) =>
      f.type.startsWith('image/'),
    );
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const newImage: GalleryImage = {
          id: Date.now().toString() + Math.random(),
          url: reader.result as string,
          isThumbnail: false,
        };
        setEditImages((prev) => [...prev, newImage]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeEditImage = (id: string) => {
    setEditImages((prev) => {
      const filtered = prev.filter((p) => p.id !== id);
      const hasThumbnail = filtered.some((p) => p.isThumbnail);
      if (!hasThumbnail && filtered.length > 0) {
        filtered[0]!.isThumbnail = true;
      }
      return filtered;
    });
  };

  const setEditThumbnail = (id: string) => {
    setEditImages((prev) =>
      prev.map((p) => ({
        ...p,
        isThumbnail: p.id === id,
      })),
    );
  };

  const handleSave = (onSave: () => void) => {
    console.log('앨범 수정:', { editTitle, editDate, editImages });
    onSave();
    setIsOpen(false);
  };

  return {
    isOpen,
    editTitle,
    editDate,
    editImages,
    editDragActive,
    setEditTitle,
    setEditDate,
    openDialog,
    closeDialog,
    handleEditDrag,
    handleEditDrop,
    handleEditFileSelect,
    removeEditImage,
    setEditThumbnail,
    handleSave,
  };
}
