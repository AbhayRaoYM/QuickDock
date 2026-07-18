# QuickDock

> **Universal Desktop Sharing Platform** — Start from the file, not from the application.

QuickDock is a lightweight Tauri 2.x desktop application that lets users drag-and-drop files into a floating widget and instantly share them to multiple destinations (Slack, Gmail, Google Drive, Discord, Notion, …) without switching apps.

---

## Workflow

```
Drag File → QuickDock → Choose Destination → Recipient → Send
```

---

## Tech Stack

| Layer          | Technology                              |
|----------------|-----------------------------------------|
| Desktop shell  | Tauri 2.x (Rust)                        |
| Frontend       | React 19, TypeScript, Vite              |
| Styling        | TailwindCSS 3, CSS custom properties    |
| State          | Zustand 5 (theme, UI state)             |
| Data fetching  | TanStack Query 5                        |
| Animation      | Framer Motion 11                        |
| Routing        | React Router 7                          |
| File input     | React Dropzone 14                       |
| Sidecar        | Node.js 22 LTS, Fastify 5               |
| Database       | SQLite via better-sqlite3               |
| Package mgr    | pnpm (workspaces)                       |

---

## Project Structure

```
quickdock/
├── apps/
│   ├── app/                    # Tauri + React frontend
│   │   ├── src/
│   │   │   ├── components/     # Shared UI components
│   │   │   ├── hooks/          # Custom React hooks
│   │   │   ├── layouts/        # Page shell layouts
│   │   │   ├── lib/            # API client, utilities
│   │   │   ├── pages/          # Route-level page components
│   │   │   ├── store/          # Zustand state stores
│   │   │   └── styles/         # Global CSS, design tokens
│   │   └── src-tauri/          # Rust / Tauri core
│   │       ├── capabilities/   # Permission declarations
│   │       └── src/            # Rust source (lib.rs, main.rs)
│   └── server/                 # Node.js Fastify sidecar
│       └── src/
│           ├── db/             # SQLite + migrations
│           └── routes/         # Fastify route modules
└── packages/                   # Future shared packages
```

---

## Prerequisites

- **Rust** (stable, latest) — [rustup.rs](https://rustup.rs)
- **Node.js 22 LTS** — [nodejs.org](https://nodejs.org)
- **pnpm 9+** — `npm install -g pnpm`
- **Tauri prerequisites** — [tauri.app/start/prerequisites](https://tauri.app/start/prerequisites/)

---

## Getting Started

### 1. Install dependencies

```bash
pnpm install
```

### 2. Run the sidecar (in a separate terminal)

```bash
pnpm server:dev
```

### 3. Run the Tauri app in development mode

```bash
pnpm tauri:dev
```

The Vite dev server starts on `http://localhost:1420` and Tauri opens a native window.

---

## Available Scripts

| Script              | Description                                 |
|---------------------|---------------------------------------------|
| `pnpm tauri:dev`    | Run the full Tauri app in development       |
| `pnpm tauri:build`  | Build the production desktop installer     |
| `pnpm dev`          | Run only the Vite frontend (browser)        |
| `pnpm server:dev`   | Run the Fastify sidecar with watch mode     |
| `pnpm server:build` | Compile the sidecar to `dist/`              |
| `pnpm lint`         | Run ESLint across all packages              |
| `pnpm format`       | Format all source files with Prettier       |
| `pnpm typecheck`    | Run TypeScript type-checking across pkgs    |

---

## Theme Support

QuickDock supports **Light**, **Dark**, and **System** themes.

- Preference is persisted to `localStorage` under the key `quickdock-theme`.
- An inline script in [`index.html`](apps/app/index.html) applies the saved class before React hydrates, preventing FOUC.
- The active theme is controlled via the **ThemeToggle** component in the sidebar.

---

## Pages

| Route       | Component             | Description                           |
|-------------|-----------------------|---------------------------------------|
| `/home`     | `HomePage`            | Drop zone hero + quick actions        |
| `/widget`   | `FloatingWidgetPage`  | Preview and controls for float widget |
| `/history`  | `HistoryPage`         | Paginated share event log             |
| `/accounts` | `AccountsPage`        | Destination account manager           |
| `/settings` | `SettingsPage`        | App-wide preferences                  |

---

## Roadmap

- **Phase 1** ✅ Foundation — project structure, placeholder pages, theme, DB schema
- **Phase 2** — Floating widget window, Tauri IPC, drag-and-drop to widget
- **Phase 3** — OAuth for Slack, Gmail, Google Drive
- **Phase 4** — File upload orchestration, progress tracking, retry logic
- **Phase 5** — Windows/Linux tray icon, auto-launch, installer polish

---

-- Widget WebviewWindow created on startup: frameless, transparent, always-on-top, skip-taskbar, 320×420, hidden by default
-- System tray with left-click toggle + right-click menu (Show Widget / Hide Widget / Quit)
-- Global shortcut Ctrl+Shift+S registered system-wide — toggles widget from anywhere
-- 8 IPC commands: show_widget, hide_widget, toggle_widget, get_widget_visible, set_autostart, get_autostart, send_notification, get_monitor_info
-- tauri-plugin-autostart + tauri-plugin-global-shortcut added
