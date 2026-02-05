export function BulletinListSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="h-8 w-32 animate-pulse rounded-md bg-slate-200" />
        <div className="h-10 w-24 animate-pulse rounded-md bg-slate-200" />
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="space-y-3">
            <div className="aspect-210/297 animate-pulse rounded-lg bg-slate-200" />
            <div className="mx-auto h-5 w-24 animate-pulse rounded bg-slate-200" />
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <div className="h-10 w-64 animate-pulse rounded-md bg-slate-200" />
      </div>
    </div>
  );
}
