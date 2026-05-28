import { BlocoData } from '../types';

import blocoAInferior from '@/assets/mapas/blocoA_inferior.png';
import blocoASuperior from '@/assets/mapas/blocoA_superior.png';
import blocoBInferior from '@/assets/mapas/blocoB_inferior.png';
import blocoBSuperior from '@/assets/mapas/blocoB_superior.png';
import blocoCInferior from '@/assets/mapas/blocoC_inferior.png';
import blocoCSuperior from '@/assets/mapas/blocoC_superior.png';
import blocoDInferior from '@/assets/mapas/blocoD_inferior.png';
import blocoDSuperior from '@/assets/mapas/blocoD_superior.png';
import blocoDSubsolo from '@/assets/mapas/blocoD_subsolo.png';
import blocoESuperior from '@/assets/mapas/blocoE.png';
import blocoESubsolo from '@/assets/mapas/blocoE_subsolo.png';
import blocoFInferior from '@/assets/mapas/blocoF_inferior.png';
import blocoFSuperior from '@/assets/mapas/blocoF_superior.png';
import blocoFSubsolo from '@/assets/mapas/blocoF_subsolo.png';
import blocoGInferior from '@/assets/mapas/blocoG_inferior.png';
import blocoGSuperior from '@/assets/mapas/blocoG_superior.png';
import blocoHInferior from '@/assets/mapas/blocoH_inferior.png';
import blocoHSuperior from '@/assets/mapas/blocoH_superior.png';

