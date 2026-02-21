import Image from 'next/image';
import Link from 'next/link';
import BandIcon from '@/app/asset/icons/band.webp';
import InstagramIcon from '@/app/asset/icons/instagram.webp';
import { churchData } from '@/shared/config';

export function Icon() {
  return (
    <div className="flex items-center gap-1">
      <Link
        href={churchData.social.band}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-full transition-colors hover:bg-gray-100"
        aria-label="만나교회 Band 바로가기"
      >
        <Image
          src={BandIcon}
          alt="만나교회 Band 아이콘"
          width={28}
          height={28}
          unoptimized
        />
        <span className="sr-only">Band</span>
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
          unoptimized
        />
        <span className="sr-only">Instagram</span>
      </Link>
    </div>
  );
}
