import Image from 'next/image';
import Link from 'next/link';
import { Items } from '../const/Item';

export function QuickMenu() {
  return (
    <section className="bg-manna-yellow/20 py-12 md:py-24 xl:py-30">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <h2 className="text-foreground mb-2 text-2xl font-bold whitespace-nowrap md:text-3xl lg:text-4xl">
            Welcome to Manna Church
          </h2>
          <p className="text-muted-foreground whitespace-nowrap md:text-xl">
            하나님을 만나고 이웃을 만나는 교회
          </p>
        </div>

        <div className="mx-auto grid max-w-7xl grid-cols-4 gap-4 md:grid-cols-8 md:gap-6">
          {Items.map((item) => {
            return (
              <Link
                key={item.label}
                href={item.href}
                className="group flex flex-col items-center gap-2"
              >
                <div
                  className={`relative flex h-20 w-20 items-center justify-center rounded-full bg-white transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg md:h-20 md:w-20 lg:h-24 lg:w-24 xl:h-32 xl:w-32`}
                >
                  <Image
                    src={item.icon}
                    alt={item.label}
                    fill
                    className="object-contain p-4 xl:p-6"
                    sizes="80vw"
                  />
                </div>
                <span className="text-foreground text-korean-pretty text-center text-xs font-extrabold md:text-base">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
