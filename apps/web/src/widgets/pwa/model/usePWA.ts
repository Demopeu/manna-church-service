'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import { usePathname } from 'next/navigation';
import { pwaStore } from './store';

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

const MIN_PAGE_VIEWS = 3;

function checkShouldShowPrompt(currentViews: number, isCoolingDown: boolean) {
  const userAgent = navigator.userAgent;
  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      userAgent,
    ) ||
    (/Macintosh/i.test(userAgent) && navigator.maxTouchPoints > 1);

  return isMobile && !isCoolingDown && currentViews >= MIN_PAGE_VIEWS;
}

export function usePWA() {
  const pathname = usePathname();
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  const isPolicySatisfied = useSyncExternalStore(
    pwaStore.subscribe,
    () => {
      const { views, isCoolingDown } = pwaStore.getSnapshot();
      return checkShouldShowPrompt(views, isCoolingDown);
    },
    () => false,
  );

  const isInstallable = !!deferredPrompt && isPolicySatisfied;

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
    if (pathname !== '/') {
      pwaStore.incrementViews();
    }
  }, [pathname]);

  const installApp = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      pwaStore.setCooldown();
    }
    setDeferredPrompt(null);
  };

  const closePrompt = () => {
    pwaStore.setCooldown();
    setDeferredPrompt(null);
  };

  return { isInstallable, installApp, closePrompt };
}
