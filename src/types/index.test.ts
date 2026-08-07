import { BlocoData, Floor, Room, MapCoordinates } from './index';

describe('Validação das Interfaces do Sistema (types/index.ts)', () => {

  test('Objeto Room deve aceitar code e name como strings', () => {
    const room: Room = {
      code: 'A01',
      name: 'Ala Médica'
    };

    expect(room.code).toBe('A01');
    expect(room.name).toBe('Ala Médica');
  });

  test('Objeto MapCoordinates deve aceitar apenas coordenadas x e y numéricas', () => {
    const coords: MapCoordinates = {
      x: 34.5,
      y: 95.0
    };

    expect(typeof coords.x).toBe('number');
    expect(typeof coords.y).toBe('number');
  });

  test('Objeto Floor deve conter lista de salas e imagem válida', () => {
    const floor: Floor = {
      name: 'Andar Inferior',
      image: '/assets/mapas/blocoA_inferior.png',
      rooms: [
        { code: 'A01', name: 'Ala médica do campus' },
        { code: 'A02', name: 'Arquivos' }
      ]
    };

    expect(floor.name).toBe('Andar Inferior');
    expect(floor.rooms).toHaveLength(2);
    expect(floor.image).toBeDefined();
  });

  test('Objeto BlocoData deve suportar campos opcionais e obrigatórios', () => {
    const blocoCompleto: BlocoData = {
      id: 'D',
      name: 'Bloco D',
      description: 'Bloco D — CEEL e Laboratórios',
      color: '#6bcb77',
      energyDashboardId: 10,
      mapPosition: {
        terreo: { x: 65, y: 45 },
        superior: { x: 70, y: 45 },
        subsolo: { x: 49, y: 54 }
      },
      floors: [
        {
          name: 'Térreo',
          image: '/mapa.png',
          rooms: [{ code: 'D01', name: 'CEEL' }]
        }
      ]
    };

    expect(blocoCompleto.id).toBe('D');
    expect(blocoCompleto.energyDashboardId).toBe(10);
    expect(blocoCompleto.mapPosition.subsolo).toEqual({ x: 49, y: 54 });

    const blocoMinimo: BlocoData = {
      id: 'H',
      name: 'Bloco H',
      description: 'Bloco H — Auditório',
      mapPosition: {
        terreo: { x: 15, y: 79 }
      },
      floors: []
    };

    expect(blocoMinimo.color).toBeUndefined();
    expect(blocoMinimo.energyDashboardId).toBeUndefined();
    expect(blocoMinimo.mapPosition.superior).toBeUndefined();
  });
});