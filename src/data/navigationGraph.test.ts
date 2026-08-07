import {
  NAV_NODES,
  NAV_EDGES,
  NODE_MAP,
  buildAdjacency,
  findPath,
  ROOM_OPTIONS,
  NavNode,
  RoomOption
} from './navigationGraph';

describe('Validação de Integridade do Grafo (Data Integrity)', () => {

  test('Todos os IDs de nós devem ser únicos', () => {
    const ids: string[] = NAV_NODES.map((n: NavNode) => n.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  test('NODE_MAP deve conter exatamente todos os nós de NAV_NODES', () => {
    expect(NODE_MAP.size).toEqual(NAV_NODES.length);
    NAV_NODES.forEach((node: NavNode) => {
      expect(NODE_MAP.get(node.id)).toBeDefined();
    });
  });

  test('Todas as arestas (NAV_EDGES) devem apontar para nós existentes no NODE_MAP', () => {
    NAV_EDGES.forEach((edge: { from: string; to: string }, index: number) => {
      const fromNode = NODE_MAP.get(edge.from);
      const toNode = NODE_MAP.get(edge.to);

      if (!fromNode) {
        throw new Error(`Aresta no índice ${index} possui 'from' inválido: "${edge.from}"`);
      }
      if (!toNode) {
        throw new Error(`Aresta no índice ${index} possui 'to' inválido: "${edge.to}"`);
      }

      expect(fromNode).toBeDefined();
      expect(toNode).toBeDefined();
    });
  });

  test('Opções de Salas (ROOM_OPTIONS) devem conter apenas nós válidos do tipo sala com label', () => {
    expect(ROOM_OPTIONS.length).toBeGreaterThan(0);
    ROOM_OPTIONS.forEach((room: RoomOption) => {
      const node = NODE_MAP.get(room.id);
      expect(node).toBeDefined();
      expect(node?.type).toBe('sala');
      expect(node?.label).toBeTruthy();
    });
  });
});

describe('Validação de Adjacência e Construção do Grafo', () => {

  test('buildAdjacency com accessibleOnly = false deve incluir escadas', () => {
    const adj = buildAdjacency(false);
    
    const stairNeighbors = adj.get('T_A_Escada');
    expect(stairNeighbors).toBeDefined();
    expect(stairNeighbors?.length).toBeGreaterThan(0);
  });

  test('buildAdjacency com accessibleOnly = true DEVE REMOVER nós do tipo escada', () => {
    const adj = buildAdjacency(true);

    expect(adj.get('T_A_Escada')).toBeUndefined();

    for (const [nodeId, neighbors] of adj.entries()) {
      const node = NODE_MAP.get(nodeId);
      expect(node?.type).not.toBe('escada');

      neighbors.forEach((neighbor) => {
        const neighborNode = NODE_MAP.get(neighbor.id);
        expect(neighborNode?.type).not.toBe('escada');
      });
    }
  });
});

describe('Algoritmo A* - Busca de Rotas (findPath)', () => {

  test('Deve retornar null para IDs inexistentes ou inválidos', () => {
    const path1 = findPath('NO_EXISTE_1', 'T_A01');
    const path2 = findPath('T_A01', 'NO_EXISTE_2');
    expect(path1).toBeNull();
    expect(path2).toBeNull();
  });

  test('Deve encontrar caminho direto/curto no mesmo andar (Térreo)', () => {
    const result = findPath('T_A01', 'T_A04');

    expect(result).not.toBeNull();
    if (result) {
      expect(result.path.length).toBeGreaterThan(1);
      expect(result.path[0].id).toBe('T_A01');
      expect(result.path[result.path.length - 1].id).toBe('T_A04');
      expect(result.totalDistance).toBeGreaterThan(0);
    }
  });

  test('Deve encontrar caminho com mudança de andar via Escada (Térreo -> Superior)', () => {
    const result = findPath('T_A01', 'S_A06', false);

    expect(result).not.toBeNull();
    if (result) {
      expect(result.path[0].id).toBe('T_A01');
      expect(result.path[result.path.length - 1].id).toBe('S_A06');
      expect(result.floorChanges.length).toBeGreaterThan(0);
      const hasStair = result.floorChanges.some((fc) => fc.type === 'escada');
      expect(hasStair).toBe(true);
    }
  });

  test('Modo Acessível: DEVE priorizar ou usar exclusivamente Rampa entre andares', () => {
    const result = findPath('T_JUNCTION_Rampa', 'S_C17', true);

    expect(result).not.toBeNull();
    if (result) {
      const hasStairs = result.path.some((node: NavNode) => node.type === 'escada');
      expect(hasStairs).toBe(false);

      const hasRamp = result.path.some((node: NavNode) => node.type === 'rampa');
      expect(hasRamp).toBe(true);
    }
  });

  test('Modo Acessível: DEVE falhar (retornar null) para locais isolados sem rampa ou elevador', () => {
    const result = findPath('T_ENTRY', 'SUB_D14', true);
    expect(result).toBeNull();
  });

  test('Navegação entre extremidades do Campus', () => {
    const result = findPath('T_G02', 'SUB_D15', false);

    expect(result).not.toBeNull();
    if (result) {
      expect(result.path[0].id).toBe('T_G02');
      expect(result.path[result.path.length - 1].id).toBe('SUB_D15');
      expect(result.totalDistance).toBeGreaterThan(0);
    }
  });
});