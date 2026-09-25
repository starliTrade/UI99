/**
 * UI99 — Safe Storage Access
 *
 * `localStorage` is NOT guaranteed to be accessible: embedded preview iframes
 * (third-party context), Safari private browsing, and hardened browser configs
 * all throw a SecurityError on access. A bare `localStorage.getItem(...)` at
 * module scope or inside a React state initializer crashes the entire app boot
 * → blank preview — invisible to curl and to jsdom tests (which always have
 * healthy storage). Every storage touchpoint MUST go through this module.
 */

const memoryFallback = new Map<string, string>();

function usableStorage(): Storage | null {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return null;
    // Access itself can throw (blocked storage) — force the check.
    const probe = window.localStorage;
    probe.getItem('__ui99_probe__');
    return probe;
  } catch {
    return null;
  }
}

export function safeGetItem(key: string): string | null {
  const storage = usableStorage();
  if (storage) {
    try {
      return storage.getItem(key);
    } catch {
      /* fall through to memory */
    }
  }
  return memoryFallback.get(key) ?? null;
}

export function safeSetItem(key: string, value: string): void {
  const storage = usableStorage();
  if (storage) {
    try {
      storage.setItem(key, value);
      return;
    } catch {
      /* fall through to memory */
    }
  }
  memoryFallback.set(key, value);
}

export function safeRemoveItem(key: string): void {
  const storage = usableStorage();
  if (storage) {
    try {
      storage.removeItem(key);
    } catch {
      /* ignore */
    }
  }
  memoryFallback.delete(key);
}
