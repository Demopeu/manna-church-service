interface BoardSkeletonProps {
  variant: 'board';
  count?: number;
}

interface CardGridSkeletonProps {
  variant: 'card-grid';
  count?: number;
  columns?: string;
  aspectRatio?: string;
}

type ListSkeletonProps = BoardSkeletonProps | CardGridSkeletonProps;

export function ListSkeleton(props: ListSkeletonProps) {
  if (props.variant === 'board') {
    const { count = 10 } = props;
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-5 w-20 animate-pulse rounded-md bg-slate-200" />
          <div className="flex">
            <div className="h-10 w-48 animate-pulse rounded-l-md bg-slate-200 md:w-64" />
            <div className="h-10 w-10 animate-pulse rounded-r-md bg-slate-200" />
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200">
          <div className="divide-y divide-slate-200">
            {Array.from({ length: count }).map((_, index) => (
              <div
                key={index}
                className="flex items-center gap-4 px-4 py-4 md:px-6"
              >
                <div className="h-5 w-12 shrink-0 animate-pulse rounded bg-slate-200" />
                <div className="h-5 flex-1 animate-pulse rounded bg-slate-200" />
                <div className="h-5 w-24 shrink-0 animate-pulse rounded bg-slate-200" />
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center">
          <div className="h-10 w-64 animate-pulse rounded-md bg-slate-200" />
        </div>
      </div>
    );
  }

  const {
    count = 6,
    columns = 'grid-cols-2 md:grid-cols-3',
    aspectRatio = 'aspect-3/4',
  } = props;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="h-5 w-20 animate-pulse rounded-md bg-slate-200" />
        <div className="h-10 w-64 animate-pulse rounded-full bg-slate-200" />
      </div>

      <div className={`grid gap-4 md:gap-6 ${columns}`}>
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="space-y-3">
            <div
              className={`${aspectRatio} animate-pulse rounded-xl bg-slate-200`}
            />
            <div className="h-5 w-3/4 animate-pulse rounded bg-slate-200" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-slate-200" />
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <div className="h-10 w-64 animate-pulse rounded-md bg-slate-200" />
      </div>
    </div>
  );
}
