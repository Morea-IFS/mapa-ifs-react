import { StaticImageData } from 'next/image';

export interface Room {
  code: string;
  name: string;
}

export interface Floor {
  name: string;
  image: StaticImageData | string;
  rooms: Room[];
}

export interface MapCoordinates {
  x: number;
  y: number;
}

export interface BlocoData {
  id: string;
  name: string;
  description: string;
  floors: Floor[];
  /** Posição no mapa [x%, y%] */
  mapPosition: {
    terreo?: MapCoordinates;
    superior?: MapCoordinates;
    subsolo?: MapCoordinates;
  };
  /** Cor do marcador no mapa */
  color?: string;
  /** Id do dashboard de energia */
  energyDashboardId?: number;
}
