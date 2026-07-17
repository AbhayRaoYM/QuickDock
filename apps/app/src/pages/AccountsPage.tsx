/**
 * AccountsPage — manage connected destination accounts.
 *
 * Phase 1: Static placeholder showing supported destinations.
 * Phase 2: OAuth flows, token storage, connection status from sidecar.
 */

type ConnectionStatus = 'connected' | 'disconnected';

interface DestinationConfig {
  id: string;
  name: string;
  description: string;
  category: string;
  status: ConnectionStatus;
}

const DESTINATIONS: DestinationConfig[] = [
  // Messaging
  {
    id: 'slack',
    name: 'Slack',
    category: 'Messaging',
    description: 'Send files directly to channels or DMs',
    status: 'disconnected',
  },
  {
    id: 'discord',
    name: 'Discord',
    category: 'Messaging',
    description: 'Share to servers, channels, and DMs',
    status: 'disconnected',
  },
  {
    id: 'teams',
    name: 'Microsoft Teams',
    category: 'Messaging',
    description: 'Share in team chats or meetings',
    status: 'disconnected',
  },
  // Email
  {
    id: 'gmail',
    name: 'Gmail',
    category: 'Email',
    description: 'Attach files to new or existing threads',
    status: 'disconnected',
  },
  {
    id: 'outlook',
    name: 'Outlook',
    category: 'Email',
    description: 'Send via Microsoft 365 email',
    status: 'disconnected',
  },
  // Cloud Storage
  {
    id: 'gdrive',
    name: 'Google Drive',
    category: 'Cloud Storage',
    description: 'Upload to My Drive or Shared Drives',
    status: 'disconnected',
  },
  {
    id: 'dropbox',
    name: 'Dropbox',
    category: 'Cloud Storage',
    description: 'Upload and generate a shareable link',
    status: 'disconnected',
  },
  // Productivity
  {
    id: 'notion',
    name: 'Notion',
    category: 'Productivity',
    description: 'Attach files to pages or databases',
    status: 'disconnected',
  },
];

// Group by category
const GROUPED = DESTINATIONS.reduce<Record<string, DestinationConfig[]>>((acc, dest) => {
  (acc[dest.category] ??= []).push(dest);
  return acc;
}, {});

export default function AccountsPage() {
  return (
    <div className="page-container flex flex-col gap-8">
      {/* ── Header ────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold text-[rgb(var(--color-text-primary))]">Accounts</h1>
        <p className="mt-1 text-sm text-[rgb(var(--color-text-secondary))]">
          Connect your accounts to enable instant file sharing to each destination.
        </p>
      </div>

      {/* ── Destination groups ────────────────────────────────────── */}
      {Object.entries(GROUPED).map(([category, items]) => (
        <section key={category}>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[rgb(var(--color-text-muted))]">
            {category}
          </h2>
          <div className="flex flex-col gap-2">
            {items.map((dest) => (
              <DestinationRow key={dest.id} dest={dest} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function DestinationRow({ dest }: { dest: DestinationConfig }) {
  const isConnected = dest.status === 'connected';

  return (
    <div className="card flex items-center justify-between gap-4 py-3">
      {/* Icon placeholder + info */}
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl 
                        bg-[rgb(var(--color-bg-secondary))] text-sm font-bold 
                        text-[rgb(var(--color-text-primary))]">
          {dest.name[0]}
        </div>
        <div>
          <p className="text-sm font-medium text-[rgb(var(--color-text-primary))]">{dest.name}</p>
          <p className="text-xs text-[rgb(var(--color-text-secondary))]">{dest.description}</p>
        </div>
      </div>

      {/* Status + action */}
      <div className="flex flex-shrink-0 items-center gap-3">
        <span
          className={`text-xs font-medium ${
            isConnected ? 'text-green-600 dark:text-green-400' : 'text-[rgb(var(--color-text-muted))]'
          }`}
        >
          {isConnected ? '● Connected' : '○ Not connected'}
        </span>
        <button className={isConnected ? 'btn-secondary' : 'btn-primary'} disabled>
          {isConnected ? 'Disconnect' : 'Connect'}
        </button>
      </div>
    </div>
  );
}
