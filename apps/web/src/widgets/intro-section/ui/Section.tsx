import Image from 'next/image';
import leadPastor from '@/app/asset/about/LEADPASTOR.webp';
import signature from '@/app/asset/about/signature.webp';
import { pastorData } from './data';

export function PastorGreetingIntroSection() {
  const { profile, greeting } = pastorData;

  return (
    <section className="space-y-8">
      <div className="flex flex-col items-start gap-8 sm:flex-row">
        <div className="w-full shrink-0 sm:w-48 md:w-56 lg:w-64">
          <div className="bg-manna-dark-blue/20 relative mx-16 aspect-4/5 overflow-hidden rounded-2xl shadow-lg sm:mx-0">
            <Image
              src={leadPastor}
              alt={`${profile.role} ${profile.name} 프로필 사진`}
              fill
              className="object-cover object-top"
              priority
              sizes="100vw"
            />
          </div>
          <p className="text-manna-dark-blue mt-3 text-center font-medium">
            {profile.role} {profile.name}
          </p>
        </div>

        <div className="flex-1 space-y-6">
          <h2 className="text-manna-dark-blue text-korean-pretty text-2xl leading-relaxed font-bold md:text-3xl">
            {greeting.title.map((text, index) => (
              <span key={index} className="block sm:inline">
                {text}{' '}
              </span>
            ))}
          </h2>

          <div className="text-foreground/80 space-y-4 leading-relaxed">
            {greeting.messages.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          <div className="border-border mt-8 flex items-center justify-end gap-2 border-t pt-6">
            <p className="text-manna-dark-blue font-semibold">{profile.role}</p>
            <div className="relative h-12 w-32 md:h-14 md:w-40">
              <Image
                src={signature}
                alt={`${profile.name} 서명`}
                fill
                className="object-contain object-right"
                sizes="(max-width: 768px) 128px, 160px"
                unoptimized
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
