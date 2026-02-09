'use client';

import { useRef } from 'react';
import { ShieldCheck, X } from 'lucide-react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui';
import {
  PRIVACY_EFFECTIVE_DATE,
  PRIVACY_POLICY,
  PRIVACY_TITLE,
} from '../config/privacy';

export function PrivacyDialog() {
  const closeRef = useRef<HTMLButtonElement>(null);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="inline-flex cursor-pointer items-center gap-1 text-xs text-slate-500 transition-colors hover:text-slate-300"
        >
          <span>{PRIVACY_TITLE}</span>
        </button>
      </DialogTrigger>

      <DialogContent
        className="inset-0 block max-w-none translate-x-0 translate-y-0 overflow-y-auto rounded-none border-none bg-transparent p-0 shadow-none duration-0 data-[state=closed]:animate-none data-[state=open]:animate-none [&>button]:hidden"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            closeRef.current?.click();
          }
        }}
      >
        <div className="bg-background relative mx-auto my-8 w-full max-w-2xl rounded-lg border p-6 shadow-lg sm:my-12">
          <DialogClose
            ref={closeRef}
            className="absolute top-4 right-4 cursor-pointer rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">닫기</span>
          </DialogClose>

          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <ShieldCheck className="h-5 w-5" />
              {PRIVACY_TITLE}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm">
              만나교회 개인정보 처리에 관한 방침입니다.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {PRIVACY_POLICY.map((section) => (
              <article key={section.id}>
                {section.title && (
                  <h3 className="mb-2 text-sm font-semibold">
                    {section.title}
                  </h3>
                )}
                <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">
                  {section.content}
                </p>
              </article>
            ))}
          </div>

          <div className="border-t pt-4">
            <p className="text-muted-foreground text-center text-xs">
              {PRIVACY_EFFECTIVE_DATE}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
