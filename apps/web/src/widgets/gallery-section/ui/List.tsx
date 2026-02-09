import Image from 'next/image';
import Link from 'next/link';
import { getGalleries } from '@/entities/gallery/api/queries';
import { formatKoreanDate } from '@/shared/lib';
import {
  ContentWrapper,
  ListError,
  ListSkeleton,
  withAsyncBoundary,
} from '@/shared/ui';

interface Props {
  query: string;
  page: number;
}

async function List({ query, page }: Props) {
  const limit = 6;

  const { galleries, totalPages, totalCount } = await getGalleries({
    query,
    page,
    limit,
  });

  return (
    <ContentWrapper
      totalCount={totalCount}
      totalPages={totalPages}
      currentPage={page}
      currentQuery={query}
    >
      {galleries.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {galleries.map((gallery) => (
            <Link
              key={gallery.id}
              href={`/news/gallery/${gallery.id}`}
              className="group focus-visible:ring-manna rounded-xl text-left focus:outline-none focus-visible:ring-2"
            >
              <div className="relative aspect-4/3 overflow-hidden rounded-xl shadow-md transition-shadow group-hover:shadow-lg">
                {gallery.thumbnailUrl ? (
                  <Image
                    src={gallery.thumbnailUrl}
                    alt={gallery.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-gray-100 to-gray-200">
                    <svg
                      className="h-10 w-10 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                )}
              </div>

              <div className="mt-3 space-y-1">
                <h3 className="text-manna-dark-blue font-bold group-hover:underline">
                  {gallery.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {formatKoreanDate(gallery.eventDate)} &middot;{' '}
                  {gallery.images.length}장
                </p>
              </div>
            </Link>
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
