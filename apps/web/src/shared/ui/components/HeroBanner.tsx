import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { NotImage } from '@/shared/ui';

export interface HeroBannerProps {
  title: string;
  subtitle: string;
  breadcrumbs: { label: string; href?: string }[];
  backgroundImage?: string;
}

export function HeroBanner({
  title,
  subtitle,
  breadcrumbs,
  backgroundImage,
}: HeroBannerProps) {
  return (
    <div className="relative h-[250px] overflow-hidden rounded-2xl">
      {backgroundImage ? (
        <Image
          src={backgroundImage}
          alt={`${title} 페이지 배경`}
          fill
          className="object-cover"
          priority
          sizes="70vw"
        />
      ) : (
        <NotImage />
      )}

      <div className="absolute inset-0 bg-black/40" />

      <div className="relative flex h-full flex-col justify-center px-8 md:px-12">
        <nav
          aria-label="Breadcrumb"
          className="mb-4 flex items-center gap-2 text-sm text-white/80"
        >
          <Link
            href="/"
            className="transition-colors hover:text-white"
            aria-label="홈페이지로 이동"
          >
            <Home className="h-4 w-4" />
            <span className="sr-only">Home</span>
          </Link>
          {breadcrumbs.map((item, index) => (
            <span key={index} className="flex items-center gap-2">
              <ChevronRight className="h-4 w-4 text-white/60" />
              {item.href ? (
                <Link
                  href={item.href}
                  className="transition-colors hover:text-white"
                  aria-label={`${item.label} 페이지로 이동`}
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-white">{item.label}</span>
              )}
            </span>
          ))}
        </nav>

        <h1 className="mb-3 text-3xl font-bold text-balance text-white md:text-4xl">
          {title}
        </h1>

        <p className="text-korean-pretty text-xl font-medium text-white/90">
          {subtitle}
        </p>
      </div>
    </div>
  );
}
