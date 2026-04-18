'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'escuro' | 'claro' | 'alto-contraste';

interface ThemeContextProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('escuro');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storedTheme = localStorage.getItem('mapa-ifs-theme') as Theme | null;
    if (storedTheme) {
      setThemeState(storedTheme);
      document.documentElement.setAttribute('data-tema', storedTheme);
    } else {
      document.documentElement.setAttribute('data-tema', 'escuro');
    }
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('mapa-ifs-theme', newTheme);
    document.documentElement.setAttribute('data-tema', newTheme);
  };

  // Garantimos que o Provider sempre exista na árvore
  // Se não estiver montado, podemos retornar o Provider, 
  // O value já tem o default. 
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
