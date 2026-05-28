export type FloorLevel = 'terreo' | 'superior' | 'subsolo';

export interface NavNode {
  id: string;
  x: number; // % width
  y: number; // % height
  floor: FloorLevel;
  label?: string;
  type: 'room' | 'corridor' | 'stairs' | 'ramp' | 'entrance' | 'junction' | 'bathroom';
  // Se é ponto de transição de andar
  connectsTo?: { nodeId: string; floor: FloorLevel }[];
}

export interface NavEdge {
  from: string;
  to: string;
  weight?: number; // distância relativa (calculada automaticamente se omitida)
  accessible?: boolean; // true = acessível para cadeirantes (rampas/elevadores)
}

// NÓS DO GRAFO
export const NAV_NODES: NavNode[] = [

  // ── TÉRREO 
  // ── Corredores e Junções Principais (Térreo) ──
  { id: 'T_CORRIDOR_Oeste_1',   x: 21.83, y: 87.79, floor: 'terreo', type: 'corridor' },
  { id: 'T_CORRIDOR_Oeste_2',   x: 21.94, y: 69.20, floor: 'terreo', type: 'corridor' },
  { id: 'T_CORRIDOR_Central_1', x: 50.09, y: 87.57, floor: 'terreo', type: 'corridor' },
  { id: 'T_CORRIDOR_Central_2', x: 49.98, y: 70.26, floor: 'terreo', type: 'corridor' },
  { id: 'T_CORRIDOR_Central_3', x: 50.09, y: 57.66, floor: 'terreo', type: 'corridor' },
  { id: 'T_CORRIDOR_Central_4', x: 49.98, y: 49.75, floor: 'terreo', type: 'corridor' },
  { id: 'T_CORRIDOR_Central_5', x: 50.19, y: 39.92, floor: 'terreo', type: 'corridor' },
  { id: 'T_CORRIDOR_Central_6', x: 49.98, y: 27.10, floor: 'terreo', type: 'corridor' },
  { id: 'T_CORRIDOR_Leste_1',   x: 78.87, y: 70.26, floor: 'terreo', type: 'corridor' },
  { id: 'T_CORRIDOR_Leste_2',   x: 78.77, y: 57.83, floor: 'terreo', type: 'corridor' },
  { id: 'T_CORRIDOR_Leste_3',   x: 78.77, y: 46.97, floor: 'terreo', type: 'corridor' },
  
  { id: 'T_JUNCTION_A_W',       x: 21.83, y: 93.04, floor: 'terreo', type: 'junction' },
  { id: 'T_JUNCTION_A_L',       x: 49.98, y: 93.04, floor: 'terreo', type: 'junction' },
  { id: 'T_JUNCTION_B_W',       x: 49.76, y: 76.80, floor: 'terreo', type: 'junction' },
  { id: 'T_JUNCTION_B_L',       x: 78.77, y: 76.38, floor: 'terreo', type: 'junction' },
  { id: 'T_JUNCTION_C_W',       x: 21.83, y: 60.56, floor: 'terreo', type: 'junction' },
  { id: 'T_JUNCTION_C_E',       x: 49.87, y: 60.78, floor: 'terreo', type: 'junction' },
  { id: 'T_JUNCTION_D_W',       x: 50.09, y: 45.18, floor: 'terreo', type: 'junction' },
  { id: 'T_JUNCTION_D_E',       x: 78.66, y: 44.97, floor: 'terreo', type: 'junction' },
  { id: 'T_JUNCTION_E',         x: 78.77, y: 49.45, floor: 'terreo', type: 'junction' },
  { id: 'T_JUNCTION_H',         x: 21.83, y: 76.80, floor: 'terreo', type: 'junction' },
  
  // ── Bloco A (Térreo) ──
  { id: 'T_A_ENTRY',            x: 34.25, y: 93.90, floor: 'terreo', type: 'entrance' },
  { id: 'T_CORRIDOR_A',         x: 42.81, y: 92.87, floor: 'terreo', type: 'corridor' },
  { id: 'T_JUNCTION_A_Escada',  x: 30.82, y: 93.56, floor: 'terreo', type: 'junction' },
  { id: 'T_A01',                x: 24.19, y: 92.53, floor: 'terreo', type: 'room', label: 'Ala Médica' },
  { id: 'T_A02',                x: 26.86, y: 92.53, floor: 'terreo', type: 'room', label: 'Arquivos' },
  { id: 'T_A03',                x: 28.47, y: 92.66, floor: 'terreo', type: 'room', label: 'Data Center' },
  { id: 'T_A04',                x: 32.00, y: 92.44, floor: 'terreo', type: 'room', label: 'CRE - Coordenação de Registro Escolar' },
  { id: 'T_A05',                x: 36.39, y: 92.23, floor: 'terreo', type: 'room', label: 'Biblioteca' },
  { id: 'T_A_Escada',           x: 30.93, y: 93.26, floor: 'terreo', type: 'stairs',
    connectsTo: [{ nodeId: 'S_A_Escada', floor: 'superior' }] },

  // ── Bloco B (Térreo) ──
  { id: 'T_B_ENTRY',            x: 51.90, y: 76.80, floor: 'terreo', type: 'entrance' },
  { id: 'T_JUNCTION_B_Escada',  x: 69.78, y: 76.89, floor: 'terreo', type: 'junction' },
  { id: 'T_B01',                x: 53.08, y: 76.46, floor: 'terreo', type: 'room', label: 'Lab. Química' },
  { id: 'T_B02',                x: 58.54, y: 76.25, floor: 'terreo', type: 'room', label: 'Lab. Física' },
  { id: 'T_B03',                x: 61.96, y: 76.03, floor: 'terreo', type: 'room', label: 'Lab. Biologia' },
  { id: 'T_B04',                x: 66.78, y: 75.82, floor: 'terreo', type: 'room', label: 'Sala Desenho 03' },
  { id: 'T_B05',                x: 71.92, y: 75.82, floor: 'terreo', type: 'room', label: 'Sala Desenho 02' },
  { id: 'T_B06',                x: 77.16, y: 76.46, floor: 'terreo', type: 'room', label: 'Sala Desenho 01' },
  { id: 'T_B_Escada',           x: 69.78, y: 77.66, floor: 'terreo', type: 'stairs',
    connectsTo: [{ nodeId: 'S_B_Escada', floor: 'superior' }] },

  // ── Bloco C (Térreo) ──
  { id: 'T_C_ENTRY',            x: 47.95, y: 60.56, floor: 'terreo', type: 'entrance' },
  { id: 'T_JUNCTION_C_Escada',  x: 30.82, y: 60.65, floor: 'terreo', type: 'junction' },
  { id: 'T_JUNCTION_Rampa',     x: 50.73, y: 54.03, floor: 'terreo', type: 'junction' },
  { id: 'T_C01',                x: 25.26, y: 60.44, floor: 'terreo', type: 'room', label: 'Lab. Informática' },
  { id: 'T_C02',                x: 28.36, y: 60.65, floor: 'terreo', type: 'room', label: 'Lab. Refrigeração' },
  { id: 'T_C03',                x: 32.00, y: 60.22, floor: 'terreo', type: 'room', label: 'Lab. Máquinas e Acionamentos Elétricas' },
  { id: 'T_C04',                x: 35.21, y: 60.44, floor: 'terreo', type: 'room', label: 'LABIC - Laboratório de Inovação e Criatividade' },
  { id: 'T_C05',                x: 38.63, y: 60.44, floor: 'terreo', type: 'room', label: 'Lab. Ensaios Mecânicos' },
  { id: 'T_C06',                x: 40.45, y: 60.22, floor: 'terreo', type: 'room', label: 'Sophia Polis' },
  { id: 'T_C07',                x: 43.77, y: 60.65, floor: 'terreo', type: 'room', label: 'Lab. Eletricidade' },
  { id: 'T_C08',                x: 46.77, y: 60.22, floor: 'terreo', type: 'room', label: 'Lab. Topografia' },
  { id: 'T_C09',                x: 49.87, y: 54.24, floor: 'terreo', type: 'room', label: 'CTI' },
  { id: 'T_C10',                x: 51.16, y: 54.41, floor: 'terreo', type: 'room', label: 'Almoxarifado' },
  { id: 'T_C11',                x: 51.90, y: 58.47, floor: 'terreo', type: 'room', label: 'Lab. Física Exp.' },
  { id: 'T_C_Escada',           x: 31.04, y: 61.42, floor: 'terreo', type: 'stairs',
    connectsTo: [{ nodeId: 'S_C_Escada', floor: 'superior' }] },
  { id: 'T_Rampa',              x: 52.23, y: 53.98, floor: 'terreo', type: 'ramp',
    connectsTo: [{ nodeId: 'S_Rampa', floor: 'superior' }] },

  // ── Bloco D (Térreo) ──
  { id: 'T_D_ENTRY',            x: 51.69, y: 45.18, floor: 'terreo', type: 'entrance' },
  { id: 'T_JUNCTION_D_Escada',  x: 69.56, y: 45.69, floor: 'terreo', type: 'junction' },
  { id: 'T_D01',                x: 50.41, y: 40.14, floor: 'terreo', type: 'room', label: 'CEEL' },
  { id: 'T_D02',                x: 56.72, y: 44.75, floor: 'terreo', type: 'room', label: 'Lab. Inst. Elétricas' },
  { id: 'T_D03',                x: 61.86, y: 44.75, floor: 'terreo', type: 'room', label: 'Lab. Inst. Hidráulicas' },
  { id: 'T_D04',                x: 68.71, y: 44.11, floor: 'terreo', type: 'room', label: 'Lab. Mecânica Solos' },
  { id: 'T_D05',                x: 70.42, y: 44.11, floor: 'terreo', type: 'room', label: 'Sala Pesquisa COED' },
  { id: 'T_D06',                x: 73.63, y: 44.75, floor: 'terreo', type: 'room', label: 'Lab. Materiais Construção' },
  { id: 'T_D_Escada',           x: 69.67, y: 46.03, floor: 'terreo', type: 'stairs',
    connectsTo: [{ nodeId: 'S_D_Escada', floor: 'superior' }, { nodeId: 'SUB_D_Escada', floor: 'subsolo' }] },

  // ── Bloco E (Térreo) ──
  { id: 'T_E_ENTRY',            x: 83.15, y: 50.95, floor: 'terreo', type: 'entrance' },
  { id: 'T_JUNCTION_E_Salas',   x: 87.33, y: 59.11, floor: 'terreo', type: 'junction' },
  { id: 'T_E01',                x: 82.62, y: 57.40, floor: 'terreo', type: 'room', label: 'COED' },
  { id: 'T_E02',                x: 88.18, y: 57.83, floor: 'terreo', type: 'room', label: 'Ateliê de arquitetura' },
  { id: 'T_E03',                x: 86.79, y: 60.82, floor: 'terreo', type: 'room', label: 'Laboratório CAD' },
  { id: 'T_E04',                x: 86.04, y: 61.89, floor: 'terreo', type: 'room', label: 'Ateliê de arquitetura' },
  { id: 'T_E_Escada',           x: 87.33, y: 56.72, floor: 'terreo', type: 'stairs',
    connectsTo: [{ nodeId: 'SUB_E_Escada', floor: 'subsolo' }] },

  // ── Bloco F e G (Térreo) ──
  { id: 'T_F_ENTRY',            x: 60.89, y: 19.75, floor: 'terreo', type: 'entrance' },
  { id: 'T_G_ENTRY',            x: 50.30, y: 18.47, floor: 'terreo', type: 'entrance' },
  { id: 'T_CORRIDOR_FG',        x: 55.65, y: 10.82, floor: 'terreo', type: 'corridor' },
  { id: 'T_JUNCTION_FG',        x: 50.09, y: 32.40, floor: 'terreo', type: 'junction' },
  { id: 'T_JUNCTION_GF',        x: 58.33, y: 15.73, floor: 'terreo', type: 'junction' },
  { id: 'T_JUNCTION_G',         x: 50.30, y: 15.73, floor: 'terreo', type: 'junction' },
  { id: 'T_JUNCTION_F',         x: 56.08, y: 26.42, floor: 'terreo', type: 'junction' },
  { id: 'T_JUNCTION_F_Salas',   x: 62.39, y: 21.80, floor: 'terreo', type: 'junction' },
  { id: 'T_F01',                x: 64.00, y: 19.79, floor: 'terreo', type: 'room', label: 'COIRC/BSI' },
  { id: 'T_F02',                x: 65.50, y: 17.02, floor: 'terreo', type: 'room', label: 'Grufee' },
  { id: 'T_F03',                x: 66.67, y: 15.14, floor: 'terreo', type: 'room', label: 'Sala de Aula 11' },
  { id: 'T_F04',                x: 67.64, y: 12.36, floor: 'terreo', type: 'room', label: 'Lab. Robótica' },
  { id: 'T_F05',                x: 65.39, y: 15.78, floor: 'terreo', type: 'room', label: 'MOREA' },
  { id: 'T_F06',                x: 66.35, y: 14.45, floor: 'terreo', type: 'room', label: 'Lab. Eletrônica' },
  { id: 'T_F07',                x: 67.53, y: 12.32, floor: 'terreo', type: 'room', label: 'CEEL' },
  { id: 'T_G01',                x: 49.98, y: 24.50, floor: 'terreo', type: 'room', label: 'CLF' },
  { id: 'T_G02',                x: 47.52, y: 13.81, floor: 'terreo', type: 'room', label: 'Cantina' },
  { id: 'T_G03',                x: 50.41, y: 21.72, floor: 'terreo', type: 'room', label: 'Estudo' },
  { id: 'T_G04',                x: 52.98, y: 23.00, floor: 'terreo', type: 'room', label: 'Lab. Física' },
  { id: 'T_G05',                x: 53.94, y: 13.60, floor: 'terreo', type: 'room', label: 'Arquivos' },
  { id: 'T_G06',                x: 50.41, y: 12.32, floor: 'terreo', type: 'room', label: 'Refeitório' },
  { id: 'T_F_Escada',           x: 61.22, y: 23.17, floor: 'terreo', type: 'stairs',
    connectsTo: [{ nodeId: 'S_F_Escada', floor: 'superior' }] },
  { id: 'T_F_Escada_SUB',       x: 60.68, y: 34.54, floor: 'terreo', type: 'stairs',
    connectsTo: [{ nodeId: 'SUB_F_Escada', floor: 'subsolo' }] },

  // ── Bloco H e Containers (Térreo) ──
  { id: 'T_H_ENTRY',            x: 20.44, y: 76.80, floor: 'terreo', type: 'entrance' },
  { id: 'T_Entrada_W',          x: 19.91, y: 98.30, floor: 'terreo', type: 'entrance' },
  { id: 'T_JUNCTION_Containers',x: 13.59, y: 98.30, floor: 'terreo', type: 'junction' },
  { id: 'T_H01',                x: 17.98, y: 76.46, floor: 'terreo', type: 'room', label: 'Auditório' },
  { id: 'T_H02',                x: 18.84, y: 86.50, floor: 'terreo', type: 'room', label: 'Container Estúdio' },
  { id: 'T_H03',                x: 17.23, y: 91.20, floor: 'terreo', type: 'room', label: 'Container Depósito' },
  { id: 'T_H04',                x: 13.06, y: 88.00, floor: 'terreo', type: 'room', label: 'Container Labic' },
  { id: 'T_H05',                x: 7.71,  y: 98.47, floor: 'terreo', type: 'room', label: 'Container LIA' },

  // ── Instalações Extras e Banheiros (Térreo) ──
  { id: 'T_Ginasio',            x: 50.41, y: 4.79,  floor: 'terreo', type: 'room', label: 'Ginásio Poliesportivo' },
  { id: 'T_Galpao',             x: 63.04, y: 6.93,  floor: 'terreo', type: 'room', label: 'Galpão' },
  { id: 'T_Banheiro_1',         x: 50.19, y: 85.18, floor: 'terreo', type: 'bathroom' },
  { id: 'T_Banheiro_2',         x: 49.98, y: 37.32, floor: 'terreo', type: 'bathroom' },
  { id: 'T_Banheiro_E',         x: 81.66, y: 58.90, floor: 'terreo', type: 'bathroom' },
  { id: 'T_Banheiro_F',         x: 62.93, y: 18.94, floor: 'terreo', type: 'bathroom' },
  { id: 'T_Banheiro_H',         x: 23.01, y: 76.67, floor: 'terreo', type: 'bathroom' },

  // ── ANDAR SUPERIOR
  // ── Corredores e Junções Principais (Superior) ──
  { id: 'S_CORRIDOR_Oeste_1',   x: 27.93, y: 87.96, floor: 'superior', type: 'corridor' },
  { id: 'S_CORRIDOR_Oeste_2',   x: 27.93, y: 68.73, floor: 'superior', type: 'corridor' },
  { id: 'S_CORRIDOR_Central_1', x: 56.51, y: 90.31, floor: 'superior', type: 'corridor' },
  { id: 'S_CORRIDOR_Central_2', x: 56.29, y: 71.29, floor: 'superior', type: 'corridor' },
  { id: 'S_CORRIDOR_Central_3', x: 56.51, y: 53.56, floor: 'superior', type: 'corridor' },
  { id: 'S_CORRIDOR_Central_4', x: 56.51, y: 33.04, floor: 'superior', type: 'corridor' },
  { id: 'S_CORRIDOR_Leste_1',   x: 85.30, y: 58.68, floor: 'superior', type: 'corridor' },

  { id: 'S_JUNCTION_A_W',       x: 27.83, y: 93.73, floor: 'superior', type: 'junction' },
  { id: 'S_JUNCTION_A_L',       x: 56.40, y: 93.73, floor: 'superior', type: 'junction' },
  { id: 'S_JUNCTION_B_W',       x: 56.40, y: 77.49, floor: 'superior', type: 'junction' },
  { id: 'S_JUNCTION_B_L',       x: 84.97, y: 77.49, floor: 'superior', type: 'junction' },
  { id: 'S_JUNCTION_C_W',       x: 27.83, y: 61.67, floor: 'superior', type: 'junction' },
  { id: 'S_JUNCTION_C_E',       x: 56.40, y: 60.82, floor: 'superior', type: 'junction' },
  { id: 'S_JUNCTION_D_W',       x: 56.40, y: 46.29, floor: 'superior', type: 'junction' },
  { id: 'S_JUNCTION_D_E',       x: 85.08, y: 45.86, floor: 'superior', type: 'junction' },
  { id: 'S_JUNCTION_F',         x: 68.92, y: 20.44, floor: 'superior', type: 'junction' },

  // ── Bloco A (Superior) ──
  { id: 'S_A_ENTRY',            x: 56.08, y: 94.11, floor: 'superior', type: 'entrance' },
  { id: 'S_JUNCTION_A_Escada',  x: 36.82, y: 93.94, floor: 'superior', type: 'junction' },
  { id: 'S_A06',                x: 30.29, y: 93.51, floor: 'superior', type: 'room', label: 'Direção Geral' },
  { id: 'S_A07',                x: 32.75, y: 93.94, floor: 'superior', type: 'room', label: 'Gabinete' },
  { id: 'S_A08',                x: 35.10, y: 93.94, floor: 'superior', type: 'room', label: 'Gerência Adm.' },
  { id: 'S_A09',                x: 41.42, y: 93.73, floor: 'superior', type: 'room', label: 'Sala Reunião' },
  { id: 'S_A10',                x: 44.31, y: 93.73, floor: 'superior', type: 'room', label: 'DEN - Direção de Ensino' },
  { id: 'S_A11',                x: 52.44, y: 93.94, floor: 'superior', type: 'room', label: 'Coord. Superiores' },
  { id: 'S_A12',                x: 54.90, y: 93.73, floor: 'superior', type: 'room', label: 'NAPNE' },
  { id: 'S_A_Escada',           x: 36.92, y: 96.50, floor: 'superior', type: 'stairs',
    connectsTo: [{ nodeId: 'T_A_Escada', floor: 'terreo' }] },

  // ── Bloco B (Superior) ──
  { id: 'S_B_ENTRY',            x: 58.22, y: 77.44, floor: 'superior', type: 'entrance' },
  { id: 'S_JUNCTION_B_Escada',  x: 76.20, y: 77.49, floor: 'superior', type: 'junction' },
  { id: 'S_B07',                x: 59.61, y: 77.57, floor: 'superior', type: 'room', label: 'Sala de Aula 1' },
  { id: 'S_B08',                x: 62.93, y: 77.79, floor: 'superior', type: 'room', label: 'Sala de Aula 2' },
  { id: 'S_B09',                x: 66.78, y: 77.79, floor: 'superior', type: 'room', label: 'Sala de Aula 3' },
  { id: 'S_B10',                x: 70.10, y: 77.79, floor: 'superior', type: 'room', label: 'Sala de Aula 4' },
  { id: 'S_B11',                x: 73.63, y: 78.00, floor: 'superior', type: 'room', label: 'Sala de Aula 5' },
  { id: 'S_B12',                x: 77.48, y: 78.00, floor: 'superior', type: 'room', label: 'Sala de Aula 6' },
  { id: 'S_B13',                x: 80.48, y: 78.00, floor: 'superior', type: 'room', label: 'Sala de Aula 7' },
  { id: 'S_B14',                x: 82.19, y: 77.36, floor: 'superior', type: 'room', label: 'Lab. Desenho CAD' },
  { id: 'S_B_Escada',           x: 75.98, y: 79.88, floor: 'superior', type: 'stairs',
    connectsTo: [{ nodeId: 'T_B_Escada', floor: 'terreo' }] },

  // ── Bloco C (Superior) ──
  { id: 'S_C_ENTRY',            x: 55.44, y: 61.63, floor: 'superior', type: 'entrance' },
  { id: 'S_JUNCTION_C_Escada',  x: 36.82, y: 61.03, floor: 'superior', type: 'junction' },
  { id: 'S_C10',                x: 33.71, y: 61.25, floor: 'superior', type: 'room', label: 'Mini Auditório' },
  { id: 'S_C11',                x: 35.21, y: 61.46, floor: 'superior', type: 'room', label: 'Lab. Física Moderna' },
  { id: 'S_C12',                x: 39.17, y: 61.67, floor: 'superior', type: 'room', label: 'Sala EAD / Multimídia' },
  { id: 'S_C13',                x: 41.95, y: 61.46, floor: 'superior', type: 'room', label: 'CCHS' },
  { id: 'S_C14',                x: 43.77, y: 61.25, floor: 'superior', type: 'room', label: 'Sala de Aula 10' },
  { id: 'S_C15',                x: 46.55, y: 61.03, floor: 'superior', type: 'room', label: 'Sala de Aula 9' },
  { id: 'S_C16',                x: 49.98, y: 61.25, floor: 'superior', type: 'room', label: 'Sala de Aula 8' },
  { id: 'S_C17',                x: 54.37, y: 61.25, floor: 'superior', type: 'room', label: 'Lab. Controle e Simulação' },
  { id: 'S_C_Escada',           x: 36.82, y: 64.07, floor: 'superior', type: 'stairs',
    connectsTo: [{ nodeId: 'T_C_Escada', floor: 'terreo' }] },
  { id: 'S_Rampa',              x: 58.22, y: 59.07, floor: 'superior', type: 'ramp',
    connectsTo: [{ nodeId: 'T_Rampa', floor: 'terreo' }] },

  // ── Bloco D (Superior) ──
  { id: 'S_D_ENTRY',            x: 57.68, y: 45.82, floor: 'superior', type: 'entrance' },
  { id: 'S_JUNCTION_D_Escada',  x: 75.88, y: 45.86, floor: 'superior', type: 'junction' },
  { id: 'S_D07',                x: 58.22, y: 46.08, floor: 'superior', type: 'room', label: 'Sala Prof. EMEC' },
  { id: 'S_D08',                x: 63.04, y: 46.29, floor: 'superior', type: 'room', label: 'Lab. Ensinagens' },
  { id: 'S_D09',                x: 66.78, y: 45.65, floor: 'superior', type: 'room', label: 'Lab. Pneumática' },
  { id: 'S_D10',                x: 71.81, y: 45.86, floor: 'superior', type: 'room', label: 'Lab. Automação' },
  { id: 'S_D11',                x: 77.05, y: 46.50, floor: 'superior', type: 'room', label: 'Lab. Eletrônica Potência' },
  { id: 'S_D12',                x: 78.34, y: 45.86, floor: 'superior', type: 'room', label: 'EMEC' },
  { id: 'S_D13',                x: 83.05, y: 45.86, floor: 'superior', type: 'room', label: 'Lab. Metrologia' },
  { id: 'S_D_Escada',           x: 76.20, y: 48.47, floor: 'superior', type: 'stairs',
    connectsTo: [{ nodeId: 'T_D_Escada', floor: 'terreo' }, { nodeId: 'SUB_D_Escada', floor: 'subsolo' }] },

  // ── Bloco F (Superior) ──
  { id: 'S_F_ENTRY',            x: 70.53, y: 16.97, floor: 'superior', type: 'entrance' },
  { id: 'S_F08',                x: 70.95, y: 13.38, floor: 'superior', type: 'room', label: 'Lab. 03' },
  { id: 'S_F09',                x: 71.60, y: 12.53, floor: 'superior', type: 'room', label: 'Lab. 04' },
  { id: 'S_F10',                x: 71.81, y: 12.96, floor: 'superior', type: 'room', label: 'Lab. 06' },
  { id: 'S_F11',                x: 74.49, y: 13.17, floor: 'superior', type: 'room', label: 'Lab. 05' },
  { id: 'S_F12',                x: 73.10, y: 15.09, floor: 'superior', type: 'room', label: 'Lab. Redes' },
  { id: 'S_F13',                x: 71.81, y: 16.16, floor: 'superior', type: 'room', label: 'Lab. 02' },
  { id: 'S_F14',                x: 70.63, y: 19.37, floor: 'superior', type: 'room', label: 'Lab. 01' },
  { id: 'S_F_Escada',           x: 67.53, y: 23.04, floor: 'superior', type: 'stairs',
    connectsTo: [{ nodeId: 'T_F_Escada', floor: 'terreo' }] },

  // ── Bloco G (Superior) ──
  { id: 'S_G_ENTRY',            x: 56.51, y: 26.38, floor: 'superior', type: 'entrance' },
  { id: 'S_G07',                x: 56.51, y: 22.14, floor: 'superior', type: 'room', label: 'Área de Convívio' },

  // ── Bloco H (Superior) ──
  { id: 'S_H_ENTRY',            x: 28.15, y: 75.52, floor: 'superior', type: 'entrance' },
  { id: 'S_H06',                x: 26.65, y: 74.50, floor: 'superior', type: 'room', label: 'Comunicação' },
  { id: 'S_H07',                x: 26.65, y: 76.63, floor: 'superior', type: 'room', label: 'Motoristas' },

  // ── Banheiros (Superior) ──
  { id: 'S_Banheiro_1', x: 56.40, y: 87.06, floor: 'superior', type: 'bathroom' },
  { id: 'S_Banheiro_2', x: 56.29, y: 38.56, floor: 'superior', type: 'bathroom'  },

  // ── SUBSOLO
  // ── Corredores e Junções (Subsolo) ──
  { id: 'SUB_CORRIDOR',         x: 57.36, y: 63.81, floor: 'subsolo', type: 'corridor' },
  { id: 'SUB_CORRIDOR_F',       x: 60.57, y: 36.46, floor: 'subsolo', type: 'corridor' },
  { id: 'SUB_JUNCTION_D',       x: 57.47, y: 53.13, floor: 'subsolo', type: 'junction' },
  { id: 'SUB_JUNCTION_E',       x: 61.54, y: 58.68, floor: 'subsolo', type: 'junction' },
  { id: 'SUB_JUNCTION_F',       x: 53.30, y: 30.26, floor: 'subsolo', type: 'junction' },

  // ── Bloco D (Subsolo) ──
  { id: 'SUB_JUNCTION_D_Escada',x: 48.80, y: 52.91, floor: 'subsolo', type: 'junction' },
  { id: 'SUB_D14',              x: 45.27, y: 53.13, floor: 'subsolo', type: 'room', label: 'Subestação Elétrica' },
  { id: 'SUB_D15',              x: 47.62, y: 52.91, floor: 'subsolo', type: 'room', label: 'Almoxarifado' },
  { id: 'SUB_D16',              x: 50.62, y: 52.91, floor: 'subsolo', type: 'room', label: 'Manutenção' },
  { id: 'SUB_D17',              x: 52.65, y: 52.70, floor: 'subsolo', type: 'room', label: 'Copa' },
  { id: 'SUB_D18',              x: 55.22, y: 52.70, floor: 'subsolo', type: 'room', label: 'Zelador' },
  { id: 'SUB_D_Escada',         x: 47.62, y: 55.26, floor: 'subsolo', type: 'stairs',
    connectsTo: [{ nodeId: 'T_D_Escada', floor: 'terreo' }, { nodeId: 'S_D_Escada', floor: 'superior' }] },

  // ── Bloco E (Subsolo) ──
  { id: 'SUB_JUNCTION_E_Salas', x: 68.49, y: 67.91, floor: 'subsolo', type: 'junction' },
  { id: 'SUB_E05',              x: 61.22, y: 62.10, floor: 'subsolo', type: 'room', label: 'COAU' },
  { id: 'SUB_E06',              x: 66.03, y: 67.91, floor: 'subsolo', type: 'room', label: 'Sala de Plástica' },
  { id: 'SUB_E07',              x: 68.49, y: 72.61, floor: 'subsolo', type: 'room', label: 'Lab. CAD' },
  { id: 'SUB_E08',              x: 67.21, y: 75.61, floor: 'subsolo', type: 'room', label: 'Ateliê Arq.' },
  { id: 'SUB_E09',              x: 69.67, y: 64.71, floor: 'subsolo', type: 'room', label: 'Canteiro de Obras' },
  { id: 'SUB_E_Escada',         x: 65.71, y: 64.67, floor: 'subsolo', type: 'stairs',
    connectsTo: [{ nodeId: 'T_E_Escada', floor: 'terreo' }] },

  // ── Bloco F (Subsolo) ──
  { id: 'SUB_JUNCTION_F_Salas', x: 46.02, y: 23.68, floor: 'subsolo', type: 'junction' },
  { id: 'SUB_F15',              x: 48.05, y: 28.56, floor: 'subsolo', type: 'room', label: 'Oficina' },
  { id: 'SUB_F16',              x: 43.88, y: 21.25, floor: 'subsolo', type: 'room', label: 'Sala de Máquinas 02' },
  { id: 'SUB_F17',              x: 45.16, y: 18.26, floor: 'subsolo', type: 'room', label: 'Sala de Máquinas 01' },
  { id: 'SUB_F_Escada',         x: 43.02, y: 42.02, floor: 'subsolo', type: 'stairs',
    connectsTo: [{ nodeId: 'T_F_Escada_SUB', floor: 'terreo' }] },

  // ── Outros (Subsolo) ──
  { id: 'SUB_Galpao',           x: 55.65, y: 13.21, floor: 'subsolo', type: 'room', label: 'Galpão' },

];

