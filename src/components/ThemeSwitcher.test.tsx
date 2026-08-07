import { render, screen, fireEvent } from '@testing-library/react';
import ThemeSwitcher from './ThemeSwitcher';
import { useTheme } from './ThemeProvider';

jest.mock('./ThemeProvider', () => ({
  useTheme: jest.fn(),
}));

describe('Componente ThemeSwitcher', () => {
  const mockSetTheme = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useTheme as jest.Mock).mockReturnValue({
      theme: 'escuro',
      setTheme: mockSetTheme,
    });
  });

  test('Deve renderizar os botões de seleção de tema com o grupo acessível', () => {
    render(<ThemeSwitcher />);

    const group = screen.getByRole('group', { name: /selecionar tema de cores/i });
    expect(group).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /ativar tema claro/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /ativar tema escuro/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /ativar tema de alto contraste/i })).toBeInTheDocument();
  });

  test('Deve indicar qual botão está ativo através do atributo aria-pressed', () => {
    (useTheme as jest.Mock).mockReturnValue({
      theme: 'escuro',
      setTheme: mockSetTheme,
    });

    render(<ThemeSwitcher />);

    const claroBtn = screen.getByRole('button', { name: /ativar tema claro/i });
    const escuroBtn = screen.getByRole('button', { name: /ativar tema escuro/i });
    const altoContrasteBtn = screen.getByRole('button', { name: /ativar tema de alto contraste/i });

    expect(escuroBtn).toHaveAttribute('aria-pressed', 'true');
    expect(claroBtn).toHaveAttribute('aria-pressed', 'false');
    expect(altoContrasteBtn).toHaveAttribute('aria-pressed', 'false');
  });

  test('Deve chamar setTheme com "claro" ao clicar no botão do tema claro', () => {
    render(<ThemeSwitcher />);

    const claroBtn = screen.getByRole('button', { name: /ativar tema claro/i });
    fireEvent.click(claroBtn);

    expect(mockSetTheme).toHaveBeenCalledWith('claro');
    expect(mockSetTheme).toHaveBeenCalledTimes(1);
  });

  test('Deve chamar setTheme com "escuro" ao clicar no botão do tema escuro', () => {
    render(<ThemeSwitcher />);

    const escuroBtn = screen.getByRole('button', { name: /ativar tema escuro/i });
    fireEvent.click(escuroBtn);

    expect(mockSetTheme).toHaveBeenCalledWith('escuro');
    expect(mockSetTheme).toHaveBeenCalledTimes(1);
  });

  test('Deve chamar setTheme com "alto-contraste" ao clicar no botão de alto contraste', () => {
    render(<ThemeSwitcher />);

    const altoContrasteBtn = screen.getByRole('button', { name: /ativar tema de alto contraste/i });
    fireEvent.click(altoContrasteBtn);

    expect(mockSetTheme).toHaveBeenCalledWith('alto-contraste');
    expect(mockSetTheme).toHaveBeenCalledTimes(1);
  });
});