import Image from 'next/image';
import { Servant } from '@/entities/servant';

interface Props {
  pastors: Servant[];
}

export function AssociatePastorList({ pastors }: Props) {
  if (pastors.length === 0) return null;

  return (
    <section>
      <h2 className="text-foreground border-manna mb-6 border-b-2 pb-2 text-xl font-bold">
        협동목사
      </h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {pastors.map((pastor) => (
          <div
            key={pastor.id}
            className="bg-card border-border flex items-center gap-5 rounded-xl border p-5 shadow-sm"
          >
            <div className="bg-muted h-24 w-24 shrink-0 overflow-hidden rounded-xl md:h-28 md:w-28">
              <Image
                src={pastor.photoFile || '/placeholder.svg'}
                alt={`${pastor.name} ${pastor.role}`}
                width={112}
                height={112}
                className="h-full w-full object-cover"
              />
            </div>

            <div>
              <p className="text-muted-foreground mb-1 text-sm">
                {pastor.introduction || pastor.role}{' '}
              </p>
              <h3 className="text-manna-dark-blue text-xl font-bold">
                {pastor.name}{' '}
                <span className="text-foreground text-base font-normal">
                  목사
                </span>
              </h3>
              {pastor.contact && (
                <p className="text-muted-foreground mt-1 text-xs">
                  {pastor.contact}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
