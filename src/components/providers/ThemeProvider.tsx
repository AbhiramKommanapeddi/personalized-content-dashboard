'use client';

import React, { useEffect } from 'react';
import { useAppSelector } from '@/store/hooks';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useAppSelector((state) => state.preferences.theme);

  useEffect(() => {
    const root = document.documentElement;

    if (theme === 'system') {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.setAttribute('data-theme', systemDark ? 'dark' : 'light');

      const listener = (e: MediaQueryListEvent) => {
        root.setAttribute('data-theme', e.matches ? 'dark' : 'light');
      };
      const mql = window.matchMedia('(prefers-color-scheme: dark)');
      mql.addEventListener('change', listener);
      return () => mql.removeEventListener('change', listener);
    } else {
      root.setAttribute('data-theme', theme);
    }
  }, [theme]);

  return <>{children}</>;
}
