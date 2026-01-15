import Image from 'next/image';

interface Props {
  src: string;
  alt: string;
}

export function GalleryItem({ src, alt }: Props) {
  return (
    <>
      <div
        key={alt}
        className="relative aspect-square w-full overflow-hidden rounded-lg"
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 33vw, 160px"
          className="object-cover"
        />
      </div>
    </>
  );
}
