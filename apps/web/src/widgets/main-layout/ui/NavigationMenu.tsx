'use client';

import Link from 'next/link';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/shared/ui';
import { menuData } from './data';

export function MainNavigationMenu() {
  return (
    <div className="hidden flex-1 justify-center lg:flex">
      <NavigationMenu>
        <NavigationMenuList className="gap-8">
          {Object.entries(menuData).map(([title]) => (
            <NavigationMenuItem key={title}>
              <NavigationMenuTrigger className="bg-transparent text-lg font-black text-gray-700 hover:bg-transparent hover:text-black data-[state=open]:bg-transparent data-[state=open]:text-gray-900 [&>svg]:hidden">
                {title}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="fixed right-0 left-0 w-screen border-t border-gray-100 bg-white shadow-lg">
                  <div className="container mx-auto px-4 py-8">
                    <div className="flex justify-center gap-16">
                      {Object.entries(menuData).map(
                        ([groupTitle, groupItems]) => (
                          <div key={groupTitle} className="min-w-30">
                            <h4 className="mb-4 text-base font-semibold text-gray-700">
                              {groupTitle}
                            </h4>
                            <ul className="space-y-3">
                              {groupItems.map((item) => (
                                <li key={item.title}>
                                  <NavigationMenuLink asChild>
                                    <Link
                                      href={item.href}
                                      className="hover:bg-manna/20 hover:fond-extrabold text-sm text-gray-600 transition-colors hover:text-gray-900"
                                    >
                                      {item.title}
                                    </Link>
                                  </NavigationMenuLink>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