export const blocos: BlocoData[] = [
  {
    id: 'A',
    name: 'Bloco A',
    description:
      'Bloco A — abriga a CRE, Biblioteca, Sala de Reunião, DEN, Direção Geral e outros setores essenciais do campus.',
    mapPosition: { 
      terreo: { x: 34, y: 95 },
      superior: { x: 40, y: 95 }
    },
    color: '#00d9ff',
    floors: [
      {
        name: 'Andar Inferior',
        image: blocoAInferior,
        rooms: [
          { code: 'A01', name: 'Ala médica do campus' },
          { code: 'A02', name: 'Arquivos' },
          { code: 'A03', name: 'Data Center' },
          { code: 'A04', name: 'CRE: Coordenação de Registro Escolar' },
          { code: 'A05', name: 'Biblioteca' },
          { code: 'Área amarela', name: 'Banheiros' },
        ],
      },
      {
        name: 'Andar Superior',
        image: blocoASuperior,
        rooms: [
          { code: 'A06', name: 'Direção Geral' },
          { code: 'A07', name: 'Gabinete da direção' },
          { code: 'A08', name: 'Gerência de Administração' },
          { code: 'A09', name: 'Sala de Reunião' },
          { code: 'A10', name: 'DEN: Direção de Ensino' },
          { code: 'A11', name: 'Coordenação de Cursos Superiores' },
          { code: 'A12', name: 'NAPNE' },
          { code: 'Área amarela', name: 'Banheiros' },
        ],
      },
    ],
  },
  {
    id: 'B',
    name: 'Bloco B',
    energyDashboardId: 6,
    description:
      'Bloco B — abriga as Salas de 1 a 7, Salas de Desenhos e Projetos, Laboratórios de Natureza, Laboratório de Desenho Técnico em CAD.',
    mapPosition: { 
      terreo: { x: 65, y: 76 },
      superior: { x: 70, y: 78 }
    },
    color: '#ff6b6b',
    floors: [
      {
        name: 'Andar Inferior',
        image: blocoBInferior,
        rooms: [
          { code: 'B01', name: 'Laboratório de Química' },
          { code: 'B02', name: 'Laboratório de Física' },
          { code: 'B03', name: 'Laboratório de Biologia' },
          { code: 'B04', name: 'Sala de Desenhos e Projetos 03' },
          { code: 'B05', name: 'Sala de Desenhos e Projetos 02' },
          { code: 'B06', name: 'Sala de Desenhos e Projetos 01' },
          { code: 'Área amarela', name: 'Banheiros' },
        ],
      },
      {
        name: 'Andar Superior',
        image: blocoBSuperior,
        rooms: [
          { code: 'B07 até B13', name: 'Salas de aula (1 a 7)' },
          { code: 'B14', name: 'Laboratório de Desenho Técnico em CAD' },
          { code: 'Área amarela', name: 'Banheiros' },
        ],
      },
    ],
  },
  {
    id: 'C',
    name: 'Bloco C',
    description:
      'Bloco C — abriga as Salas de 8 a 10, Sophia Polis, Labic, Mini Auditório, Laboratórios.',
    mapPosition: { 
      terreo: { x: 34, y: 59 },
      superior: { x: 40, y: 61 }
    },
    color: '#ffd93d',
    floors: [
      {
        name: 'Andar Inferior',
        image: blocoCInferior,
        rooms: [
          { code: 'C01', name: 'Laboratório de Informática' },
          { code: 'C02', name: 'Laboratório de Refrigeração' },
          { code: 'C03', name: 'Laboratório de Máquinas e Acionamentos Elétricos' },
          { code: 'C04', name: 'Laboratório de Inovação e Criatividade (LABIC)' },
          { code: 'C05', name: 'Laboratório de Ensaios Mecânicos' },
          { code: 'C06', name: 'Sophia Polis' },
          { code: 'C07', name: 'Laboratório de Eletricidade' },
          { code: 'C08', name: 'Laboratório de Topografia' },
          { code: 'C09', name: 'CTI' },
          { code: 'C10', name: 'Almoxarifado/Depósito' },
          { code: 'C11', name: 'Laboratório de Física Experimental' },
        ],
      },
      {
        name: 'Andar Superior',
        image: blocoCSuperior,
        rooms: [
          { code: 'C10', name: 'Mini Auditório' },
          { code: 'C11', name: 'Laboratório de Física Moderna' },
          { code: 'C12', name: 'Sala de Recursos Multimídia (EAD)' },
          { code: 'C13', name: 'CCHS' },
          { code: 'C14', name: 'Sala de Aula 10' },
          { code: 'C15', name: 'Sala de Aula 9' },
          { code: 'C16', name: 'Sala de Aula 8' },
          { code: 'C17', name: 'Laboratório de Controle de Simulação' },
        ],
      },
    ],
  },
  {
    id: 'D',
    name: 'Bloco D',
    description:
      'Bloco D — abriga as CEEL, Laboratórios, EMEC, Sala de Pesquisa COED.',
    mapPosition: { 
      terreo: { x: 65, y: 45 },
      superior: { x: 70, y: 45 },
      subsolo: { x: 49, y: 54 }
    },
    color: '#6bcb77',
    floors: [
      {
        name: 'Andar Inferior',
        image: blocoDInferior,
        rooms: [
          { code: 'D01', name: 'CEEL' },
          { code: 'D02', name: 'Laboratório de Instalações Elétricas Prediais' },
          { code: 'D03', name: 'Laboratório de Instalações Hidráulicas e Sanitárias' },
          { code: 'D04', name: 'Laboratório de Mecânica dos Solos' },
          { code: 'D05', name: 'Sala de Pesquisa COED' },
          { code: 'D06', name: 'Laboratório de Materiais de Construção' },
          { code: 'Área amarela', name: 'Banheiros' },
        ],
      },
      {
        name: 'Andar Superior',
        image: blocoDSuperior,
        rooms: [
          { code: 'D07', name: 'Sala Professor EMEC' },
          { code: 'D08', name: 'Laboratório de Ensinagens, Prototipagens e Ideias' },
          { code: 'D09', name: 'Laboratório de Pneumática' },
          { code: 'D10', name: 'Laboratório de Automação Industrial e Instrumentação' },
          { code: 'D11', name: 'Laboratório de Eletrônica de Potência' },
          { code: 'D12', name: 'EMEC' },
          { code: 'D13', name: 'Laboratório de Metrologia' },
        ],
      },
      {
        name: 'Subsolo',
        image: blocoDSubsolo,
        rooms: [
          { code: 'D14', name: 'Subestação Elétrica' },
          { code: 'D15', name: 'Almoxarifado' },
          { code: 'D16', name: 'Manutenção' },
          { code: 'D17', name: 'Copa' },
          { code: 'D18', name: 'Zelador' },
          { code: 'Área amarela', name: 'Banheiros' },
        ],
      },
    ],
  },
  {
    id: 'E',
    name: 'Bloco E',
    description:
      'Bloco E — abriga COAU, COED, Canteiro de Obras, Sala de Plástica, Ateliês.',
    mapPosition: { 
      terreo: { x: 87, y: 60 },
      subsolo: { x: 68, y: 75 }
    },
    color: '#c084fc',
    floors: [
      {
        name: 'Andar Superior',
        image: blocoESuperior,
        rooms: [
          { code: 'E01', name: 'COED' },
          { code: 'E02', name: 'Ateliê de Arquitetura' },
          { code: 'E03', name: 'Laboratório CAD' },
          { code: 'E04', name: 'Ateliê de Arquitetura' },
        ],
      },
      {
        name: 'Andar Inferior (Subsolo)',
        image: blocoESubsolo,
        rooms: [
          { code: 'E05', name: 'COAU' },
          { code: 'E06', name: 'Sala de Plástica' },
          { code: 'E07', name: 'Laboratório de CAD' },
          { code: 'E08', name: 'Ateliê de Arquitetura' },
          { code: 'E09', name: 'Canteiro de Obras' },
        ],
      },
    ],
  },
  {
    id: 'F',
    name: 'Bloco F',
    description:
      'Bloco F — abriga a COIRC/BSI, Morea, Laboratórios de Informática, Laboratório de Redes, CEEL.',
    mapPosition: { 
      terreo: { x: 65, y: 20 },
      superior: { x: 73, y: 20 },
      subsolo: { x: 44, y: 25 }
    },
    color: '#ff922b',
    floors: [
      {
        name: 'Andar Inferior',
        image: blocoFInferior,
        rooms: [
          { code: 'F01', name: 'COIRC/BSI' },
          { code: 'F02', name: 'Grufee' },
          { code: 'F03', name: 'Sala de Aula 11' },
          { code: 'F04', name: 'Sala de Aula' },
          { code: 'F05', name: 'MOREA' },
          { code: 'F06', name: 'Laboratório de Eletrônica' },
          { code: 'F07', name: 'CEEL' },
          { code: 'Área amarela', name: 'Banheiros' },
        ],
      },
      {
        name: 'Andar Superior',
        image: blocoFSuperior,
        rooms: [
          { code: 'F08', name: 'Laboratório 03' },
          { code: 'F09', name: 'Laboratório 04' },
          { code: 'F10', name: 'Laboratório 06' },
          { code: 'F11', name: 'Laboratório 05' },
          { code: 'F12', name: 'Laboratório de Redes' },
          { code: 'F13', name: 'Laboratório 02' },
          { code: 'F14', name: 'Laboratório 01' },
        ],
      },
      {
        name: 'Subsolo',
        image: blocoFSubsolo,
        rooms: [
          { code: 'F15', name: 'Oficina' },
          { code: 'F16', name: 'Sala de Máquinas 02' },
          { code: 'F17', name: 'Sala de Máquinas 01' },
        ],
      },
    ],
  },
  {
    id: 'G',
    name: 'Bloco G',
    description:
      'Blocos F e G — abriga a Cantina, Refeitório, Área de Convívio, CLF, Laboratório de Física.',
    mapPosition: { 
      terreo: { x: 50, y: 20 },
      superior: { x: 57, y: 20 }
    },
    color: '#20c997',
    floors: [
      {
        name: 'Andar Inferior',
        image: blocoGInferior,
        rooms: [
          { code: 'G01', name: 'CLF' },
          { code: 'G02', name: 'Cantina' },
          { code: 'G03', name: 'Estudo' },
          { code: 'G04', name: 'Laboratório de Física' },
          { code: 'G05', name: 'Arquivos' },
          { code: 'G06', name: 'Refeitório' },
        ],
      },
      {
        name: 'Andar Superior',
        image: blocoGSuperior,
        rooms: [{ code: 'G07', name: 'Área de Convívio' }],
      },
    ],
  },
  {
    id: 'H',
    name: 'Bloco H',
    description:
      'Bloco H — abriga o Auditório, Banheiro, Containers, Comunicação, Motoristas.',
    mapPosition: { 
      terreo: { x: 15, y: 79 },
      superior: { x: 23, y: 78 }
    },
    color: '#f06595',
    floors: [
      {
        name: 'Andar Inferior',
        image: blocoHInferior,
        rooms: [
          { code: 'H01', name: 'Auditório' },
          { code: 'H02', name: 'Container Estúdio' },
          { code: 'H03', name: 'Container Depósito' },
          { code: 'H04', name: 'Container Laboratório' },
          { code: 'H05', name: 'Container LIA' },
          { code: 'Área amarela', name: 'Banheiros' },
        ],
      },
      {
        name: 'Andar Superior',
        image: blocoHSuperior,
        rooms: [
          { code: 'H06', name: 'Comunicação' },
          { code: 'H07', name: 'Motoristas' },
        ],
      },
    ],
  },
];

export function getBlocoById(id: string): BlocoData | undefined {
  return blocos.find((b) => b.id.toLowerCase() === id.toLowerCase());
}
