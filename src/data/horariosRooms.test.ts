import { NODE_MAP } from './navigationGraph';
import { blocos } from './blocos';
import { MAPPED_NODE_IDS, MAPPED_ROOM_NAMES, getRoomPlace, routeHref, scheduleNamesForRoom } from './horariosRooms';

// As 63 salas do PDF 2026.2 (saída de `npm run inspect` da API).
const PDF_ROOMS = [
  'Ateliê de desenho 01', 'Ateliê de desenho 02', 'Ateliê de desenho 03', 'SALA 01-BL02-S', 'SALA 02-BL02-S', 'SALA 03-BL02-S',
  'SALA 04-BL02-S', 'SALA 05-BL02-S', 'SALA 06-BL02-S', 'SALA 07-BL02-S', 'SALA 08-BL03-S', 'SALA 09-BL03-S', 'SALA 10-BL03-S',
  'SALA 11-COINF-I', 'SALA DA EAD', 'LAB INFORMÁTICA COAU 01', 'LAB INFORMÁTICA COAU 2', 'LAB. DESENHO TÉCNICO NA PLATAFORMA CAD BL02-S',
  'SALA DE DESENHOS E PROJETOS 01-BL02-I', 'SALA DE DESENHOS E PROJETOS 02-BL02-I', 'SALA DE DESENHOS E PROJETOS 03-BL02-I (ELETROMECÂNICA)',
  'LAB. INFORMÁTICA EMEC-BL03-I', 'LAB. REDES DE COMPUTADORES-COINF-S', 'LAB. ROBÓTICA COINF', 'LAB. PESQUISA-COINF-S',
  'LAB. INFORMÁTICA 02-COINF-S', 'LAB. INFORMÁTICA 03-COINF-S', 'LAB. INFORMÁTICA 04-COINF-S', 'LAB. INFORMÁTICA 05-COINF-S',
  'LAB. INFORMÁTICA 06-COINF-S', 'LAB. INFORMÁTICA 01-COINF-I', 'OFICINA SL-01', 'OFICINA- SL 02', 'Sala de plástica',
  'LAB. ELETRÔNICA DIGITAL-COINF', 'LAB. DE ELETRICIDADE-BL03-I', 'LAB. ENSAIOS MECÂNICOS-BL03-I', 'LAB. REFRIGERAÇÃO-BL03-I',
  'LAB. MÁQUINAS E ACIONAMENTOS ELÉTRICOS-BL03-I', 'LAB. TOPOGRAFIA-BL03-I', 'LAB. TEORIA DE CONTROLE E SIMULAÇÃO-BL03-S',
  'LAB. FÍSICA MODERNA-BL03-S', 'LAB. DE INSTALAÇÕES ELÉTRICAS PREDIAIS-BL04-I', 'LAB. INSTALAÇÕES HIDRÁULICAS E SANITÁRIAS-BL04-I',
  'LAB. MATERIAIS DE CONSTRUÇÃO-BL04-I', 'LAB. AUTOMAÇÃO', 'LAB. INSTRUMENTAÇÃO', 'LAB. METROLOGIA-BL04-S', 'LAB. PNEUMÁTICA-BL04-S',
  'LAB. ELETRÔNICA DE POTÊNCIA-BL04-S', 'LAB. MECÂNICA DOS SOLOS-BL04-I', 'COORDENAÇÃO CLF', 'LAB. FÍSICA BÁSICA', 'LAB. BIOLOGIA-BL02-I',
  'LAB. QUÍMICA-BL02-I', 'LAB. ENSINO DE FÍSICA', 'LAB. ESTUDOS APLICADOS EM ENGENHARIA ELÉTRICA', 'GINÁSIO', 'LABIC', 'LAB PESQUISA-LABIC',
  'IF MAKER', 'Biblioteca', 'OFICINA',
];

describe('mapeamento sala da grade -> mapa', () => {
  it('todo nome mapeado existe no PDF (sem erro de digitação)', () => {
    expect(PDF_ROOMS).toHaveLength(63);
    expect(MAPPED_ROOM_NAMES.filter((n) => !PDF_ROOMS.includes(n))).toEqual([]);
  });

  it('todo ponto de navegação mapeado existe no grafo', () => {
    expect(MAPPED_NODE_IDS.filter((id) => !NODE_MAP.has(id))).toEqual([]);
  });

  it('todo bloco mapeado existe em blocos.ts', () => {
    for (const n of MAPPED_ROOM_NAMES) expect(blocos.some((b) => b.id === getRoomPlace(n)!.blocoId)).toBe(true);
  });

  it('nenhum ponto de navegação é usado por duas salas', () => {
    expect(new Set(MAPPED_NODE_IDS).size).toBe(MAPPED_NODE_IDS.length);
  });

  it('descreve a sala com bloco, nome no MERO e andar', () => {
    expect(getRoomPlace('SALA 01-BL02-S')).toMatchObject({ blocoId: 'B', blocoName: 'Bloco B', nodeId: 'S_B07', label: 'Sala de Aula 1', floorLabel: 'Andar superior' });
    expect(getRoomPlace('sala 01 bl02 s')?.nodeId).toBe('S_B07'); // ignora caixa e pontuação
    expect(getRoomPlace('Ateliê de desenho 02')).toMatchObject({ blocoId: 'E', nodeId: undefined });
  });

  it('salas sem correspondência clara não têm lugar', () => {
    expect(getRoomPlace('IF MAKER')).toBeNull();
    expect(getRoomPlace('LAB. FÍSICA BÁSICA')).toBeNull();
  });

  it('cobertura: a maioria das salas já tem lugar', () => {
    expect(PDF_ROOMS.filter((n) => getRoomPlace(n)).length).toBeGreaterThanOrEqual(50);
  });

  it('link de rota', () => {
    expect(routeHref('S_B07')).toBe('/?destino=S_B07');
  });

  it('busca reversa: sala do MERO -> sala da grade, respeitando o andar', () => {
    expect(scheduleNamesForRoom('B', 'Andar Superior', 'B07')).toEqual(['SALA 01-BL02-S']);
    expect(scheduleNamesForRoom('B', 'Andar Inferior', 'B01')).toEqual(['LAB. QUÍMICA-BL02-I']);
    // C11 existe nos dois andares: só o superior (Física Moderna) está na grade
    expect(scheduleNamesForRoom('C', 'Andar Superior', 'C11')).toEqual(['LAB. FÍSICA MODERNA-BL03-S']);
    expect(scheduleNamesForRoom('C', 'Andar Inferior', 'C11')).toEqual([]);
    expect(scheduleNamesForRoom('E', 'Andar Inferior (Subsolo)', 'E06')).toEqual(['Sala de plástica']);
    expect(scheduleNamesForRoom('B', 'Andar Superior', 'Z99')).toEqual([]);
  });
});
