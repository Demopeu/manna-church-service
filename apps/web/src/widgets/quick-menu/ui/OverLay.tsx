import { Play } from 'lucide-react';
import { cn } from '@repo/ui/lib';
import { getLatestSermon } from '@/entities/sermon';
import { withAsyncBoundary } from '@/shared/ui';
import { YoutubeImageBoxItem } from '../const/Item';

async function SermonOverlayBase() {
  const sermon = await getLatestSermon();

  const { title, preacher, date, videoUrl } = sermon ?? {
    title: YoutubeImageBoxItem.title,
    preacher: YoutubeImageBoxItem.preacher,
    date: YoutubeImageBoxItem.date,
    videoUrl: YoutubeImageBoxItem.videoUrl,
  };

  return (
    <a
      href={videoUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="absolute inset-0 z-10 flex items-center justify-center"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-red-600/90 group-hover:text-white">
        <Play className="ml-1 h-8 w-8 fill-current" />
      </div>

      <div className="absolute bottom-0 left-0 w-full bg-linear-to-t from-black/90 via-black/60 to-transparent px-6 pt-12 pb-6">
        <div className="flex flex-col gap-2">
          {YoutubeImageBoxItem.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {YoutubeImageBoxItem.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-medium text-white backdrop-blur-md md:text-xs"
                >
                  {tag.startsWith('#') ? tag : `#${tag}`}
                </span>
              ))}
            </div>
          )}

          <div className="text-white">
            <h3 className="line-clamp-1 text-lg font-bold md:text-xl">
              {title}
            </h3>
            <div className="mt-1 flex items-center gap-2 text-xs opacity-90 md:text-sm">
              <span className="font-semibold">{preacher}</span>
              <span className="h-3 w-px bg-white/50" />
              <span>{date}</span>
            </div>
          </div>
        </div>
      </div>
    </a>
  );
}

interface Props {
  variant: 'skeleton' | 'fallback';
}

function SermonOverlayPlaceholder({ variant }: Props) {
  const isSkeleton = variant === 'skeleton';
  const { title, preacher, date } = YoutubeImageBoxItem;

  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm">
        <Play
          className={cn(
            'ml-1 h-8 w-8 fill-current',
            isSkeleton ? 'opacity-50' : 'opacity-100',
          )}
        />
      </div>

      <div className="absolute bottom-0 left-0 w-full bg-linear-to-t from-black/90 via-black/60 to-transparent px-6 pt-12 pb-6">
        <div className="flex flex-col gap-2">
          {YoutubeImageBoxItem.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {YoutubeImageBoxItem.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-medium text-white backdrop-blur-md md:text-xs"
                >
                  {tag.startsWith('#') ? tag : `#${tag}`}
                </span>
              ))}
            </div>
          )}

          <div className="text-white">
            {isSkeleton ? (
              <div className="mb-2 h-7 w-3/4 animate-pulse rounded bg-white/20" />
            ) : (
              <h3 className="line-clamp-1 text-lg font-bold md:text-xl">
                {title}
              </h3>
            )}

            <div className="mt-1 flex items-center gap-2 text-xs opacity-90 md:text-sm">
              {isSkeleton ? (
                <>
                  <div className="h-4 w-16 animate-pulse rounded bg-white/20" />
                  <span className="h-3 w-px bg-white/20" />
                  <div className="h-4 w-24 animate-pulse rounded bg-white/20" />
                </>
              ) : (
                <>
                  <span className="font-semibold">{preacher}</span>
                  <span className="h-3 w-px bg-white/50" />
                  <span>{date}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const SermonOverlay = withAsyncBoundary(SermonOverlayBase, {
  loadingFallback: <SermonOverlayPlaceholder variant="skeleton" />,
  errorFallback: <SermonOverlayPlaceholder variant="fallback" />,
});
