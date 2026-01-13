import { Header } from '@/widgets/main-header/ui/Header';

interface Props {
  children: React.ReactNode;
}

export default function layout({ children }: Props) {
  return (
    <>
      <Header pageTitle="섬기는 사람들" />
      <div className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">{children}</div>
    </>
  );
}
