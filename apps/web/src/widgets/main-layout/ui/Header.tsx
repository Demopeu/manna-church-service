import { Logo } from './Logo';

export function MainHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4">
        <Logo />
      </nav>
    </header>
  );
}
