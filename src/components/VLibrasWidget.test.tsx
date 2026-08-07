import { render, screen, waitFor } from '@testing-library/react';
import VLibrasWidget from './VLibrasWidget';

jest.mock('next/script', () => {
  return function MockScript({ onLoad, src }: { onLoad?: () => void; src: string }) {
    // Simula o disparo imediato da instrução do script no ambiente de testes
    if (onLoad) {
      setTimeout(() => onLoad(), 0);
    }
    return <script data-testid="vlibras-script" src={src} />;
  };
});

describe('Componente VLibrasWidget', () => {
  let mockWidgetConstructor: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockWidgetConstructor = jest.fn();

    // Injeta a API do VLibras na window para simular o script do governo carregado
    window.VLibras = {
      Widget: mockWidgetConstructor,
    };
  });

  afterEach(() => {
    delete window.VLibras;
  });

  test('Deve renderizar os elementos do DOM do VLibras após a montagem no cliente', async () => {
    const { container } = render(<VLibrasWidget />);

    await waitFor(() => {
      const vwContainer = container.querySelector('[vw="true"]');
      expect(vwContainer).toBeInTheDocument();
      expect(vwContainer).toHaveClass('enabled');
    });

    const accessButton = container.querySelector('[vw-access-button="true"]');
    expect(accessButton).toBeInTheDocument();
    expect(accessButton).toHaveClass('active');
  });

  test('Deve carregar o script externo do VLibras com a URL correta', async () => {
    render(<VLibrasWidget />);

    await waitFor(() => {
      const script = screen.getByTestId('vlibras-script');
      expect(script).toBeInTheDocument();
      expect(script).toHaveAttribute('src', 'https://vlibras.gov.br/app/vlibras-plugin.js');
    });
  });

  test('Deve instanciar window.VLibras.Widget quando o script carregar', async () => {
    render(<VLibrasWidget />);

    await waitFor(() => {
      expect(mockWidgetConstructor).toHaveBeenCalledWith('https://vlibras.gov.br/app');
      expect(mockWidgetConstructor).toHaveBeenCalledTimes(1);
    });
  });
});