import { render } from '@testing-library/react';
import RouteOverlay from './RouteOverlay';
import L from 'leaflet';
import type { PathResult } from '@/data/navigationGraph';

jest.mock('leaflet', () => {
  const originalL = jest.requireActual('leaflet');

  const mockLayerGroup = {
    addTo: jest.fn().mockReturnThis(),
    clearLayers: jest.fn().mockReturnThis(),
  };

  const mockPolyline: { addTo: jest.Mock; on: jest.Mock } = {
    addTo: jest.fn(),
    on: jest.fn(),
  };

  mockPolyline.addTo.mockReturnValue(mockPolyline);
  mockPolyline.on.mockImplementation((event: string, cb: (e: { target: { _path: unknown } }) => void) => {
    if (event === 'add') {
      cb({
        target: {
          _path: {
            style: { setProperty: jest.fn() },
            classList: { add: jest.fn() },
          },
        },
      });
    }
    return mockPolyline;
  });

  const mockMarker = {
    addTo: jest.fn().mockReturnThis(),
  };

  return {
    ...originalL,
    layerGroup: jest.fn(() => mockLayerGroup),
    polyline: jest.fn(() => mockPolyline),
    marker: jest.fn(() => mockMarker),
    divIcon: jest.fn((config) => config),
    latLng: jest.fn((lat: number, lng: number) => ({ lat, lng })),
  };
});

const mockMap = {};
jest.mock('react-leaflet', () => ({
  useMap: () => mockMap,
}));

describe('Componente RouteOverlay', () => {
  const mockPathResult: PathResult = {
    path: [
      { id: 'T_ENTRY', floor: 'terreo', type: 'sala', label: 'Entrada', x: 10, y: 20 },
      { id: 'A01', floor: 'terreo', type: 'sala', label: 'A01', x: 30, y: 40 },
      { id: 'STAIRS_T', floor: 'terreo', type: 'escada', label: 'Escada Térreo', x: 50, y: 50 },
      { id: 'STAIRS_SUP', floor: 'superior', type: 'escada', label: 'Escada Superior', x: 50, y: 50 },
      { id: 'B01', floor: 'superior', type: 'sala', label: 'B01', x: 70, y: 80 },
    ],
    totalDistance: 100,
    floorChanges: [
      {
        floor: 'superior',
        nodeId: 'STAIRS_SUP',
        type: 'escada',
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Não deve renderizar elemento DOM visível (retorna null)', () => {
    const { container } = render(
      <RouteOverlay
        pathResult={null}
        fromId="T_ENTRY"
        toId="B01"
        currentFloor="terreo"
      />
    );

    expect(container.firstChild).toBeNull();
  });

  test('Deve inicializar o layerGroup e adicionar ao mapa', () => {
    render(
      <RouteOverlay
        pathResult={null}
        fromId="T_ENTRY"
        toId="B01"
        currentFloor="terreo"
      />
    );

    expect(L.layerGroup).toHaveBeenCalled();
  });

  test('Deve limpar o layerGroup quando pathResult for null', () => {
    const { rerender } = render(
      <RouteOverlay
        pathResult={mockPathResult}
        fromId="T_ENTRY"
        toId="B01"
        currentFloor="terreo"
      />
    );

    const mockLayerGroupInstance = (L.layerGroup as jest.Mock).mock.results[0].value;

    rerender(
      <RouteOverlay
        pathResult={null}
        fromId="T_ENTRY"
        toId="B01"
        currentFloor="terreo"
      />
    );

    expect(mockLayerGroupInstance.clearLayers).toHaveBeenCalled();
  });

  test('Deve desenhar linhas da rota e marcadores de waypoint para o andar atual', () => {
    render(
      <RouteOverlay
        pathResult={mockPathResult}
        fromId="T_ENTRY"
        toId="B01"
        currentFloor="terreo"
      />
    );

    expect(L.polyline).toHaveBeenCalledTimes(2);
    expect(L.marker).toHaveBeenCalled();
  });

  test('Deve lidar com o caso especial de transição direta de andar sem pontos suficientes no andar atual', () => {
    render(
      <RouteOverlay
        pathResult={mockPathResult}
        fromId="T_ENTRY"
        toId="B01"
        currentFloor="superior"
      />
    );

    expect(L.marker).toHaveBeenCalled();
  });

  test('Deve limpar as camadas ao desmontar o componente', () => {
    const { unmount } = render(
      <RouteOverlay
        pathResult={mockPathResult}
        fromId="T_ENTRY"
        toId="B01"
        currentFloor="terreo"
      />
    );

    const mockLayerGroupInstance = (L.layerGroup as jest.Mock).mock.results[0].value;
    unmount();

    expect(mockLayerGroupInstance.clearLayers).toHaveBeenCalled();
  });
});