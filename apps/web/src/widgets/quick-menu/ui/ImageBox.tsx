import Image from 'next/image';
import bgImage from '@/app/asset/default/youtube_imageUrl.png';
import { SermonOverlay } from './OverLay';

export function YoutubeImageBox() {
  return (
    <div className="group relative block aspect-video w-full min-w-0 overflow-hidden rounded-xl bg-gray-900 shadow-lg">
      <Image
        src={bgImage}
        alt="최신 설교 영상 썸네일"
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        priority
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        unoptimized
      />

      <div className="absolute inset-0 bg-black/30 transition-colors duration-300 group-hover:bg-black/40" />
      <SermonOverlay />
    </div>
  );
}
