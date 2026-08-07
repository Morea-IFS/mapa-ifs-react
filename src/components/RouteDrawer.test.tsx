import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import RouteDrawer from './RouteDrawer';

// Mock das funções do grafo de navegação
jest.mock('@/data/navigationGraph', () => ({
  ROOM_OPTIONS: [
    { id: 'T_ENTRY', label: 'Entrada Principal', floor: 'terreo', blockId: 'A' },
    { id: 'SALA_1', label: 'Sala 01', floor: 'terreo', blockId: 'A' },
    { id: 'SALA_2', label: 'Sala 02', floor: 'superior', blockId: 'A' },
  ],
  NODE_MAP: new Map([
    [
      'BANHEIRO_1',
      { id: 'BANHEIRO_1', label: 'Banheiro Masculino', type: 'banheiro', floor: 'terreo' },
    ],
  ]),
  findPath: jest.fn((fromId: string, toId: string) => {
    if (fromId === 'SALA_1' && (toId === 'SALA_2' || toId === 'BANHEIRO_1')) {
      return {
        path: [
          { id: 'SALA_1', label: 'Sala 01', floor: 'terreo', type: 'sala' },
          { id: 'ESCADA_1', label: 'Escada Central', floor: 'terreo', type: 'escada' },
          { id: 'SALA_2', label: 'Sala 02', floor: 'superior', type: 'sala' },
        ],
        totalDistance: 60,
        floorChanges: ['terreo -> superior'],
      };
    }
    return null;
  }),
}));

describe('RouteDrawer Component', () => {
  const mockOnClose = jest.fn();
  const mockOnRouteChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('deve renderizar o título e os campos de seleção quando aberto', () => {
    render(
      <RouteDrawer
        isOpen={true}
        onClose={mockOnClose}
        onRouteChange={mockOnRouteChange}
      />
    );

    expect(screen.getByText('Buscar Rota')).toBeInTheDocument();
    expect(screen.getByText('Selecione a sala de origem')).toBeInTheDocument();
    expect(screen.getByText('Selecione a sala de destino')).toBeInTheDocument();
  });

  it('deve fechar o drawer ao clicar no botão fechar', () => {
    render(
      <RouteDrawer
        isOpen={true}
        onClose={mockOnClose}
        onRouteChange={mockOnRouteChange}
      />
    );

    const closeBtn = screen.getByLabelText('Fechar painel de busca de rota');
    fireEvent.click(closeBtn);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('deve selecionar origem e destino e calcular a rota com sucesso', () => {
    render(
      <RouteDrawer
        isOpen={true}
        onClose={mockOnClose}
        onRouteChange={mockOnRouteChange}
      />
    );

    // 1. Abre Combobox de Origem e Seleciona Sala 01
    fireEvent.click(screen.getByText('Selecione a sala de origem'));
    fireEvent.click(screen.getByText('Sala 01'));

    // 2. Abre Combobox de Destino e Seleciona Sala 02
    fireEvent.click(screen.getByText('Selecione a sala de destino'));
    fireEvent.click(screen.getByText('Sala 02'));

    // 3. Clica para Traçar Rota
    const submitBtn = screen.getByRole('button', { name: /traçar rota/i });
    fireEvent.click(submitBtn);

    // 4. Avança o timer do setTimeout de cálculo da rota dentro do act()
    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(screen.getByText('Rota encontrada')).toBeInTheDocument();
    expect(mockOnRouteChange).toHaveBeenCalledWith(
      expect.objectContaining({
        fromId: 'SALA_1',
        toId: 'SALA_2',
      })
    );
  });

  it('deve resolver dinamicamente para o banheiro mais próximo ao selecionar "Banheiro (Mais Próximo)"', () => {
    render(
      <RouteDrawer
        isOpen={true}
        onClose={mockOnClose}
        onRouteChange={mockOnRouteChange}
      />
    );

    // Origem: Sala 01
    fireEvent.click(screen.getByText('Selecione a sala de origem'));
    fireEvent.click(screen.getByText('Sala 01'));

    // Destino: Banheiro (Mais Próximo)
    fireEvent.click(screen.getByText('Selecione a sala de destino'));
    fireEvent.click(screen.getByText('Banheiro (Mais Próximo)'));

    // Traçar Rota
    fireEvent.click(screen.getByRole('button', { name: /traçar rota/i }));

    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(screen.getByText('Rota encontrada')).toBeInTheDocument();
    expect(mockOnRouteChange).toHaveBeenCalledWith(
      expect.objectContaining({
        fromId: 'SALA_1',
        toId: 'BANHEIRO_1',
      })
    );
  });

  it('deve permitir limpar a rota após o cálculo', () => {
    render(
      <RouteDrawer
        isOpen={true}
        onClose={mockOnClose}
        onRouteChange={mockOnRouteChange}
      />
    );

    fireEvent.click(screen.getByText('Selecione a sala de origem'));
    fireEvent.click(screen.getByText('Sala 01'));

    fireEvent.click(screen.getByText('Selecione a sala de destino'));
    fireEvent.click(screen.getByText('Sala 02'));

    fireEvent.click(screen.getByRole('button', { name: /traçar rota/i }));

    act(() => {
      jest.advanceTimersByTime(100);
    });

    // Clica em Limpar rota
    const clearBtn = screen.getByRole('button', { name: /limpar rota/i });
    fireEvent.click(clearBtn);

    expect(screen.queryByText('Rota encontrada')).not.toBeInTheDocument();
    expect(mockOnRouteChange).toHaveBeenLastCalledWith(null);
  });
});