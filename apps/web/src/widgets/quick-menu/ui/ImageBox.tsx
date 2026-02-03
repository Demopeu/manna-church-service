import Image from 'next/image';
import { Play } from 'lucide-react';
import type { Sermon } from '@/entities/sermon/model/sermon';
import { YoutubeImageBoxItem } from '../const/Item';

interface Props {
  sermon: Sermon | null;
}

export function YoutubeImageBox({ sermon }: Props) {
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
      className="group relative block aspect-video w-full overflow-hidden rounded-xl bg-gray-900 shadow-lg"
    >
      <Image
        src={YoutubeImageBoxItem.imageUrl}
        alt={title}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        priority
        sizes="80vw"
      />

      <div className="absolute inset-0 bg-black/30 transition-colors duration-300 group-hover:bg-black/40" />

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-red-600/90 group-hover:text-white">
          <Play className="ml-1 h-8 w-8 fill-current" />
        </div>
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
