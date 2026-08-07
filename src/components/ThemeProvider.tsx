'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type Theme = 'escuro' | 'claro' | 'alto-contraste';

interface ThemeContextProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem('mapa-ifs-theme') as Theme | null;
      return storedTheme || 'escuro';
    }
    return 'escuro';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-tema', theme);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('mapa-ifs-theme', newTheme);
    document.documentElement.setAttribute('data-tema', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme precisa ser usado dentro de um ThemeProvider');
  }
  return context;
}