// ARESTAS DO GRAFO
export const NAV_EDGES: NavEdge[] = [

  // ── ROTAS DO TÉRREO ─────────────────────────────────────────────────────

  // ── Corredor Backbone (Espinha Dorsal Central e Oeste) ──
  { from: 'T_JUNCTION_A_W',       to: 'T_CORRIDOR_Oeste_1' },
  { from: 'T_CORRIDOR_Oeste_1',   to: 'T_JUNCTION_H' },
  { from: 'T_JUNCTION_H',         to: 'T_CORRIDOR_Oeste_2' },
  { from: 'T_CORRIDOR_Oeste_2',   to: 'T_JUNCTION_C_W' },

  { from: 'T_JUNCTION_A_L',       to: 'T_CORRIDOR_Central_1' },
  { from: 'T_CORRIDOR_Central_1', to: 'T_Banheiro_1' }, 
  { from: 'T_Banheiro_1',         to: 'T_JUNCTION_B_W' },
  { from: 'T_JUNCTION_B_W',       to: 'T_CORRIDOR_Central_2' },
  { from: 'T_CORRIDOR_Central_2', to: 'T_JUNCTION_C_E' },
  { from: 'T_JUNCTION_C_E',       to: 'T_CORRIDOR_Central_3' },
  { from: 'T_CORRIDOR_Central_3', to: 'T_JUNCTION_Rampa' },
  { from: 'T_JUNCTION_Rampa',     to: 'T_CORRIDOR_Central_4' },
  { from: 'T_CORRIDOR_Central_4', to: 'T_JUNCTION_D_W' },
  { from: 'T_JUNCTION_D_W',       to: 'T_CORRIDOR_Central_5' },
  { from: 'T_CORRIDOR_Central_5', to: 'T_Banheiro_2' }, 
  { from: 'T_Banheiro_2',         to: 'T_JUNCTION_FG' },
  { from: 'T_JUNCTION_FG',        to: 'T_CORRIDOR_Central_6' },
  { from: 'T_JUNCTION_FG',        to: 'T_JUNCTION_F' },

  // ── Corredor Backbone (Leste) ──
  { from: 'T_JUNCTION_B_L',       to: 'T_CORRIDOR_Leste_1' },
  { from: 'T_CORRIDOR_Leste_1',   to: 'T_CORRIDOR_Leste_2' },
  { from: 'T_CORRIDOR_Leste_2',   to: 'T_JUNCTION_E' },
  { from: 'T_JUNCTION_E',         to: 'T_CORRIDOR_Leste_3' },
  { from: 'T_CORRIDOR_Leste_3',   to: 'T_JUNCTION_D_E' },

  // ── Conexões Transversais (Oeste -> Leste) ──
  { from: 'T_JUNCTION_A_W',       to: 'T_A_ENTRY' },
  { from: 'T_A_ENTRY',            to: 'T_CORRIDOR_A' },
  { from: 'T_CORRIDOR_A',         to: 'T_JUNCTION_A_L' },
  
  { from: 'T_JUNCTION_B_W',       to: 'T_B_ENTRY' },
  { from: 'T_B_ENTRY',            to: 'T_JUNCTION_B_L' },
  
  { from: 'T_JUNCTION_C_W',       to: 'T_C_ENTRY' },
  { from: 'T_C_ENTRY',            to: 'T_JUNCTION_C_E' },
  
  { from: 'T_JUNCTION_D_W',       to: 'T_D_ENTRY' },
  { from: 'T_D_ENTRY',            to: 'T_JUNCTION_D_E' },

  // ── Bloco A (Térreo) ──
  { from: 'T_A_ENTRY',            to: 'T_JUNCTION_A_Escada' },
  { from: 'T_JUNCTION_A_Escada',  to: 'T_A_Escada' },
  { from: 'T_JUNCTION_A_Escada',  to: 'T_A04' },
  { from: 'T_A_ENTRY',            to: 'T_A05' },
  { from: 'T_A04',                to: 'T_A03' },
  { from: 'T_A03',                to: 'T_A02' },
  { from: 'T_A02',                to: 'T_A01' },
  { from: 'T_A05',                to: 'T_CORRIDOR_A' },
  { from: 'T_JUNCTION_A_W',       to: 'T_A01' },

  // ── Bloco B (Térreo) ──
  { from: 'T_B_ENTRY',            to: 'T_B01' },
  { from: 'T_B01',                to: 'T_B02' },
  { from: 'T_B02',                to: 'T_B03' },
  { from: 'T_B03',                to: 'T_B04' },
  { from: 'T_B04',                to: 'T_JUNCTION_B_Escada' },
  { from: 'T_JUNCTION_B_Escada',  to: 'T_B_Escada' },
  { from: 'T_JUNCTION_B_Escada',  to: 'T_B05' },
  { from: 'T_B05',                to: 'T_B06' },
  { from: 'T_B06',                to: 'T_JUNCTION_B_L' },

  // ── Bloco C (Térreo) ──
  { from: 'T_C_ENTRY',            to: 'T_C08' },
  { from: 'T_C08',                to: 'T_C07' },
  { from: 'T_C07',                to: 'T_C06' },
  { from: 'T_C06',                to: 'T_C05' },
  { from: 'T_C05',                to: 'T_C04' },
  { from: 'T_C04',                to: 'T_C03' },
  { from: 'T_C03',                to: 'T_JUNCTION_C_Escada' },
  { from: 'T_JUNCTION_C_Escada',  to: 'T_C_Escada' },
  { from: 'T_JUNCTION_C_Escada',  to: 'T_C02' },
  { from: 'T_C02',                to: 'T_C01' },
  { from: 'T_JUNCTION_Rampa',     to: 'T_Rampa', accessible: true },
  { from: 'T_JUNCTION_Rampa',     to: 'T_C09' },
  { from: 'T_JUNCTION_Rampa',     to: 'T_C10' },
  { from: 'T_JUNCTION_C_E',       to: 'T_C11' },
  { from: 'T_JUNCTION_C_W',       to: 'T_C01' },

  // ── Bloco D (Térreo) ──
  { from: 'T_JUNCTION_D_W',       to: 'T_D01' },
  { from: 'T_D_ENTRY',            to: 'T_D02' },
  { from: 'T_D02',                to: 'T_D03' },
  { from: 'T_D03',                to: 'T_D04' },
  { from: 'T_D04',                to: 'T_JUNCTION_D_Escada' },
  { from: 'T_JUNCTION_D_Escada',  to: 'T_D_Escada' },
  { from: 'T_JUNCTION_D_Escada',  to: 'T_D05' },
  { from: 'T_D05',                to: 'T_D06' },
  { from: 'T_D06',                to: 'T_JUNCTION_D_E' },

  // ── Bloco E (Térreo) ──
  { from: 'T_E_ENTRY',            to: 'T_JUNCTION_E_Salas' },
  { from: 'T_JUNCTION_E_Salas',   to: 'T_E_Escada' },
  { from: 'T_JUNCTION_E_Salas',   to: 'T_E02' },
  { from: 'T_JUNCTION_E_Salas',   to: 'T_E03' },
  { from: 'T_E03',                to: 'T_E04' },
  { from: 'T_CORRIDOR_Leste_2',   to: 'T_E01' },
  { from: 'T_E01',                to: 'T_Banheiro_E' },

  // ── Bloco F & G (Térreo) ──
  { from: 'T_JUNCTION_F',         to: 'T_G04' },
  { from: 'T_JUNCTION_F',         to: 'T_F_ENTRY' },
  { from: 'T_F_ENTRY',            to: 'T_JUNCTION_GF' },
  { from: 'T_F_ENTRY',            to: 'T_JUNCTION_F_Salas' },
  { from: 'T_JUNCTION_F_Salas',   to: 'T_F_Escada' },
  { from: 'T_JUNCTION_F_Salas',   to: 'T_Banheiro_F' },
  { from: 'T_JUNCTION_F_Salas',   to: 'T_F01' },
  { from: 'T_JUNCTION_F_Salas',   to: 'T_F02' },
  { from: 'T_JUNCTION_F_Salas',   to: 'T_F03' },
  { from: 'T_JUNCTION_F_Salas',   to: 'T_F04' },
  { from: 'T_JUNCTION_F_Salas',   to: 'T_F05' },
  { from: 'T_JUNCTION_F_Salas',   to: 'T_F06' },
  { from: 'T_JUNCTION_F_Salas',   to: 'T_F07' },
  { from: 'T_JUNCTION_F',         to: 'T_F_Escada_SUB' }, 

  
  { from: 'T_CORRIDOR_Central_6', to: 'T_G01' },
  { from: 'T_G01',                to: 'T_G03' },
  { from: 'T_G03',                to: 'T_G_ENTRY' },
  { from: 'T_G_ENTRY',            to: 'T_JUNCTION_G' },
  { from: 'T_JUNCTION_G',         to: 'T_G02' },
  { from: 'T_JUNCTION_G',         to: 'T_G05' },
  { from: 'T_JUNCTION_G',         to: 'T_G06' },
  { from: 'T_G06',                to: 'T_Ginasio' },
  { from: 'T_G05',                to: 'T_CORRIDOR_FG' },
  { from: 'T_CORRIDOR_FG',        to: 'T_JUNCTION_GF' },
  { from: 'T_JUNCTION_GF',        to: 'T_Galpao' },

  // ── Bloco H e Containers (Térreo) ──
  { from: 'T_JUNCTION_H',         to: 'T_H_ENTRY' },
  { from: 'T_JUNCTION_H',         to: 'T_Banheiro_H' },
  { from: 'T_H_ENTRY',            to: 'T_H01' },
  { from: 'T_JUNCTION_A_W',       to: 'T_H02' },
  { from: 'T_JUNCTION_A_W',       to: 'T_Entrada_W' },
  { from: 'T_Entrada_W',          to: 'T_JUNCTION_Containers' },
  { from: 'T_JUNCTION_A_W',       to: 'T_H03' },
  { from: 'T_JUNCTION_Containers',to: 'T_H04' },
  { from: 'T_JUNCTION_Containers',to: 'T_H05' },

  // ── ROTAS DO ANDAR SUPERIOR ─────────────────────────────────────────────
  // ── Corredor Backbone Superior ──
  { from: 'S_JUNCTION_A_W',       to: 'S_CORRIDOR_Oeste_1' },
  { from: 'S_CORRIDOR_Oeste_1',   to: 'S_H_ENTRY' },
  { from: 'S_H_ENTRY',            to: 'S_CORRIDOR_Oeste_2' },
  { from: 'S_CORRIDOR_Oeste_2',   to: 'S_JUNCTION_C_W' },

  { from: 'S_JUNCTION_A_L',       to: 'S_CORRIDOR_Central_1' },
  { from: 'S_CORRIDOR_Central_1', to: 'S_Banheiro_1' }, 
  { from: 'S_Banheiro_1',         to: 'S_JUNCTION_B_W' },
  { from: 'S_JUNCTION_B_W',       to: 'S_CORRIDOR_Central_2' },
  { from: 'S_CORRIDOR_Central_2', to: 'S_JUNCTION_C_E' },
  { from: 'S_JUNCTION_C_E',       to: 'S_CORRIDOR_Central_3' },
  { from: 'S_CORRIDOR_Central_3', to: 'S_JUNCTION_D_W' },
  { from: 'S_JUNCTION_D_W',       to: 'S_Banheiro_2' }, 
  { from: 'S_Banheiro_2',         to: 'S_CORRIDOR_Central_4' },
  { from: 'S_CORRIDOR_Central_4', to: 'S_G_ENTRY' },

  { from: 'S_JUNCTION_B_L',       to: 'S_CORRIDOR_Leste_1' },
  { from: 'S_CORRIDOR_Leste_1',   to: 'S_JUNCTION_D_E' },

  // ── Conexões Transversais Superiores ──
  { from: 'S_JUNCTION_A_W',       to: 'S_A_ENTRY' },
  { from: 'S_A_ENTRY',            to: 'S_JUNCTION_A_L' },
  { from: 'S_JUNCTION_B_W',       to: 'S_B_ENTRY' },
  { from: 'S_B_ENTRY',            to: 'S_JUNCTION_B_L' },
  { from: 'S_JUNCTION_C_W',       to: 'S_C_ENTRY' },
  { from: 'S_C_ENTRY',            to: 'S_JUNCTION_C_E' },
  { from: 'S_JUNCTION_D_W',       to: 'S_D_ENTRY' },
  { from: 'S_D_ENTRY',            to: 'S_JUNCTION_D_E' },

  // ── Bloco A (Superior) ──
  { from: 'S_JUNCTION_A_L',       to: 'S_A_ENTRY' },
  { from: 'S_A_ENTRY',            to: 'S_JUNCTION_A_Escada' },
  { from: 'S_JUNCTION_A_Escada',  to: 'S_A_Escada' },
  { from: 'S_JUNCTION_A_Escada',  to: 'S_A08' },
  { from: 'S_A08',                to: 'S_A07' },
  { from: 'S_A07',                to: 'S_A06' },
  { from: 'S_JUNCTION_A_Escada',  to: 'S_A09' },
  { from: 'S_A09',                to: 'S_A10' },
  { from: 'S_A10',                to: 'S_A11' },
  { from: 'S_A11',                to: 'S_A12' },
  { from: 'S_A12',                to: 'S_A_ENTRY' },

  // ── Bloco B (Superior) ──
  { from: 'S_JUNCTION_B_W',       to: 'S_B_ENTRY' },
  { from: 'S_B_ENTRY',            to: 'S_B07' },
  { from: 'S_B07',                to: 'S_B08' },
  { from: 'S_B08',                to: 'S_B09' },
  { from: 'S_B09',                to: 'S_B10' },
  { from: 'S_B10',                to: 'S_B11' },
  { from: 'S_B11',                to: 'S_JUNCTION_B_Escada' },
  { from: 'S_JUNCTION_B_Escada',  to: 'S_B_Escada' },
  { from: 'S_JUNCTION_B_Escada',  to: 'S_B12' },
  { from: 'S_B12',                to: 'S_B13' },
  { from: 'S_B13',                to: 'S_B14' },
  { from: 'S_B14',                to: 'S_JUNCTION_B_L' },

  // ── Bloco C (Superior) ──
  { from: 'S_JUNCTION_C_L',       to: 'S_C_ENTRY' },
  { from: 'S_C_ENTRY',            to: 'S_C17' },
  { from: 'S_C17',                to: 'S_C16' },
  { from: 'S_C16',                to: 'S_C15' },
  { from: 'S_C15',                to: 'S_C14' },
  { from: 'S_C14',                to: 'S_C13' },
  { from: 'S_C13',                to: 'S_C12' },
  { from: 'S_C12',                to: 'S_JUNCTION_C_Escada' },
  { from: 'S_JUNCTION_C_Escada',  to: 'S_C_Escada' },
  { from: 'S_JUNCTION_C_Escada',  to: 'S_C11' },
  { from: 'S_C11',                to: 'S_C10' },
  { from: 'S_JUNCTION_C_E',       to: 'S_Rampa', accessible: true },

  // ── Bloco D (Superior) ──
  { from: 'S_JUNCTION_D_W',       to: 'S_D_ENTRY' },
  { from: 'S_D_ENTRY',            to: 'S_D07' },
  { from: 'S_D07',                to: 'S_D08' },
  { from: 'S_D08',                to: 'S_D09' },
  { from: 'S_D09',                to: 'S_D10' },
  { from: 'S_D10',                to: 'S_JUNCTION_D_Escada' },
  { from: 'S_JUNCTION_D_Escada',  to: 'S_D_Escada' },
  { from: 'S_JUNCTION_D_Escada',  to: 'S_D11' },
  { from: 'S_D11',                to: 'S_D12' },
  { from: 'S_D12',                to: 'S_D13' },
  { from: 'S_D13',                to: 'S_JUNCTION_D_E' },

  // ── Bloco F & G (Superior) ──
  { from: 'S_G_ENTRY',            to: 'S_G07' },
  
  { from: 'S_JUNCTION_F',         to: 'S_F_Escada' },
  { from: 'S_JUNCTION_F',         to: 'S_F_ENTRY' },
  { from: 'S_F_ENTRY',            to: 'S_F14' },
  { from: 'S_F_ENTRY',            to: 'S_F13' },
  { from: 'S_F_ENTRY',            to: 'S_F12' },
  { from: 'S_F12',                to: 'S_F11' },
  { from: 'S_F_ENTRY',            to: 'S_F10' },
  { from: 'S_F_ENTRY',            to: 'S_F09' },
  { from: 'S_F_ENTRY',            to: 'S_F08' },

  // ── Bloco H (Superior) ──
  { from: 'S_H_ENTRY',            to: 'S_H06' },
  { from: 'S_H_ENTRY',            to: 'S_H07' },

  // ── ROTAS DO SUBSOLO
  // ── Bloco D (Subsolo) ──
  { from: 'SUB_JUNCTION_D_Escada',to: 'SUB_D_Escada' },
  { from: 'SUB_JUNCTION_D_Escada',to: 'SUB_D15' },
  { from: 'SUB_D15',              to: 'SUB_D14' },
  { from: 'SUB_JUNCTION_D_Escada',to: 'SUB_D16' },
  { from: 'SUB_D16',              to: 'SUB_D17' },
  { from: 'SUB_D17',              to: 'SUB_D18' },
  { from: 'SUB_D18',              to: 'SUB_JUNCTION_D' },

  // ── Bloco E (Subsolo) ──
  { from: 'SUB_JUNCTION_D',       to: 'SUB_CORRIDOR' },
  { from: 'SUB_CORRIDOR',         to: 'SUB_JUNCTION_E' },
  { from: 'SUB_JUNCTION_E',       to: 'SUB_E05' },
  { from: 'SUB_JUNCTION_E',       to: 'SUB_E06' },
  { from: 'SUB_JUNCTION_E',       to: 'SUB_E_Escada' },
  { from: 'SUB_E06',              to: 'SUB_JUNCTION_E_Salas' },
  { from: 'SUB_E06',              to: 'SUB_E07' },
  { from: 'SUB_E07',              to: 'SUB_E08' },
  { from: 'SUB_JUNCTION_E_Salas', to: 'SUB_E09' },

  // ── Bloco F (Subsolo) ──
  { from: 'SUB_JUNCTION_E',       to: 'SUB_CORRIDOR_F' },
  { from: 'SUB_CORRIDOR_F',       to: 'SUB_JUNCTION_F' },
  { from: 'SUB_JUNCTION_F',       to: 'SUB_Galpao' },
  { from: 'SUB_JUNCTION_F',       to: 'SUB_F15' },
  { from: 'SUB_F15',              to: 'SUB_JUNCTION_F_Salas' },
  { from: 'SUB_JUNCTION_F',       to: 'SUB_F_Escada' },
  { from: 'SUB_JUNCTION_F_Salas', to: 'SUB_F16' },
  { from: 'SUB_JUNCTION_F_Salas', to: 'SUB_F17' },

  // ── TRANSIÇÕES DE ANDARES (Pesos maiores adicionados) ───────────────────
  { from: 'T_A_Escada',     to: 'S_A_Escada',   weight: 15 },
  { from: 'T_B_Escada',     to: 'S_B_Escada',   weight: 15 },
  { from: 'T_C_Escada',     to: 'S_C_Escada',   weight: 15 },
  { from: 'T_Rampa',        to: 'S_Rampa',      weight: 18, accessible: true }, // Rampa com acessibilidade
  
  // Escada Bloco D (Liga os 3 andares)
  { from: 'T_D_Escada',     to: 'S_D_Escada',   weight: 15 },
  { from: 'T_D_Escada',     to: 'SUB_D_Escada', weight: 15 },
  { from: 'S_D_Escada',     to: 'SUB_D_Escada', weight: 30 }, // Pular 2 andares direto (caso necessário)
  
  { from: 'T_E_Escada',     to: 'SUB_E_Escada', weight: 15 }, 
  { from: 'T_F_Escada',     to: 'S_F_Escada',   weight: 15 },
  { from: 'T_F_Escada_SUB', to: 'SUB_F_Escada', weight: 15 }

];

