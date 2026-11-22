export type ThemeMode = 'escuro' | 'claro' | 'alto-contraste';

export interface ThemeColors {
  fundoPrincipal: string;
  fundoSecundario: string;
  fundoCartao: string;
  fundoCartaoHover: string;
  fundoInput: string;
  textoPrincipal: string;
  textoSecundario: string;
  textoAuxiliar: string;
  destaque: string;
  destaqueFraco: string;
  borda: string;
  bordaHover: string;
  statusBarStyle: 'light' | 'dark';
}

export const themes: Record<ThemeMode, ThemeColors> = {
  escuro: {
    fundoPrincipal: '#0a0a0f',
    fundoSecundario: '#12121a',
    fundoCartao: '#14141e',
    fundoCartaoHover: '#191928',
    fundoInput: '#181824',
    textoPrincipal: '#eaeaea',
    textoSecundario: '#a0a0b0',
    textoAuxiliar: '#6a6a7a',
    destaque: '#00d9ff',
    destaqueFraco: 'rgba(0, 217, 255, 0.15)',
    borda: 'rgba(255, 255, 255, 0.08)',
    bordaHover: 'rgba(255, 255, 255, 0.16)',
    statusBarStyle: 'light',
  },
  claro: {
    fundoPrincipal: '#f9fafb',
    fundoSecundario: '#e5e7eb',
    fundoCartao: '#ffffff',
    fundoCartaoHover: '#f3f4f6',
    fundoInput: '#f3f4f6',
    textoPrincipal: '#111827',
    textoSecundario: '#4b5563',
    textoAuxiliar: '#9ca3af',
    destaque: '#0ea5e9',
    destaqueFraco: 'rgba(14, 165, 233, 0.15)',
    borda: '#d1d5db',
    bordaHover: '#9ca3af',
    statusBarStyle: 'dark',
  },
  'alto-contraste': {
    fundoPrincipal: '#000000',
    fundoSecundario: '#000000',
    fundoCartao: '#000000',
    fundoCartaoHover: '#1a1a1a',
    fundoInput: '#111111',
    textoPrincipal: '#ffff00',
    textoSecundario: '#ffffff',
    textoAuxiliar: '#cccccc',
    destaque: '#00ff00',
    destaqueFraco: 'rgba(0, 255, 0, 0.25)',
    borda: '#ffffff',
    bordaHover: '#ffff00',
    statusBarStyle: 'light',
  },
};
