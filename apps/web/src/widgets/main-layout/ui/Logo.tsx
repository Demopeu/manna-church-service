import Image from 'next/image';
import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/" className="flex shrink-0 items-center gap-2">
      <div className="flex items-center">
        <Image src="/logo.svg" alt="Logo" width={36} height={36} />
        <div className="ml-1 flex flex-col leading-none">
          <span className="text-[8px] -tracking-widest text-[#5B4BA0]">
            하나님을 만나고, 이웃을 만나는
          </span>
          <span className="text-2xl font-black text-gray-800">만나교회</span>
        </div>
      </div>
    </Link>
  );
}
