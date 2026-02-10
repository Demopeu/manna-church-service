import Image from 'next/image';
import Link from 'next/link';
import { getRecentGalleries } from '@/entities/gallery';
import { formatKoreanDate } from '@/shared/lib';
import {
  AspectRatio,
  Button,
  Card,
  CardContent,
  ReadMoreButton,
  SectionWrapper,
  withAsyncBoundary,
} from '@/shared/ui';

async function GallerySectionBase() {
  const galleries = await getRecentGalleries();

  if (!galleries || galleries.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
      {galleries.slice(0, 4).map((item) => (
        <Link
          key={item.id}
          href={`/news/gallery/${item.title}-${item.shortId}`}
        >
          <Card className="group cursor-pointer overflow-hidden border-0 p-0 shadow-md transition-all duration-300 hover:shadow-lg">
            <CardContent className="p-0">
              <AspectRatio ratio={4 / 3}>
                <div className="bg-muted relative h-full w-full">
                  {item.thumbnailUrl ? (
                    <Image
                      src={item.thumbnailUrl}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 50vw, 25vw"
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

                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 p-4 text-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <h4 className="mb-2 line-clamp-2 text-sm leading-tight font-bold text-white md:text-base">
                      {item.title}
                    </h4>
                    <p className="mb-4 text-xs text-white/80">
                      {formatKoreanDate(item.eventDate)}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-white/50 bg-transparent text-xs text-white hover:bg-white/20"
                    >
                      자세히 보기
                    </Button>
                  </div>
                </div>
              </AspectRatio>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}

function GallerySkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="border-0 p-0 shadow-none">
          <CardContent className="p-0">
            <AspectRatio ratio={4 / 3}>
              <div className="h-full w-full animate-pulse rounded-md bg-gray-200" />
            </AspectRatio>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

const GallerySectionList = withAsyncBoundary(GallerySectionBase, {
  loadingFallback: <GallerySkeleton />,
  errorFallback: null,
});

export function GallerySection() {
  return (
    <SectionWrapper className="bg-white">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-10 flex items-center justify-between">
          <h3 className="text-foreground text-2xl font-bold md:text-4xl">
            갤러리
          </h3>
          <ReadMoreButton href="/news/gallery" variant="manna" />
        </div>
        <GallerySectionList />
      </div>
    </SectionWrapper>
  );
}
