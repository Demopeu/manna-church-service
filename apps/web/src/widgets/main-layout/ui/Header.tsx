import { Icon } from './Icon';
import { Logo } from './Logo';
import { MobileMenu } from './MobileMenu';
import { MainNavigationMenu } from './NavigationMenu';

export function MainHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:h-30">
        <Logo title="만나교회" subtitle="하나님을 만나고 이웃을 만나는" />
        <MainNavigationMenu />
        <div className="flex shrink-0 items-center gap-1">
          <Icon />
          <MobileMenu
            address="경기도 성남시 분당구 양현로 353"
            phone="010-1234-5678"
          />
        </div>
      </nav>
    </header>
  );
}
