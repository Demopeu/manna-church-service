import { Suspense } from 'react';
import { Images } from 'lucide-react';
import { getGalleries } from '@/entities/gallery';
import {
  Card,
  CardContent,
  EmptyState,
  Pagination,
  SearchInput,
  SearchInputSkeleton,
  SectionCard,
} from '@/shared/ui';
import { AlbumsItem } from './AlbumsItem';

interface Props {
  searchQuery: string;
  currentPage: number;
}

export async function AlbumsList({ searchQuery, currentPage }: Props) {
  const { galleries, totalPages } = await getGalleries({
    query: searchQuery,
    page: currentPage,
  });

  return (
    <SectionCard
      title="앨범 목록"
      description="등록된 앨범을 관리합니다. (최신순)"
      action={
        <Suspense fallback={<SearchInputSkeleton />}>
          <SearchInput />
        </Suspense>
      }
    >
      {galleries.length === 0 ? (
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
          {galleries.map((gallery) => (
            <AlbumsItem key={gallery.id} gallery={gallery} />
          ))}
        </div>
      )}
      <Pagination totalPages={totalPages} currentPage={currentPage} />
    </SectionCard>
  );
}
