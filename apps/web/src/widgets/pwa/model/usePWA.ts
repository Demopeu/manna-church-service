'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

function isBeforeInstallPromptEvent(e: Event): e is BeforeInstallPromptEvent {
  return 'prompt' in e && 'userChoice' in e;
}

const COOLDOWN_DAYS = 7;
const COOLDOWN_IN_MS = COOLDOWN_DAYS * 24 * 60 * 60 * 1000;
const MIN_PAGE_VIEWS = 3;

const checkShouldShowPrompt = (currentViews: number) => {
  const userAgent = navigator.userAgent;
  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      userAgent,
    ) ||
    (/Macintosh/i.test(userAgent) && navigator.maxTouchPoints > 1);

  const hiddenUntil = parseInt(
    localStorage.getItem('pwaPromptHiddenUntil') || '0',
    10,
  );
  const isCoolingDown = Date.now() < hiddenUntil;

  if (hiddenUntil && !isCoolingDown) {
    localStorage.removeItem('pwaPromptHiddenUntil');
  }

  return isMobile && !isCoolingDown && currentViews >= MIN_PAGE_VIEWS;
};

export function usePWA() {
  const pathname = usePathname();

  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const handlePrompt = (e: Event) => {
      if (isBeforeInstallPromptEvent(e)) {
        e.preventDefault();
        setDeferredPrompt(e);
      }
    };

    window.addEventListener('beforeinstallprompt', handlePrompt);
    return () =>
      window.removeEventListener('beforeinstallprompt', handlePrompt);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const prevViews = parseInt(
      sessionStorage.getItem('pwaPageViews') || '0',
      10,
    );
    const currentViews = pathname !== '/' ? prevViews + 1 : prevViews;

    if (pathname !== '/') {
      sessionStorage.setItem('pwaPageViews', currentViews.toString());
    }
  }, [pathname]);

  let isInstallable = false;

  if (typeof window !== 'undefined' && deferredPrompt && !isDismissed) {
    const currentViews = parseInt(
      sessionStorage.getItem('pwaPageViews') || '0',
      10,
    );
    isInstallable = checkShouldShowPrompt(currentViews);
  }

  const installApp = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setIsDismissed(true);
    }
    setDeferredPrompt(null);
  };

  const closePrompt = () => {
    setIsDismissed(true);

    if (typeof window !== 'undefined') {
      localStorage.setItem(
        'pwaPromptHiddenUntil',
        (Date.now() + COOLDOWN_IN_MS).toString(),
      );
    }
  };

  return { isInstallable, installApp, closePrompt };
}
