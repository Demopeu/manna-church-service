'use client';

import Image from 'next/image';
import { Button } from '@/shared/ui';
import { usePWA } from '../model/usePWA';

export function PWAInstallPrompt() {
  const { isInstallable, installApp, closePrompt } = usePWA();

  if (!isInstallable) return null;

  return (
    <>
      <div
        className="animate-in fade-in fixed inset-0 z-40 bg-black/30 duration-300"
        onClick={closePrompt}
        aria-hidden="true"
      />

      <div className="animate-in slide-in-from-bottom-full fixed right-0 bottom-0 left-0 z-50 mx-auto w-full max-w-md transform overflow-hidden rounded-t-2xl bg-white p-5 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] transition-all duration-300 md:bottom-4 md:rounded-2xl">
        <div className="mx-auto mb-5 h-1.5 w-12 shrink-0 rounded-full bg-gray-300" />

        <div className="mb-6 flex items-start justify-between gap-6">
          <div className="flex flex-col">
            <h2 className="text-xl leading-tight font-bold text-gray-900 sm:text-2xl">
              간편하게 만나교회 소식을
              <br />
              알고 싶으신가요?
            </h2>
            <p className="mt-3 text-sm font-medium text-gray-600 sm:text-base">
              지금 바로 만나교회 앱에서 확인해보세요!
            </p>
          </div>

          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl shadow-md sm:h-24 sm:w-24">
            <Image
              src="/icons/icon-512x512.png"
              alt="만나교회 앱 아이콘"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 80px, 96px"
            />
          </div>
        </div>

        <Button
          onClick={installApp}
          className="bg-manna-dark-blue w-full rounded-xl py-6 text-lg font-bold text-white shadow-md transition-transform hover:bg-[#253959] active:scale-[0.98]"
        >
          만나교회 앱에서 확인
        </Button>
        <button
          onClick={closePrompt}
          className="mt-1 w-full py-3 text-center text-sm font-medium text-gray-500 transition-colors hover:text-gray-800 hover:underline"
        >
          모바일 웹으로 볼래요
        </button>
      </div>
    </>
  );
}
