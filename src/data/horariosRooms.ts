import { blocos } from './blocos';
import { NODE_MAP, type FloorLevel } from './navigationGraph';
import { normalizeSearchText } from '@/lib/roomSearch';

/**
 * Liga as salas do PDF de horários (nomes da API) aos lugares do MERO.
 *
 * Como foi feito: o PDF indica o bloco no nome (BL02 = Bloco B, BL03 = C, BL04 = D, COINF = F) e o andar
 * (S = superior, I = inferior); o resto foi casado pelo nome com `blocos.ts`. Salas sem correspondência
 * clara ficam FORA da lista de propósito (sem link para o mapa) em vez de apontar para o lugar errado.
 * `nodeId` = ponto do grafo de navegação; sem `nodeId`, só o bloco é conhecido.
 *
 * Confira os marcados com "?" — são os casos menos óbvios.
 */
type Entry = { blocoId: string; nodeId?: string };

const RAW: Record<string, Entry> = {
  // Bloco A
  'Biblioteca': { blocoId: 'A', nodeId: 'T_A05' },
  // Bloco B (BL02)
  'SALA 01-BL02-S': { blocoId: 'B', nodeId: 'S_B07' },
  'SALA 02-BL02-S': { blocoId: 'B', nodeId: 'S_B08' },
  'SALA 03-BL02-S': { blocoId: 'B', nodeId: 'S_B09' },
  'SALA 04-BL02-S': { blocoId: 'B', nodeId: 'S_B10' },
  'SALA 05-BL02-S': { blocoId: 'B', nodeId: 'S_B11' },
  'SALA 06-BL02-S': { blocoId: 'B', nodeId: 'S_B12' },
  'SALA 07-BL02-S': { blocoId: 'B', nodeId: 'S_B13' },
  'LAB. DESENHO TÉCNICO NA PLATAFORMA CAD BL02-S': { blocoId: 'B', nodeId: 'S_B14' },
  'SALA DE DESENHOS E PROJETOS 01-BL02-I': { blocoId: 'B', nodeId: 'T_B06' },
  'SALA DE DESENHOS E PROJETOS 02-BL02-I': { blocoId: 'B', nodeId: 'T_B05' },
  'SALA DE DESENHOS E PROJETOS 03-BL02-I (ELETROMECÂNICA)': { blocoId: 'B', nodeId: 'T_B04' },
  'LAB. BIOLOGIA-BL02-I': { blocoId: 'B', nodeId: 'T_B03' },
  'LAB. QUÍMICA-BL02-I': { blocoId: 'B', nodeId: 'T_B01' },
  // Bloco C (BL03)
  'SALA 08-BL03-S': { blocoId: 'C', nodeId: 'S_C16' },
  'SALA 09-BL03-S': { blocoId: 'C', nodeId: 'S_C15' },
  'SALA 10-BL03-S': { blocoId: 'C', nodeId: 'S_C14' },
  'SALA DA EAD': { blocoId: 'C', nodeId: 'S_C12' },
  'LAB. INFORMÁTICA EMEC-BL03-I': { blocoId: 'C', nodeId: 'T_C01' }, // ? único lab de informática do térreo do Bloco C
  'LAB. REFRIGERAÇÃO-BL03-I': { blocoId: 'C', nodeId: 'T_C02' },
  'LAB. MÁQUINAS E ACIONAMENTOS ELÉTRICOS-BL03-I': { blocoId: 'C', nodeId: 'T_C03' },
  'LABIC': { blocoId: 'C', nodeId: 'T_C04' },
  'LAB. ENSAIOS MECÂNICOS-BL03-I': { blocoId: 'C', nodeId: 'T_C05' },
  'LAB. DE ELETRICIDADE-BL03-I': { blocoId: 'C', nodeId: 'T_C07' },
  'LAB. TOPOGRAFIA-BL03-I': { blocoId: 'C', nodeId: 'T_C08' },
  'LAB. FÍSICA MODERNA-BL03-S': { blocoId: 'C', nodeId: 'S_C11' },
  'LAB. TEORIA DE CONTROLE E SIMULAÇÃO-BL03-S': { blocoId: 'C', nodeId: 'S_C17' },
  // Bloco D (BL04)
  'LAB. DE INSTALAÇÕES ELÉTRICAS PREDIAIS-BL04-I': { blocoId: 'D', nodeId: 'T_D02' },
  'LAB. INSTALAÇÕES HIDRÁULICAS E SANITÁRIAS-BL04-I': { blocoId: 'D', nodeId: 'T_D03' },
  'LAB. MECÂNICA DOS SOLOS-BL04-I': { blocoId: 'D', nodeId: 'T_D04' },
  'LAB. MATERIAIS DE CONSTRUÇÃO-BL04-I': { blocoId: 'D', nodeId: 'T_D06' },
  'LAB. PNEUMÁTICA-BL04-S': { blocoId: 'D', nodeId: 'S_D09' },
  'LAB. AUTOMAÇÃO': { blocoId: 'D', nodeId: 'S_D10' }, // ? "Automação Industrial e Instrumentação"
  'LAB. ELETRÔNICA DE POTÊNCIA-BL04-S': { blocoId: 'D', nodeId: 'S_D11' },
  'LAB. METROLOGIA-BL04-S': { blocoId: 'D', nodeId: 'S_D13' },
  // Bloco E (só o bloco: os 3 ateliês e os labs COAU não dá para distinguir pelo nome)
  'Ateliê de desenho 01': { blocoId: 'E' },
  'Ateliê de desenho 02': { blocoId: 'E' },
  'Ateliê de desenho 03': { blocoId: 'E' },
  'LAB INFORMÁTICA COAU 01': { blocoId: 'E' }, // ?
  'LAB INFORMÁTICA COAU 2': { blocoId: 'E' }, // ?
  'Sala de plástica': { blocoId: 'E', nodeId: 'SUB_E06' },
  // Bloco F (COINF)
  'SALA 11-COINF-I': { blocoId: 'F', nodeId: 'T_F03' },
  'LAB. ROBÓTICA COINF': { blocoId: 'F', nodeId: 'T_F04' },
  'LAB. ELETRÔNICA DIGITAL-COINF': { blocoId: 'F', nodeId: 'T_F06' }, // ? "Laboratório de Eletrônica"
  'LAB. INFORMÁTICA 03-COINF-S': { blocoId: 'F', nodeId: 'S_F08' },
  'LAB. INFORMÁTICA 04-COINF-S': { blocoId: 'F', nodeId: 'S_F09' },
  'LAB. INFORMÁTICA 06-COINF-S': { blocoId: 'F', nodeId: 'S_F10' },
  'LAB. INFORMÁTICA 05-COINF-S': { blocoId: 'F', nodeId: 'S_F11' },
  'LAB. REDES DE COMPUTADORES-COINF-S': { blocoId: 'F', nodeId: 'S_F12' },
  'LAB. INFORMÁTICA 02-COINF-S': { blocoId: 'F', nodeId: 'S_F13' },
  'LAB. INFORMÁTICA 01-COINF-I': { blocoId: 'F', nodeId: 'S_F14' }, // ? PDF diz "I" (inferior); o MERO coloca o Laboratório 01 no andar superior
  // Bloco G
  'COORDENAÇÃO CLF': { blocoId: 'G', nodeId: 'T_G01' },
  // Ginásio
  'GINÁSIO': { blocoId: 'G', nodeId: 'T_Ginasio' },
};

