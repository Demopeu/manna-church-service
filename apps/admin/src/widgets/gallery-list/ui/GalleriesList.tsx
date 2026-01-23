import { Suspense } from 'react';
import { Images } from 'lucide-react';
import { getGalleries } from '@/entities/gallery';
import {
  Card,
  CardContent,
  EmptyState,
  ListSkeleton,
  Pagination,
  SearchInput,
  SearchInputSkeleton,
  SectionCard,
  withAsyncBoundary,
} from '@/shared/ui';
import { GalleriesItem } from './GalleriesItem';
import { GALLERY_UI } from './labels';

interface Props {
  searchQuery: string;
  currentPage: number;
}

async function List({ searchQuery, currentPage }: Props) {
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
            <GalleriesItem key={gallery.id} gallery={gallery} />
          ))}
        </div>
      )}
      <Pagination totalPages={totalPages} currentPage={currentPage} />
    </SectionCard>
  );
}

export const GalleriesList = withAsyncBoundary(List, {
  loadingFallback: (
    <ListSkeleton
      title={GALLERY_UI.TITLE}
      description={GALLERY_UI.DESCRIPTION}
    />
  ),
});
