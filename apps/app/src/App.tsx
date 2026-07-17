import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { useThemeInit } from '@/hooks/useThemeInit';
import MainLayout from '@/layouts/MainLayout';
import HomePage from '@/pages/HomePage';
import FloatingWidgetPage from '@/pages/FloatingWidgetPage';
import SettingsPage from '@/pages/SettingsPage';
import AccountsPage from '@/pages/AccountsPage';
import HistoryPage from '@/pages/HistoryPage';

/**
 * App — root component.
 * Initialises the persisted theme then mounts the router.
 * Routes are wrapped in MainLayout which provides the shell chrome.
 */
export default function App() {
  // Sync the <html> class with the persisted theme preference on mount
  useThemeInit();

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/widget" element={<FloatingWidgetPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/accounts" element={<AccountsPage />} />
          <Route path="/history" element={<HistoryPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
