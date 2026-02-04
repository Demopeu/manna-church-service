import { AboutSidebar } from '@/widgets/about-layout';

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1">
      <div className="mx-auto flex w-full max-w-7xl gap-8 px-4 py-8">
        <AboutSidebar />
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
