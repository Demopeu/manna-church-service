'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { MapPin, Menu, Phone } from 'lucide-react';
import { menuData } from '@/shared/config';
import { churchData } from '@/shared/config';
import {
  Button,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/shared/ui';

export function MobileMenu() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="text-gray-600 lg:hidden">
          <Menu className="h-10 w-10" />
          <span className="sr-only">메뉴 열기</span>
        </Button>
      </SheetTrigger>

      {/* [수정 1] SheetContent (부모)
        - overflow-y-auto: 전체 영역에 스크롤 생성
        - h-dvh: 화면 전체 높이 사용
        - flex-col 제거: 내부 wrapper가 layout을 담당하므로 제거
      */}
      <SheetContent
        side="right"
        className="h-dvh w-3/5! overflow-y-auto p-0 md:w-1/3!"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>만나교회</SheetTitle>
          <SheetDescription>
            모바일 메뉴 탐색 및 교회 연락처 정보입니다.
          </SheetDescription>
        </SheetHeader>

        {/* [수정 2] Layout Wrapper 추가
          - min-h-dvh: 내용이 없어도 최소 화면 높이만큼 확보 (Footer를 바닥으로 밀어냄)
          - flex flex-col: 세로 배치
        */}
        <div className="flex min-h-dvh flex-col">
          {/* Header 영역 (시각적으로 보이는 부분) */}
          <div className="p-6 pb-0">
            {/* 필요하다면 여기에 로고 등을 넣거나, 여백 용도로 유지 */}
          </div>

          {/* [수정 3] 메뉴 영역
            - flex-1: 남은 공간을 모두 차지하여 Footer를 아래로 밈
            - overflow-y-auto 제거: 부모가 스크롤하므로 제거
          */}
          <div className="flex-1 px-6 py-6">
            <div className="flex flex-col gap-6">
              {Object.entries(menuData).map(([title, items]) => (
                <div key={title}>
                  <div className="mb-2 ml-4 text-xl font-medium text-gray-700">
                    {title}
                  </div>

                  <div className="flex flex-col gap-2 pl-8">
                    {items.map((item) => (
                      <Link
                        key={item.title}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="hover:text-manna py-2 text-base text-gray-500 transition-colors"
                      >
                        {item.title}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* [수정 4] Footer 영역
            - 이제 문서 흐름의 맨 마지막에 위치함
            - 내용이 길면 스크롤해야 보이고, 짧으면 화면 맨 아래에 위치함
          */}
          <div className="border-t border-gray-100 bg-gray-50 p-6 text-xs text-gray-500">
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 shrink-0 text-gray-400" />
                <span>{churchData.address}</span>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-gray-400" />
                <span>{churchData.phone}</span>
              </div>

              <div className="mt-2 text-[10px] text-gray-400">
                © 2026 {churchData.copyright} All rights reserved.
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
