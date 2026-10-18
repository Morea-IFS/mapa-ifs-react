import { render, screen, fireEvent } from '@testing-library/react';
import MapaGeralPage from './page';

// Mock do `next/dynamic` para resolver o aviso de act() do LoadableComponent
jest.mock('next/dynamic', () => ({
  __esModule: true,
  default: (componentLoader: () => Promise<any>) => {
    // Carrega o componente imediatamente/sincronamente no ambiente de teste
    const React = require('react');
    let Component: any = null;
    
    componentLoader().then((mod: any) => {
      Component = mod.default || mod;
    });

    return function DynamicMock(props: any) {
      if (!Component) return null;
      return <Component {...props} />;
    };
  },
}));

// 1. Mock do CampusMap para evitar problemas de SSR e dynamic import
jest.mock('@/components/CampusMap', () => ({
  __esModule: true,
  default: () => <div data-testid="campus-map" />,
}));

// 2. Mock dos dados para garantir estabilidade
jest.mock('@/data/blocos', () => ({
  blocos: [
    {
      id: 'bloco-a',
      name: 'Bloco A',
      description: 'Bloco A — Administração',
      floors: [{ rooms: [] }],
      color: '#000',
    },
  ],
}));

// 3. Mock do RouteDrawer para controlar a interação facilmente
jest.mock('@/components/RouteDrawer', () => ({
  __esModule: true,
  default: ({ isOpen, onRouteChange, presentation }: any) => {
    if (!isOpen && presentation !== 'inline') return null;
    return (
      <div data-testid="route-drawer-mock">
        <button
          onClick={() =>
            onRouteChange({
              fromId: '1',
              toId: '2',
              pathResult: { floorChanges: [] },
            })
          }
        >
          Simular Rota
        </button>
      </div>
    );
  },
}));

describe('MapaGeralPage', () => {
  test('deve renderizar o título e os blocos', () => {
    render(<MapaGeralPage />);
    
    expect(screen.getByText(/MERO/i)).toBeInTheDocument();
    expect(screen.getByText('Bloco A')).toBeInTheDocument();
  });

  test('deve exibir a busca de rota diretamente na tela principal', () => {
    render(<MapaGeralPage />);
    expect(screen.getByTestId('route-drawer-mock')).toBeInTheDocument();
  });

  test('deve exibir o banner de "Rota ativa" após selecionar uma rota', () => {
    render(<MapaGeralPage />);
    
    // A busca já fica disponível na tela principal.
    // Clica no botão simulado da busca
    fireEvent.click(screen.getByText('Simular Rota'));
    
    // Verifica se o banner aparece
    const banner = screen.getByRole('status');
    expect(banner).toHaveTextContent(/rota ativa/i);
  });

  test('deve limpar a rota ao clicar no botão de limpar', () => {
    render(<MapaGeralPage />);
    
    // Ativa a rota
    fireEvent.click(screen.getByText('Simular Rota'));
    
    // Limpa
    const clearBtn = screen.getByLabelText(/limpar rota ativa/i);
    fireEvent.click(clearBtn);
    
    // Verifica se sumiu
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});