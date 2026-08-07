import { render, screen, fireEvent } from '@testing-library/react';
import SideBar from './SideBar';
import { usePathname } from 'next/navigation';
import { blocos } from '@/data/blocos';

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

jest.mock('./ThemeSwitcher', () => {
  return function MockThemeSwitcher() {
    return <div data-testid="theme-switcher">ThemeSwitcher</div>;
  };
});

describe('Componente SideBar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (usePathname as jest.Mock).mockReturnValue('/');
  });

  test('Deve renderizar os links de navegação e os blocos cadastrados', () => {
    render(<SideBar />);

    expect(screen.getByText('MERO')).toBeInTheDocument();
    expect(screen.getByText('Mapa Geral')).toBeInTheDocument();
    expect(screen.getByText('Blocos')).toBeInTheDocument();

    blocos.forEach((bloco) => {
      expect(screen.getByText(bloco.name)).toBeInTheDocument();
    });

    expect(screen.getByTestId('theme-switcher')).toBeInTheDocument();
  });

  test('Deve abrir e fechar a sidebar ao clicar no botão hambúrguer', () => {
    const { container } = render(<SideBar />);

    const menuButton = screen.getByRole('button', { name: /abrir menu principal/i });
    const sidebar = container.querySelector('#menu-lateral');

    expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    expect(sidebar).toHaveClass('-translate-x-full');

    // Clica para abrir
    fireEvent.click(menuButton);

    const closeButton = screen.getByRole('button', { name: /fechar menu/i });
    expect(closeButton).toHaveAttribute('aria-expanded', 'true');
    expect(sidebar).not.toHaveClass('-translate-x-full');

    // Clica para fechar
    fireEvent.click(closeButton);
    expect(screen.getByRole('button', { name: /abrir menu principal/i })).toHaveAttribute('aria-expanded', 'false');
    expect(sidebar).toHaveClass('-translate-x-full');
  });

  test('Deve fechar a sidebar ao clicar no overlay mobile', () => {
    render(<SideBar />);

    const toggleButton = screen.getByRole('button', { name: /abrir menu principal/i });
    fireEvent.click(toggleButton);

    const overlay = document.querySelector('.fixed.inset-0.bg-black\\/50')!;
    expect(overlay).toBeInTheDocument();

    fireEvent.click(overlay);

    expect(screen.getByRole('button', { name: /abrir menu principal/i })).toHaveAttribute('aria-expanded', 'false');
  });

  test('Deve fechar a sidebar ao clicar em um link de navegação', () => {
    render(<SideBar />);

    const toggleButton = screen.getByRole('button', { name: /abrir menu principal/i });
    fireEvent.click(toggleButton);

    const firstBloco = blocos[0];
    const blocoLink = screen.getByText(firstBloco.name);

    fireEvent.click(blocoLink);

    expect(screen.getByRole('button', { name: /abrir menu principal/i })).toHaveAttribute('aria-expanded', 'false');
  });

  test('Deve destacar visualmente o link ativo com aria-current="page"', () => {
    const targetBloco = blocos[0];
    (usePathname as jest.Mock).mockReturnValue(`/bloco/${targetBloco.id}`);

    render(<SideBar />);

    // Passamos { hidden: true } para encontrar links dentro de containers ocultos por acessibilidade
    const activeLink = screen.getByRole('link', { name: new RegExp(targetBloco.name, 'i'), hidden: true });
    expect(activeLink).toHaveAttribute('aria-current', 'page');
    expect(activeLink).toHaveClass('text-destaque');

    const mapaGeralLink = screen.getByRole('link', { name: /mapa geral/i, hidden: true });
    expect(mapaGeralLink).not.toHaveAttribute('aria-current');
  });
});