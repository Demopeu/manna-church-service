import { getGalleries } from '@/entities/gallery';
import {
  ContentWrapper,
  ListError,
  ListSkeleton,
  withAsyncBoundary,
} from '@/shared/ui';
import { GalleryItem } from './Item';

interface Props {
  filterParams: Promise<{ query: string; page: string }>;
}

async function List({ filterParams }: Props) {
  const { query, page } = await filterParams;
  const pageNumber = parseInt(page) || 1;
  const { galleries, totalPages, totalCount } = await getGalleries({
    query,
    page: pageNumber,
  });

  return (
    <ContentWrapper
      totalCount={totalCount}
      totalPages={totalPages}
      currentPage={pageNumber}
      currentQuery={query}
    >
      {galleries.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {galleries.map((gallery) => (
            <GalleryItem key={gallery.id} gallery={gallery} />
          ))}
        </div>
      ) : (
        <div className="border-muted-foreground/30 flex h-64 items-center justify-center rounded-xl border border-dashed">
          <p className="text-muted-foreground">
            {query
              ? `"${query}"에 대한 검색 결과가 없습니다.`
              : '등록된 갤러리가 없습니다.'}
          </p>
        </div>
      )}
    </ContentWrapper>
  );
}

export const GalleryList = withAsyncBoundary(List, {
  loadingFallback: (
    <ListSkeleton
      variant="card-grid"
      columns="grid-cols-1 md:grid-cols-3"
      aspectRatio="aspect-4/3"
    />
  ),
  errorFallback: <ListError title="갤러리를 불러올 수 없어요" />,
});
