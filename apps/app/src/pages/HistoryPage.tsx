/**
 * HistoryPage — list of past file-share events.
 *
 * Phase 1: Renders a static placeholder table with dummy data.
 * Phase 2: Fetches real records from the SQLite DB via the sidecar API.
 */

const PLACEHOLDER_ROWS = [
  {
    id: 1,
    fileName: 'design-mockup-v3.fig',
    destination: 'Slack',
    recipient: '#design-team',
    status: 'Sent',
    sentAt: '2 min ago',
  },
  {
    id: 2,
    fileName: 'q4-report.pdf',
    destination: 'Gmail',
    recipient: 'alice@acme.com',
    status: 'Sent',
    sentAt: '1 hr ago',
  },
  {
    id: 3,
    fileName: 'onboarding-video.mp4',
    destination: 'Google Drive',
    recipient: 'Shared Drive / HR',
    status: 'Uploading',
    sentAt: 'Just now',
  },
  {
    id: 4,
    fileName: 'contract-draft.docx',
    destination: 'Notion',
    recipient: 'Legal Workspace',
    status: 'Failed',
    sentAt: '3 hr ago',
  },
] as const;

type Status = (typeof PLACEHOLDER_ROWS)[number]['status'];

const STATUS_STYLES: Record<Status, string> = {
  Sent: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  Uploading: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  Failed: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

export default function HistoryPage() {
  return (
    <div className="page-container flex flex-col gap-6">
      {/* ── Header ────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[rgb(var(--color-text-primary))]">History</h1>
          <p className="mt-1 text-sm text-[rgb(var(--color-text-secondary))]">
            All files you've shared through QuickDock.
          </p>
        </div>
        <button className="btn-secondary text-sm" disabled>
          Clear History
        </button>
      </div>

      {/* ── Table ─────────────────────────────────────────────────── */}
      <div className="card overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg-secondary))]">
              {['File', 'Destination', 'Recipient', 'Status', 'Sent'].map((col) => (
                <th
                  key={col}
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider 
                             text-[rgb(var(--color-text-muted))]"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PLACEHOLDER_ROWS.map((row, i) => (
              <tr
                key={row.id}
                className={[
                  'border-b border-[rgb(var(--color-border))] transition-colors',
                  'hover:bg-[rgb(var(--color-bg-secondary))]',
                  i === PLACEHOLDER_ROWS.length - 1 ? 'border-b-0' : '',
                ].join(' ')}
              >
                <td className="px-4 py-3 font-medium text-[rgb(var(--color-text-primary))]">
                  {row.fileName}
                </td>
                <td className="px-4 py-3 text-[rgb(var(--color-text-secondary))]">
                  {row.destination}
                </td>
                <td className="px-4 py-3 text-[rgb(var(--color-text-secondary))]">
                  {row.recipient}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[row.status]}`}
                  >
                    {row.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-[rgb(var(--color-text-muted))]">
                  {row.sentAt}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
