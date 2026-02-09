import { MainHeader, Sidebar, SidebarProvider } from '@/widgets/main-layout';

interface Props {
  children: React.ReactNode;
}

export const dynamic = 'force-dynamic';

export default function layout({ children }: Props) {
  return (
    <SidebarProvider>
      <div className="bg-background flex h-screen">
        <Sidebar />
        <main className="flex min-w-0 flex-1 flex-col">
          <MainHeader />
          <div className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
