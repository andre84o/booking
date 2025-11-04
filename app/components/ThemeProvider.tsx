'use client';

import { useEffect, useState } from 'react';
import { storage } from '../lib/storage';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const applyTheme = () => {
      const settings = storage.getSettings();
      const theme = settings.theme;

      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else if (theme === 'light') {
        document.documentElement.classList.remove('dark');
      } else if (theme === 'system') {
        // Check system preference
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    };

    // Apply theme on mount
    applyTheme();

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      const settings = storage.getSettings();
      if (settings.theme === 'system') {
        applyTheme();
      }
    };

    mediaQuery.addEventListener('change', handleChange);

    // Listen for localStorage changes (when settings are updated)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'settings') {
        applyTheme();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Also listen for custom event when settings change in the same window
    const handleSettingsChange = () => {
      applyTheme();
    };
    window.addEventListener('settingsChanged', handleSettingsChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('settingsChanged', handleSettingsChange);
    };
  }, []);

  // Prevent flash of unstyled content
  if (!mounted) {
    return null;
  }

  return <>{children}</>;
}
