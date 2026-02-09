'use client';

import { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export function ScrollFAB() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToBottom = () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  return (
    <div className="fixed right-6 bottom-6 z-50 flex flex-col items-center">
      <div className="flex flex-col divide-y divide-slate-100 overflow-hidden rounded-full border border-slate-100 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            showScrollTop ? 'max-h-12 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <button
            onClick={scrollToTop}
            className="hover:bg-church-blue active:bg-church-blue/90 flex h-12 w-12 items-center justify-center text-slate-500 transition-colors hover:scale-110 hover:text-slate-700"
            aria-label="맨 위로"
            type="button"
          >
            <ChevronUp className="h-5 w-5" />
          </button>
        </div>

        <button
          onClick={scrollToBottom}
          className="hover:bg-church-blue active:bg-church-blue/90 flex h-12 w-12 items-center justify-center text-slate-500 transition-colors hover:scale-110 hover:text-slate-700"
          aria-label="맨 아래로"
          type="button"
        >
          <ChevronDown className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
