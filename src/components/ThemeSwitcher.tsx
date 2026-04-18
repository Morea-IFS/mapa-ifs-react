'use client';

import { useTheme } from './ThemeProvider';
import { Moon, Sun, Eye } from 'lucide-react';

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <div 
      className="flex bg-fundo-cartao border border-borda rounded-lg p-1 shadow-sm mt-4"
      role="group"
      aria-label="Selecionar tema de cores"
    >
      <button
        onClick={() => setTheme('claro')}
        className={`flex-1 flex justify-center items-center py-2 px-3 rounded-md transition-colors ${
          theme === 'claro' ? 'bg-destaque-fraco text-destaque font-medium' : 'text-texto-auxiliar hover:text-texto-principal hover:bg-fundo-cartao-hover'
        }`}
        title="Tema Claro"
        aria-label="Ativar tema claro"
        aria-pressed={theme === 'claro'}
      >
        <Sun size={18} aria-hidden="true" />
      </button>
      
      <button
        onClick={() => setTheme('escuro')}
        className={`flex-1 flex justify-center items-center py-2 px-3 rounded-md transition-colors ${
          theme === 'escuro' ? 'bg-destaque-fraco text-destaque font-medium' : 'text-texto-auxiliar hover:text-texto-principal hover:bg-fundo-cartao-hover'
        }`}
        title="Tema Escuro"
        aria-label="Ativar tema escuro"
        aria-pressed={theme === 'escuro'}
      >
        <Moon size={18} aria-hidden="true" />
      </button>
      
      <button
        onClick={() => setTheme('alto-contraste')}
        className={`flex-1 flex justify-center items-center py-2 px-3 rounded-md transition-colors ${
          theme === 'alto-contraste' ? 'bg-destaque-fraco text-destaque font-medium' : 'text-texto-auxiliar hover:text-texto-principal hover:bg-fundo-cartao-hover'
        }`}
        title="Alto Contraste"
        aria-label="Ativar tema de alto contraste para fotofobia ou deficiência de cores"
        aria-pressed={theme === 'alto-contraste'}
      >
        <Eye size={18} aria-hidden="true" />
      </button>
    </div>
  );
}
