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
  /** Positions on the campus map as percentage [x%, y%] from top-left for each floor */
  mapPosition: {
    terreo?: MapCoordinates;
    superior?: MapCoordinates;
    subsolo?: MapCoordinates;
  };
  /** Color for the marker on the map */
  color?: string;
}
