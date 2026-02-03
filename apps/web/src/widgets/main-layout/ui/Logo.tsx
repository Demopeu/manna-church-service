import Image from 'next/image';
import Link from 'next/link';

export function Logo({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <Link href="/" className="flex shrink-0 items-center gap-2">
      <div className="flex items-center">
        <Image src="/logo.svg" alt="Logo" width={40} height={40} />
        <div className="ml-1 flex flex-col leading-none">
          <span className="text-[8px] -tracking-widest text-[#5B4BA0] lg:text-[10px]">
            {subtitle}
          </span>
          <h1 className="text-2xl font-black text-gray-800 lg:text-3xl">
            {title}
          </h1>
        </div>
      </div>
    </Link>
  );
}
