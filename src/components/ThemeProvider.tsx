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

  useEffect(() => {
    const storedTheme = localStorage.getItem('mapa-ifs-theme') as Theme | null;
    const initialTheme = storedTheme || 'escuro';
    
    // Atualiza o DOM imediatamente
    document.documentElement.setAttribute('data-tema', initialTheme);
    
    // Adia a atualização do estado do React para o próximo ciclo (macrotask),
    // evitando o aviso de "cascading renders" (set-state-in-effect)
    if (storedTheme) {
      const timer = setTimeout(() => setThemeState(storedTheme), 0);
      return () => clearTimeout(timer);
    }
  }, []);

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
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}