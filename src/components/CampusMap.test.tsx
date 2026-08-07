import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CampusMap from './CampusMap';

jest.mock('leaflet', () => ({
  ...jest.requireActual('leaflet'),
  CRS: { Simple: {} },
  LatLngBounds: jest.fn(),
  DivIcon: jest.fn(),
}));

jest.mock('react-leaflet', () => ({
  MapContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="map-container">{children}</div>
  ),
  ImageOverlay: () => <div data-testid="image-overlay" />,
  Marker: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="map-marker">{children}</div>
  ),
  Popup: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="map-popup">{children}</div>
  ),
  useMap: () => ({
    fitBounds: jest.fn(),
  }),
}));

jest.mock('@/data/blocos', () => ({
  blocos: [
    {
      id: 'A',
      name: 'Bloco A',
      description: 'Laboratórios de Informática',
      color: '#FF0000',
      mapPosition: {
        terreo: { x: 50, y: 50 },
      },
      floors: [
        { rooms: [{ id: '1' }, { id: '2' }] }
      ]
    },
    {
      id: 'E',
      name: 'Bloco E',
      description: 'Auditório e Biblioteca',
      mapPosition: {
        subsolo: { x: 30, y: 30 },
      },
      floors: [{ rooms: [] }]
    }
  ],
}));

jest.mock('@/assets/mapa_geral.png', () => ({ src: '/mapa_geral.png' }));
jest.mock('@/assets/mapa_geral_superior.png', () => ({ src: '/mapa_geral_superior.png' }));
jest.mock('@/assets/mapa_geral_subsolo.png', () => ({ src: '/mapa_geral_subsolo.png' }));

jest.mock('@/components/RouteOverlay', () => {
  return function MockRouteOverlay() {
    return <div data-testid="route-overlay">Rota Desenhada</div>;
  };
});

describe('Componente CampusMap', () => {
  it('deve renderizar o mapa e a estrutura de acessibilidade corretamente', () => {
    render(<CampusMap floor="terreo" />);

    const mapElement = screen.getByRole('application');
    expect(mapElement).toBeInTheDocument();
    expect(mapElement).toHaveAttribute('aria-label', 'Mapa interativo do campus — Térreo');

    expect(screen.getByTestId('map-container')).toBeInTheDocument();
  });

  it('deve listar os blocos visíveis para leitores de tela', () => {
    render(<CampusMap floor="terreo" />);

    expect(screen.getByText(/O Bloco A contém Laboratórios de Informática/i)).toBeInTheDocument();
  });

  it('deve atualizar o aria-label quando mudar o andar (floor)', async () => {
    const { rerender } = render(<CampusMap floor="terreo" />);

    rerender(<CampusMap floor="subsolo" />);

    await waitFor(() => {
      expect(screen.getByRole('application')).toHaveAttribute(
        'aria-label',
        'Mapa interativo do campus — Subsolo'
      );
    });
  });

  it('deve renderizar a rota quando o routeResult for fornecido', () => {
    const mockRouteResult = {
      fromId: 'A',
      toId: 'B',
      accessibleOnly: false,
      pathResult: {
        path: [
          { id: 'node-1', type: 'corredor' as const, x: 10, y: 10, floor: 'terreo' as const },
          { id: 'node-2', type: 'corredor' as const, x: 20, y: 20, floor: 'terreo' as const }
        ],
        floorChanges: [],
        totalDistance: 100,
      },
    };

    render(<CampusMap floor="terreo" routeResult={mockRouteResult} />);

    expect(screen.getByTestId('route-overlay')).toBeInTheDocument();
    expect(screen.getByText(/Rota traçada com 2 pontos/i)).toBeInTheDocument();
  });
});