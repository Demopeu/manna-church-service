'use client';

interface PwaState {
  views: number;
  isCoolingDown: boolean;
}

const STORAGE_KEYS = {
  VIEWS: 'pwaPageViews',
  HIDDEN_UNTIL: 'pwaPromptHiddenUntil',
};
const COOLDOWN_DAYS = 8;
const COOLDOWN_IN_MS = COOLDOWN_DAYS * 24 * 60 * 60 * 1000;

function createPwaStore() {
  const listeners = new Set<() => void>();
  let state: PwaState = { views: 0, isCoolingDown: false };

  const init = () => {
    if (typeof window === 'undefined') return;
    const views = parseInt(
      sessionStorage.getItem(STORAGE_KEYS.VIEWS) || '0',
      10,
    );
    const hiddenUntil = parseInt(
      localStorage.getItem(STORAGE_KEYS.HIDDEN_UNTIL) || '0',
      10,
    );
    const isCoolingDown = Date.now() < hiddenUntil;

    if (hiddenUntil && !isCoolingDown) {
      localStorage.removeItem(STORAGE_KEYS.HIDDEN_UNTIL);
    }

    state = { views, isCoolingDown };
  };

  init();

  const emitChange = () => {
    for (const listener of listeners) {
      listener();
    }
  };

  return {
    getSnapshot: () => state,

    subscribe: (listener: () => void) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },

    incrementViews: () => {
      if (typeof window === 'undefined') return;
      const newViews = state.views + 1;
      sessionStorage.setItem(STORAGE_KEYS.VIEWS, newViews.toString());
      state = { ...state, views: newViews };
      emitChange();
    },

    setCooldown: () => {
      if (typeof window === 'undefined') return;
      const hiddenUntil = Date.now() + COOLDOWN_IN_MS;
      localStorage.setItem(STORAGE_KEYS.HIDDEN_UNTIL, hiddenUntil.toString());
      state = { ...state, isCoolingDown: true };
      emitChange();
    },
  };
}

export const pwaStore = createPwaStore();
