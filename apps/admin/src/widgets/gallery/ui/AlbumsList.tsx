'use client';

import { Card, CardContent, EmptyState } from '@/shared/ui';
import { Images } from 'lucide-react';
import { mockAlbums } from '../config/dummy';
import { AlbumsItem } from './AlbumsItem';
import { useEditAlbum } from '@/features/album';

export function AlbumsList() {
  const { openDialog } = useEditAlbum();

  const handleEdit = (id: string) => {
    const album = mockAlbums.find((a) => a.id === id);
    if (album) {
      openDialog(album.title, album.date, album.images);
    }
  };

  return (
    <>
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">앨범 목록</h2>

        {mockAlbums.length === 0 ? (
          <Card>
            <CardContent className="py-8">
              <EmptyState
                icon={Images}
                title="등록된 앨범이 없습니다"
                description="위의 '앨범 만들기' 버튼을 눌러 첫 앨범을 만들어보세요."
              />
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {mockAlbums.map((album) => (
              <AlbumsItem
                key={album.id}
                {...album}
                onEdit={() => handleEdit(album.id)}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
