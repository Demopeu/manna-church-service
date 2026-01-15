import { Sidebar, SidebarProvider } from '@/widgets/main-sidebar';
interface Props {
  children: React.ReactNode;
}

export default function layout({ children }: Props) {
  return (
    <SidebarProvider>
      <div className="bg-background flex h-screen">
        <Sidebar />
        <main className="flex min-w-0 flex-1 flex-col"> {children}</main>
      </div>
    </SidebarProvider>
  );
}
