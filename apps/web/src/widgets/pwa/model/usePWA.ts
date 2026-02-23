'use client';

import { useEffect, useState } from 'react';

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

export function usePWA() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      if (typeof window === 'undefined') return false;

      const userAgent = navigator.userAgent;
      const isMobileRegex =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          userAgent,
        );

      const isMacWithTouch =
        /Macintosh/i.test(userAgent) && navigator.maxTouchPoints > 1;

      return isMobileRegex || isMacWithTouch;
    };

    const mobileDetected = checkIsMobile();

    const handleBeforeInstallPrompt = (e: Event) => {
      if (isBeforeInstallPromptEvent(e)) {
        e.preventDefault();
        setDeferredPrompt(e);

        if (mobileDetected) {
          setIsInstallable(true);
        }
      } else {
        console.debug('알 수 없는 beforeinstallprompt 이벤트 무시됨');
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    window.addEventListener('appinstalled', () => {
      setIsInstallable(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt,
      );
    };
  }, []);

  const installApp = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setIsInstallable(false);
    }
    setDeferredPrompt(null);
  };

  const closePrompt = () => setIsInstallable(false);

  return { isInstallable, installApp, closePrompt };
}