const FLOOR_LABEL: Record<FloorLevel, string> = { terreo: 'Térreo', superior: 'Andar superior', subsolo: 'Subsolo' };

const BY_KEY = new Map(Object.entries(RAW).map(([name, e]) => [normalizeSearchText(name), { name, ...e }]));

export interface RoomPlace {
  blocoId: string;
  blocoName: string;
  blocoColor?: string;
  /** Ponto do grafo de navegação (permite traçar rota). */
  nodeId?: string;
  /** Nome da sala no MERO ("Sala de Aula 1"). */
  label?: string;
  floorLabel?: string;
}

export function getRoomPlace(apiRoomName: string): RoomPlace | null {
  const e = BY_KEY.get(normalizeSearchText(apiRoomName));
  if (!e) return null;
  const bloco = blocos.find((b) => b.id === e.blocoId);
  const node = e.nodeId ? NODE_MAP.get(e.nodeId) : undefined;
  return {
    blocoId: e.blocoId,
    blocoName: bloco?.name ?? `Bloco ${e.blocoId}`,
    blocoColor: bloco?.color,
    nodeId: node?.id,
    label: node?.label,
    floorLabel: node ? FLOOR_LABEL[node.floor] : undefined,
  };
}

/** Link para o mapa já com o destino escolhido (a tela inicial traça a rota a partir da Entrada). */
export const routeHref = (nodeId: string): string => `/?destino=${encodeURIComponent(nodeId)}`;

/**
 * Nomes (na API de horários) da sala do MERO `code` ("B07") no andar `floorName` ("Andar Superior") do bloco.
 * O andar é necessário porque o mesmo código pode existir em dois andares (ex.: C11 no térreo e no superior).
 */
export function scheduleNamesForRoom(blocoId: string, floorName: string, code: string): string[] {
  // No Bloco E o "Andar Superior" do MERO é o térreo do grafo de navegação.
  const prefix = /subsolo/i.test(floorName) ? 'SUB_' : /superior/i.test(floorName) ? (blocoId === 'E' ? 'T_' : 'S_') : 'T_';
  const id = `${prefix}${code}`;
  return [...BY_KEY.values()].filter((e) => e.nodeId === id).map((e) => e.name);
}

/** Usado nos testes. */
export const MAPPED_ROOM_NAMES = Object.keys(RAW);
export const MAPPED_NODE_IDS = Object.values(RAW).flatMap((e) => (e.nodeId ? [e.nodeId] : []));
