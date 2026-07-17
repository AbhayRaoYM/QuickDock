import { motion } from 'framer-motion';

/**
 * FloatingWidgetPage — preview / control panel for the always-on-top widget.
 *
 * Phase 1: Static placeholder showing the widget concept.
 * Phase 2: Launch the Tauri WebviewWindow, handle IPC messages.
 */
export default function FloatingWidgetPage() {
  return (
    <div className="page-container flex flex-col gap-8">
      {/* ── Header ────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold text-[rgb(var(--color-text-primary))]">
          Floating Widget
        </h1>
        <p className="mt-1 text-sm text-[rgb(var(--color-text-secondary))]">
          A compact, always-on-top window that stays within reach while you work.
        </p>
      </div>

      {/* ── Widget preview ────────────────────────────────────────── */}
      <div className="card flex flex-col gap-6">
        <h2 className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">
          Widget Preview
        </h2>

        {/* Simulated floating widget */}
        <div className="flex justify-center py-4">
          <motion.div
            whileHover={{ scale: 1.03 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="relative w-64 rounded-3xl border border-[rgb(var(--color-border))] 
                       bg-[rgb(var(--color-bg-primary))] p-4 shadow-widget dark:shadow-widget-dark"
          >
            {/* Widget header */}
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold text-[rgb(var(--color-text-primary))]">
                QuickDock
              </span>
              <div className="flex gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
                <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
              </div>
            </div>

            {/* Drop area */}
            <div className="flex h-20 flex-col items-center justify-center rounded-2xl 
                            border-2 border-dashed border-[rgb(var(--color-border))] 
                            bg-[rgb(var(--color-bg-secondary))]">
              <svg
                className="mb-1 h-5 w-5 text-[rgb(var(--color-text-muted))]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                />
              </svg>
              <p className="text-xs text-[rgb(var(--color-text-muted))]">Drop file here</p>
            </div>

            {/* Destination pills */}
            <div className="mt-3 flex flex-wrap gap-1.5">
              {['Slack', 'Gmail', 'Drive'].map((dest) => (
                <span
                  key={dest}
                  className="rounded-full bg-[rgb(var(--color-bg-secondary))] px-2.5 py-0.5 
                             text-xs text-[rgb(var(--color-text-secondary))]"
                >
                  {dest}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Controls (placeholder) ────────────────────────────────── */}
      <div className="card flex flex-col gap-4">
        <h2 className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">
          Widget Controls
        </h2>
        <div className="flex flex-wrap gap-3">
          <PlaceholderButton label="Launch Widget" accent />
          <PlaceholderButton label="Pin to Corner" />
          <PlaceholderButton label="Hide Widget" />
        </div>
        <p className="text-xs text-[rgb(var(--color-text-muted))]">
          Controls will trigger Tauri window management APIs in Phase 2.
        </p>
      </div>
    </div>
  );
}

function PlaceholderButton({ label, accent }: { label: string; accent?: boolean }) {
  return (
    <button className={accent ? 'btn-primary' : 'btn-secondary'} disabled>
      {label}
    </button>
  );
}
