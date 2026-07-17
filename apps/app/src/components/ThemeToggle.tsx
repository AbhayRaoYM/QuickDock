import { useThemeStore } from '@/store/themeStore';
import type { ThemeMode } from '@/store/themeStore';

const OPTIONS: { value: ThemeMode; label: string }[] = [
  { value: 'light', label: 'Light' },
  { value: 'system', label: 'System' },
  { value: 'dark', label: 'Dark' },
];

/**
 * ThemeToggle — compact three-way toggle (Light / System / Dark).
 * Placed at the bottom of the sidebar.
 */
export default function ThemeToggle() {
  const { mode, setMode } = useThemeStore();

  return (
    <div className="flex w-full rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg-primary))] p-0.5">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => setMode(opt.value)}
          className={[
            'flex-1 rounded-md py-1.5 text-xs font-medium transition-colors',
            mode === opt.value
              ? 'bg-[rgb(var(--color-accent))] text-white'
              : 'text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text-primary))]',
          ].join(' ')}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
