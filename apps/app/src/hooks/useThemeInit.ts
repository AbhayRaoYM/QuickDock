import { useEffect } from 'react';
import { useThemeStore } from '@/store/themeStore';

/**
 * useThemeInit — called once at the App root.
 *
 * Ensures the Zustand store is rehydrated and the <html> class
 * matches the persisted preference. Also listens for OS-level
 * preference changes when mode === 'system'.
 */
export function useThemeInit(): void {
  const { mode, setMode } = useThemeStore();

  useEffect(() => {
    // Re-apply on mount in case rehydration ran before DOM was ready
    setMode(mode);

    if (mode !== 'system') return;

    // Track OS changes while the app is running
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => setMode('system');
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [mode, setMode]);
}
