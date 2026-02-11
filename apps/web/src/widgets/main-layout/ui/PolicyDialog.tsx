'use client';

import { useRef } from 'react';
import { ScrollText, X } from 'lucide-react';
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
  POLICY_EFFECTIVE_DATE,
  POLICY_TITLE,
  TERMS_OF_SERVICE,
} from '../config/policy';

export function PolicyDialog() {
  const closeRef = useRef<HTMLButtonElement>(null);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="inline-flex cursor-pointer items-center gap-1 text-xs text-slate-400 transition-colors hover:text-slate-300"
        >
          <span>{POLICY_TITLE}</span>
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
              <ScrollText className="h-5 w-5" />
              {POLICY_TITLE}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm">
              만나교회 웹사이트 이용에 관한 약관입니다.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {TERMS_OF_SERVICE.map((section) => (
              <article key={section.id}>
                <h3 className="mb-2 text-sm font-semibold">{section.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">
                  {section.content}
                </p>
              </article>
            ))}
          </div>

          <div className="border-t pt-4">
            <p className="text-muted-foreground text-center text-xs">
              {POLICY_EFFECTIVE_DATE}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
