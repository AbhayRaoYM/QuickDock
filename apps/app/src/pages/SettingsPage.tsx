import type { ReactNode } from 'react';
import { useThemeStore } from '@/store/themeStore';
import type { ThemeMode } from '@/store/themeStore';

/**
 * SettingsPage — application-wide preferences.
 *
 * Phase 1: Static placeholder with labelled setting groups.
 * Phase 2: Read/write settings via sidecar SQLite store.
 */
export default function SettingsPage() {
  const { mode, setMode } = useThemeStore();

  return (
    <div className="page-container flex flex-col gap-8">
      {/* ── Header ────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold text-[rgb(var(--color-text-primary))]">Settings</h1>
        <p className="mt-1 text-sm text-[rgb(var(--color-text-secondary))]">
          Configure QuickDock to match your workflow.
        </p>
      </div>

      {/* ── Appearance ────────────────────────────────────────────── */}
      <SettingSection title="Appearance">
        <SettingRow
          label="Theme"
          description="Choose how QuickDock looks"
        >
          <ThemeSelector value={mode} onChange={setMode} />
        </SettingRow>
        <SettingRow
          label="Window opacity"
          description="Opacity of the floating widget"
        >
          <PlaceholderSelect options={['100%', '90%', '80%', '70%']} />
        </SettingRow>
      </SettingSection>

      {/* ── Behaviour ─────────────────────────────────────────────── */}
      <SettingSection title="Behaviour">
        <SettingRow
          label="Launch at login"
          description="Start QuickDock automatically when you log in"
        >
          <PlaceholderToggle />
        </SettingRow>
        <SettingRow
          label="Show in menu bar"
          description="Keep a shortcut in the system menu bar / tray"
        >
          <PlaceholderToggle defaultOn />
        </SettingRow>
        <SettingRow
          label="Default destination"
          description="Pre-select a destination when files are dropped"
        >
          <PlaceholderSelect options={['None', 'Slack', 'Gmail', 'Google Drive']} />
        </SettingRow>
      </SettingSection>

      {/* ── Notifications ─────────────────────────────────────────── */}
      <SettingSection title="Notifications">
        <SettingRow
          label="Share confirmation"
          description="Notify when a file has been successfully sent"
        >
          <PlaceholderToggle defaultOn />
        </SettingRow>
        <SettingRow
          label="Error alerts"
          description="Alert when a share attempt fails"
        >
          <PlaceholderToggle defaultOn />
        </SettingRow>
      </SettingSection>

      {/* ── About ─────────────────────────────────────────────────── */}
      <SettingSection title="About">
        <div className="flex flex-col gap-1 text-sm text-[rgb(var(--color-text-secondary))]">
          <InfoRow label="Version" value="0.1.0 (Phase 1)" />
          <InfoRow label="Framework" value="Tauri 2.x · React 19 · TypeScript" />
          <InfoRow label="Backend" value="Node.js 22 LTS · Fastify · SQLite" />
        </div>
      </SettingSection>
    </div>
  );
}

/* ─── Section wrapper ─────────────────────────────────────────────────────── */
function SettingSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[rgb(var(--color-text-muted))]">
        {title}
      </h2>
      <div className="card flex flex-col divide-y divide-[rgb(var(--color-border))] p-0">
        {children}
      </div>
    </section>
  );
}

function SettingRow({
  label,
  description,
  children,
}: {
  label: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-6 px-5 py-4">
      <div>
        <p className="text-sm font-medium text-[rgb(var(--color-text-primary))]">{label}</p>
        <p className="text-xs text-[rgb(var(--color-text-secondary))]">{description}</p>
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 px-5 py-2">
      <span className="w-28 text-xs text-[rgb(var(--color-text-muted))]">{label}</span>
      <span className="text-xs text-[rgb(var(--color-text-primary))]">{value}</span>
    </div>
  );
}

/* ─── Control stubs ───────────────────────────────────────────────────────── */
function ThemeSelector({
  value,
  onChange,
}: {
  value: ThemeMode;
  onChange: (v: ThemeMode) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as ThemeMode)}
      className="rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg-primary))] 
                 px-3 py-1.5 text-sm text-[rgb(var(--color-text-primary))] 
                 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-accent))]"
    >
      <option value="light">Light</option>
      <option value="system">System</option>
      <option value="dark">Dark</option>
    </select>
  );
}

function PlaceholderSelect({ options }: { options: string[] }) {
  return (
    <select
      disabled
      className="rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg-primary))] 
                 px-3 py-1.5 text-sm text-[rgb(var(--color-text-primary))] opacity-50 cursor-not-allowed"
    >
      {options.map((o) => (
        <option key={o}>{o}</option>
      ))}
    </select>
  );
}

function PlaceholderToggle({ defaultOn }: { defaultOn?: boolean }) {
  return (
    <button
      disabled
      aria-checked={defaultOn}
      role="switch"
      className={[
        'relative inline-flex h-6 w-11 flex-shrink-0 cursor-not-allowed rounded-full border-2 border-transparent',
        'transition-colors focus:outline-none opacity-60',
        defaultOn ? 'bg-[rgb(var(--color-accent))]' : 'bg-[rgb(var(--color-border))]',
      ].join(' ')}
    >
      <span
        className={[
          'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200',
          defaultOn ? 'translate-x-5' : 'translate-x-0',
        ].join(' ')}
      />
    </button>
  );
}
