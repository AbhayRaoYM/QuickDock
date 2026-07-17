import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Theme can be 'light', 'dark', or 'system'.
 * 'system' defers to the OS preference via matchMedia.
 */
export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
  /** The persisted preference set by the user */
  mode: ThemeMode;
  /** The resolved effective theme (light or dark) after evaluating 'system' */
  resolved: 'light' | 'dark';
  /** Update the mode and recompute the resolved value */
  setMode: (mode: ThemeMode) => void;
}

/**
 * Resolves 'system' preference to a concrete 'light' | 'dark' value.
 */
function resolveTheme(mode: ThemeMode): 'light' | 'dark' {
  if (mode === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return mode;
}

/**
 * Applies or removes the `dark` class on <html> to activate Tailwind dark mode.
 */
function applyTheme(resolved: 'light' | 'dark'): void {
  const root = document.documentElement;
  if (resolved === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

/**
 * useThemeStore — Zustand store for application theme.
 *
 * Persists the user's chosen mode to localStorage under the key
 * 'quickdock-theme' so that the inline script in index.html can read it
 * before React hydrates (preventing FOUC).
 */
export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: 'system',
      resolved: resolveTheme('system'),

      setMode: (mode) => {
        const resolved = resolveTheme(mode);
        applyTheme(resolved);
        set({ mode, resolved });
      },
    }),
    {
      name: 'quickdock-theme',
      // Only persist the mode preference, not the resolved value
      partialize: (state) => ({ mode: state.mode }),
      // Rehydrate: recompute resolved from the persisted mode
      onRehydrateStorage: () => (state) => {
        if (state) {
          const resolved = resolveTheme(state.mode);
          state.resolved = resolved;
          applyTheme(resolved);
        }
      },
    }
  )
);
