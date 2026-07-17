import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { Link } from 'react-router';

/**
 * HomePage — the primary landing screen.
 *
 * Phase 1: Shows the core drop-zone hero and quick-action cards.
 * Business logic (destination routing, uploads) is scaffolded later.
 */
export default function HomePage() {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    // TODO Phase 2: dispatch files to destination selection
    console.log('[QuickDock] Files dropped:', acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: false,
    multiple: true,
  });

  return (
    <div className="page-container flex flex-col gap-8">
      {/* ── Header ────────────────────────────────────────────────── */}
      <section>
        <h1 className="text-2xl font-bold text-[rgb(var(--color-text-primary))]">
          Share anything, instantly
        </h1>
        <p className="mt-1 text-sm text-[rgb(var(--color-text-secondary))]">
          Drop a file below to start sharing to any destination — no app-switching required.
        </p>
      </section>

      {/* ── Drop zone ─────────────────────────────────────────────── */}
      <motion.div
        {...getRootProps()}
        animate={{
          borderColor: isDragActive ? 'rgb(var(--color-accent))' : 'rgb(var(--color-border))',
          backgroundColor: isDragActive
            ? 'rgba(59,130,246,0.06)'
            : 'rgb(var(--color-bg-secondary))',
        }}
        transition={{ duration: 0.15 }}
        className="relative flex min-h-[220px] cursor-pointer flex-col items-center justify-center 
                   gap-4 rounded-3xl border-2 border-dashed p-8 text-center"
      >
        <input {...getInputProps()} />

        <div
          className={`flex h-14 w-14 items-center justify-center rounded-2xl transition-colors ${
            isDragActive ? 'bg-[rgb(var(--color-accent))]' : 'bg-[rgb(var(--color-bg-tertiary))]'
          }`}
        >
          <svg
            className={`h-7 w-7 transition-colors ${
              isDragActive ? 'text-white' : 'text-[rgb(var(--color-text-muted))]'
            }`}
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
        </div>

        {isDragActive ? (
          <p className="text-base font-medium text-[rgb(var(--color-accent))]">
            Release to add files
          </p>
        ) : (
          <>
            <p className="text-base font-medium text-[rgb(var(--color-text-primary))]">
              Drop files here, or{' '}
              <span className="text-[rgb(var(--color-accent))]">click to browse</span>
            </p>
            <p className="text-xs text-[rgb(var(--color-text-muted))]">
              Any file type &mdash; images, documents, archives, media
            </p>
          </>
        )}
      </motion.div>

      {/* ── Quick actions ─────────────────────────────────────────── */}
      <section>
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-[rgb(var(--color-text-muted))]">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <QuickActionCard
            title="Float Widget"
            description="Launch the always-on-top sharing widget"
            icon="🪟"
            to="/widget"
          />
          <QuickActionCard
            title="Share History"
            description="View all previously shared files"
            icon="📋"
            to="/history"
          />
          <QuickActionCard
            title="Connect Account"
            description="Add a new destination account"
            icon="🔗"
            to="/accounts"
          />
        </div>
      </section>

      {/* ── Workflow steps ────────────────────────────────────────── */}
      <section>
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-[rgb(var(--color-text-muted))]">
          How It Works
        </h2>
        <ol className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-0">
          {STEPS.map((step, i) => (
            <li key={step.label} className="flex items-center gap-2 sm:flex-1 sm:flex-col sm:gap-1 sm:text-center">
              <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[rgb(var(--color-accent))] text-xs font-bold text-white">
                {i + 1}
              </span>
              <div className="sm:mt-1">
                <p className="text-sm font-medium text-[rgb(var(--color-text-primary))]">{step.label}</p>
                <p className="text-xs text-[rgb(var(--color-text-muted))]">{step.sub}</p>
              </div>
              {i < STEPS.length - 1 && (
                <span className="mx-2 hidden text-[rgb(var(--color-border))] sm:block">→</span>
              )}
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}

/* ─── Sub-components ──────────────────────────────────────────────────────── */
function QuickActionCard({
  title,
  description,
  icon,
  to,
}: {
  title: string;
  description: string;
  icon: string;
  to: string;
}) {
  return (
    <Link
      to={to}
      className="card group flex flex-col gap-2 transition-shadow hover:shadow-md"
    >
      <span className="text-2xl" aria-hidden>
        {icon}
      </span>
      <p className="text-sm font-medium text-[rgb(var(--color-text-primary))]">{title}</p>
      <p className="text-xs text-[rgb(var(--color-text-secondary))]">{description}</p>
    </Link>
  );
}

const STEPS = [
  { label: 'Drop File', sub: 'Drag any file into QuickDock' },
  { label: 'Choose Destination', sub: 'Pick where to send it' },
  { label: 'Add Recipient', sub: 'Who should receive it' },
  { label: 'Send', sub: 'Delivered in one click' },
];
