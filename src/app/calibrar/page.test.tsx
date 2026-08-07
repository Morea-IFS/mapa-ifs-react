import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CalibrePage from './page';

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, className }: any) => (
    <img src={typeof src === 'string' ? src : src?.src || '/mock-map.png'} alt={alt} className={className} />
  ),
}));

const mockWriteText = jest.fn().mockResolvedValue(undefined);
Object.assign(navigator, {
  clipboard: {
    writeText: mockWriteText,
  },
});

global.URL.createObjectURL = jest.fn(() => 'blob:http://localhost/mock-url');
global.URL.revokeObjectURL = jest.fn();

describe('Página CalibrePage (/calibrar)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Deve renderizar o título, seletores de andar e o mapa inicial (Térreo)', () => {
    render(<CalibrePage />);

    expect(screen.getByRole('heading', { name: /calibrador de rotas/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /térreo/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /superior/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /subsolo/i })).toBeInTheDocument();
    expect(screen.getByAltText(/mapa térreo/i)).toBeInTheDocument();
  });

  test('Deve trocar de andar ao clicar nos botões de andar', () => {
    render(<CalibrePage />);

    const buttonSuperior = screen.getByRole('button', { name: /superior/i });
    fireEvent.click(buttonSuperior);

    expect(screen.getByAltText(/mapa superior/i)).toBeInTheDocument();
  });

  test('Deve adicionar um nó ao clicar no mapa', () => {
    const { container } = render(<CalibrePage />);

    const mapApplication = screen.getByRole('application', { name: /mapa para colocar nós de navegação/i });

    jest.spyOn(mapApplication, 'getBoundingClientRect').mockReturnValue({
      left: 0,
      top: 0,
      width: 1000,
      height: 500,
      x: 0,
      y: 0,
      bottom: 500,
      right: 1000,
      toJSON: () => {},
    });

    // Simula clique em X: 500 (50%), Y: 250 (50%)
    fireEvent.click(mapApplication, { clientX: 500, clientY: 250 });

    // O nó deve aparecer na lista de nós colocados
    expect(screen.getByText(/nós colocados \(1\)/i)).toBeInTheDocument();

    // O texto no bloco de código TypeScript deve atualizar
    const outputTs = container.querySelector('pre');
    expect(outputTs?.textContent).toContain("x: 50, y: 50, floor: 'terreo', type: 'corredor'");
  });

  test('Deve permitir remover um nó cadastrado', () => {
    render(<CalibrePage />);

    const mapApplication = screen.getByRole('application', { name: /mapa para colocar nós de navegação/i });
    jest.spyOn(mapApplication, 'getBoundingClientRect').mockReturnValue({
      left: 0,
      top: 0,
      width: 1000,
      height: 500,
      x: 0,
      y: 0,
      bottom: 500,
      right: 1000,
      toJSON: () => {},
    });

    // Adiciona um nó
    fireEvent.click(mapApplication, { clientX: 200, clientY: 100 });
    expect(screen.getByText(/nós colocados \(1\)/i)).toBeInTheDocument();

    // Remove o nó clicando no botão '×'
    const removeButton = screen.getByRole('button', { name: /remover nó/i });
    fireEvent.click(removeButton);

    expect(screen.getByText(/nós colocados \(0\)/i)).toBeInTheDocument();
  });

  test('Deve copiar o código TypeScript gerado ao clicar em "Copiar TypeScript"', async () => {
    render(<CalibrePage />);

    const copyButton = screen.getByRole('button', { name: /copiar typescript/i });
    fireEvent.click(copyButton);

    expect(mockWriteText).toHaveBeenCalledWith('// Nenhum nó colocado ainda.');

    await waitFor(() => {
      const copiedElements = screen.getAllByText(/✓ copiado!/i);
      expect(copiedElements.length).toBeGreaterThan(0);
    });
  });

  test('Deve acionar o download do arquivo JSON ao clicar em "Exportar JSON"', () => {
    const anchorClickSpy = jest.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

    render(<CalibrePage />);

    const exportButton = screen.getByRole('button', { name: /exportar json/i });
    fireEvent.click(exportButton);

    expect(global.URL.createObjectURL).toHaveBeenCalled();
    expect(anchorClickSpy).toHaveBeenCalled();

    anchorClickSpy.mockRestore();
  });
});