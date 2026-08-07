import { render, screen, fireEvent, renderHook } from '@testing-library/react';
import { ThemeProvider, useTheme } from '@/components/ThemeProvider';

// Componente auxiliar para testar a integração do contexto
function TestComponent() {
  const { theme, setTheme } = useTheme();

  return (
    <div>
      <span data-testid="current-theme">{theme}</span>
      <button onClick={() => setTheme('claro')}>Mudar para Claro</button>
      <button onClick={() => setTheme('alto-contraste')}>Mudar para Alto Contraste</button>
    </div>
  );
}

describe('ThemeProvider', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-tema');
  });

  test('Deve fornecer o tema padrão ("escuro") quando o localStorage estiver vazio', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('current-theme')).toHaveTextContent('escuro');
    expect(document.documentElement.getAttribute('data-tema')).toBe('escuro');
  });

  test('Deve carregar o tema armazenado no localStorage se disponível', () => {
    localStorage.setItem('mapa-ifs-theme', 'claro');

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('current-theme')).toHaveTextContent('claro');
    expect(document.documentElement.getAttribute('data-tema')).toBe('claro');
  });

  test('Deve atualizar o tema, o DOM e o localStorage ao chamar setTheme', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const button = screen.getByRole('button', { name: /mudar para claro/i });
    fireEvent.click(button);

    expect(screen.getByTestId('current-theme')).toHaveTextContent('claro');
    expect(localStorage.getItem('mapa-ifs-theme')).toBe('claro');
    expect(document.documentElement.getAttribute('data-tema')).toBe('claro');
  });

  test('Deve permitir trocar para "alto-contraste"', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const button = screen.getByRole('button', { name: /mudar para alto contraste/i });
    fireEvent.click(button);

    expect(screen.getByTestId('current-theme')).toHaveTextContent('alto-contraste');
    expect(localStorage.getItem('mapa-ifs-theme')).toBe('alto-contraste');
    expect(document.documentElement.getAttribute('data-tema')).toBe('alto-contraste');
  });

  test('Deve lançar um erro se useTheme for utilizado fora do ThemeProvider', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => renderHook(() => useTheme())).toThrow(
      'useTheme precisa ser usado dentro de um ThemeProvider'
    );

    consoleSpy.mockRestore();
  });
});