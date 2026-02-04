import Image from 'next/image';
import Link from 'next/link';
import { socialData } from './data';

export function Icon() {
  return (
    <div className="flex items-center gap-1">
      <Link
        href={socialData.youtube}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-full transition-colors hover:bg-gray-100"
      >
        <Image src="/icons/youtube.webp" alt="YouTube" width={28} height={28} />
        <span className="sr-only">YouTube</span>
      </Link>
      <Link
        href={socialData.instagram}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-full transition-colors hover:bg-gray-100"
      >
        <Image
          src="/icons/instagram.webp"
          alt="Instagram"
          width={28}
          height={28}
        />
        <span className="sr-only">Instagram</span>
      </Link>
    </div>
  );
}
