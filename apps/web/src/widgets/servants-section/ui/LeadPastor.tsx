import Image from 'next/image';
import { Phone } from 'lucide-react';
import type { Servant } from '@/entities/servant';

interface Props {
  data: Servant;
}

export function LeadPastorSection({ data }: Props) {
  return (
    <section>
      <h2 className="text-foreground border-manna mb-6 border-b-2 pb-2 text-xl font-bold">
        {data.role}
      </h2>
      <div className="bg-manna-dark-blue mx-auto flex max-w-xs flex-col items-center gap-6 rounded-2xl p-6 sm:max-w-xl sm:flex-row md:gap-10 md:p-8">
        <div className="h-40 w-40 shrink-0 overflow-hidden rounded-2xl bg-white/10 shadow-lg md:h-52 md:w-52">
          <Image
            src={data.photoFile || '/placeholder.svg'}
            alt={`${data.name} ${data.role} 프로필 사진`}
            width={208}
            height={208}
            className="h-full w-full object-cover"
            unoptimized
          />
        </div>

        <div className="flex-1 text-center sm:text-left">
          <p className="mb-1 text-sm text-white md:text-base">{data.role}</p>
          <h3 className="mb-4 text-3xl font-bold text-white md:text-4xl">
            {data.name}{' '}
            <span className="text-xl font-normal md:text-2xl">목사</span>
          </h3>

          {data.contact && (
            <div className="mb-4 flex items-center justify-center gap-2 text-white sm:justify-start">
              <Phone className="h-5 w-5" />
              <span className="text-lg font-medium md:text-xl">
                {data.contact}
              </span>
            </div>
          )}

          {data.introduction && (
            <p className="text-sm leading-relaxed whitespace-pre-wrap text-white">
              {data.introduction}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
