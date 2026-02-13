import Image from 'next/image';
import Link from 'next/link';
import InstagramIcon from '@/app/asset/icons/instagram.webp';
import YoutubeIcon from '@/app/asset/icons/youtube.webp';
import { churchData } from '@/shared/config';

export function Icon() {
  return (
    <div className="flex items-center gap-1">
      <Link
        href={churchData.social.youtube}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-full transition-colors hover:bg-gray-100"
        aria-label="만나교회 YouTube 채널 바로가기"
      >
        <Image
          src={YoutubeIcon}
          alt="만나교회 YouTube 채널 아이콘"
          width={28}
          height={28}
        />
        <span className="sr-only">YouTube</span>
      </Link>
      <Link
        href={churchData.social.instagram}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-full transition-colors hover:bg-gray-100"
        aria-label="만나교회 Instagram 바로가기"
      >
        <Image
          src={InstagramIcon}
          alt="만나교회 Instagram 아이콘"
          width={28}
          height={28}
        />
        <span className="sr-only">Instagram</span>
      </Link>
    </div>
  );
}
