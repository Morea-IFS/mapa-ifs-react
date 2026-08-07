import React from 'react';
import { render, screen } from '@testing-library/react';
import RootLayout from './layout';

// 1. Mock do Next Font
jest.mock('next/font/google', () => ({
  Inter: () => ({
    variable: '--font-inter',
  }),
}));

// 2. Mocks dos componentes filhos
jest.mock('@/components/SideBar', () => ({
  __esModule: true,
  default: () => <aside data-testid="sidebar-mock">SideBar</aside>,
}));

jest.mock('@/components/ThemeProvider', () => ({
  __esModule: true,
  ThemeProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="theme-provider-mock">{children}</div>
  ),
}));

jest.mock('@/components/VLibrasWidget', () => ({
  __esModule: true,
  default: () => <div data-testid="vlibras-mock">VLibrasWidget</div>,
}));

jest.mock('@/components/Footer', () => ({
  __esModule: true,
  default: () => <footer data-testid="footer-mock">Footer</footer>,
}));

describe('RootLayout Component', () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeAll(() => {
    // Silencia o aviso do React sobre renderizar <html> fora do nó raiz document
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation((msg) => {
      if (typeof msg === 'string' && msg.includes('cannot be a child of')) {
        return;
      }
    });
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  it('deve renderizar a estrutura principal com os componentes globais e os filhos', () => {
    render(
      <RootLayout>
        <div data-testid="child-content">Conteúdo da Página</div>
      </RootLayout>
    );

    expect(screen.getByTestId('theme-provider-mock')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar-mock')).toBeInTheDocument();
    expect(screen.getByTestId('vlibras-mock')).toBeInTheDocument();
    expect(screen.getByTestId('footer-mock')).toBeInTheDocument();
    expect(screen.getByTestId('child-content')).toBeInTheDocument();
  });
});