/** Mapa nodeId → NavNode */
export const NODE_MAP = new Map<string, NavNode>(
  NAV_NODES.map((n) => [n.id, n])
);

/** Constrói a lista de adjacência para roteamento */
export function buildAdjacency(accessibleOnly: boolean): Map<string, { id: string; weight: number; accessible: boolean }[]> {
  const adj = new Map<string, { id: string; weight: number; accessible: boolean }[]>();

  const addEdge = (a: string, b: string, w: number, accessible: boolean) => {
    if (accessibleOnly) {
      const nodeA = NODE_MAP.get(a);
      const nodeB = NODE_MAP.get(b);
      // Se a aresta envolve uma escada, não a inclui no grafo de acessibilidade
      if (nodeA?.type === 'stairs' || nodeB?.type === 'stairs') return;
    }
    if (!adj.has(a)) adj.set(a, []);
    if (!adj.has(b)) adj.set(b, []);
    adj.get(a)!.push({ id: b, weight: w, accessible });
    adj.get(b)!.push({ id: a, weight: w, accessible });
  };

  for (const edge of NAV_EDGES) {
    const nodeA = NODE_MAP.get(edge.from);
    const nodeB = NODE_MAP.get(edge.to);
    if (!nodeA || !nodeB) continue;

    const dx = nodeA.x - nodeB.x;
    const dy = nodeA.y - nodeB.y;
    const dist = edge.weight ?? Math.sqrt(dx * dx + dy * dy);
    addEdge(edge.from, edge.to, dist, edge.accessible ?? false);
  }

  return adj;
}

