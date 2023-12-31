import React, { useEffect } from 'react';
import { selectTheme } from '../stores/theme.reducer';
import { useAppSelector } from '@/hooks';

type ThemeWrapperProps = {
  children?: React.ReactNode;
};

export function ThemeWrapper({ children }: ThemeWrapperProps) {
  const theme = useAppSelector(selectTheme);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light';

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  return <>{children}</>;
}
