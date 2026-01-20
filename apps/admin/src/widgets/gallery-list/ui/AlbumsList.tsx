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
import { GALLERY_UI } from './labels';

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
      title={GALLERY_UI.TITLE}
      description={GALLERY_UI.DESCRIPTION}
      action={
        <Suspense fallback={<SearchInputSkeleton />}>
          <SearchInput placeholder={GALLERY_UI.SEARCH_PLACEHOLDER} />
        </Suspense>
      }
    >
      {galleries.length === 0 ? (
        <Card>
          <CardContent className="py-8">
            <EmptyState
              icon={Images}
              title={GALLERY_UI.EMPTY}
              description={GALLERY_UI.EMPTY_DESCRIPTION}
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