// ALGORITMO DE ROTEAMENTO: A* para encontrar o caminho mais curto

function heuristic(a: NavNode, b: NavNode): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export interface PathResult {
  path: NavNode[];
  totalDistance: number;
  floorChanges: { floor: FloorLevel; nodeId: string; type: 'stairs' | 'ramp' }[];
}

export function findPath(
  fromId: string,
  toId: string,
  accessibleOnly: boolean = false
): PathResult | null {
  const startNode = NODE_MAP.get(fromId);
  const endNode   = NODE_MAP.get(toId);
  if (!startNode || !endNode) return null;

  const adj = buildAdjacency(accessibleOnly);

  // A* Algoritimo
  const openSet = new Set<string>([fromId]);
  const cameFrom = new Map<string, string>();
  const gScore   = new Map<string, number>([[fromId, 0]]);
  const fScore   = new Map<string, number>([[fromId, heuristic(startNode, endNode)]]);

  while (openSet.size > 0) {
    // Seleciona o nó com o menor fScore
    let current = '';
    let lowestF = Infinity;
    for (const id of openSet) {
      const f = fScore.get(id) ?? Infinity;
      if (f < lowestF) { lowestF = f; current = id; }
    }

    if (current === toId) {
      // Reconstrói o caminho
      const path: NavNode[] = [];
      let cur = toId;
      while (cur) {
        const node = NODE_MAP.get(cur);
        if (node) path.unshift(node);
        cur = cameFrom.get(cur) ?? '';
      }

      const floorChanges: PathResult['floorChanges'] = [];
      for (const node of path) {
        if (node.type === 'stairs' || node.type === 'ramp') {
          floorChanges.push({ floor: node.floor, nodeId: node.id, type: node.type });
        }
      }

      return {
        path,
        totalDistance: gScore.get(toId) ?? 0,
        floorChanges,
      };
    }

    openSet.delete(current);
    const neighbors = adj.get(current) ?? [];

    for (const neighbor of neighbors) {
      const tentativeG = (gScore.get(current) ?? Infinity) + neighbor.weight;
      if (tentativeG < (gScore.get(neighbor.id) ?? Infinity)) {
        cameFrom.set(neighbor.id, current);
        gScore.set(neighbor.id, tentativeG);
        const neighborNode = NODE_MAP.get(neighbor.id);
        fScore.set(
          neighbor.id,
          tentativeG + (neighborNode ? heuristic(neighborNode, endNode) : 0)
        );
        openSet.add(neighbor.id);
      }
    }
  }

  return null; // Nenhum caminho encontrado
}

// HELPERS: listas de salas por andar para o select

export interface RoomOption {
  id: string;
  label: string;
  floor: FloorLevel;
  blockId: string;
}

export const ROOM_OPTIONS: RoomOption[] = NAV_NODES
  .filter((n) => n.type === 'room' && n.label)
  .map((n) => ({
    id: n.id,
    label: n.label!,
    floor: n.floor,
    blockId: n.id.split('_')[1],
  }))
  .sort((a, b) => a.label.localeCompare(b.label, 'pt-BR'));