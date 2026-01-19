import { MainHeader, Sidebar, SidebarProvider } from '@/widgets/main-layout';
import { getMyProfile } from '@/entities/user';

interface Props {
  children: React.ReactNode;
}

export default async function layout({ children }: Props) {
  const profile = await getMyProfile();
  return (
    <SidebarProvider>
      <div className="bg-background flex h-screen">
        <Sidebar />
        <main className="flex min-w-0 flex-1 flex-col">
          {' '}
          <MainHeader name={profile.name?.display_name || '관리자'} />
          <div className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
