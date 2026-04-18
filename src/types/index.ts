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

export interface BlocoData {
  id: string;
  name: string;
  description: string;
  floors: Floor[];
  /** Position on the campus map as percentage [x%, y%] from top-left */
  mapPosition: { x: number; y: number };
  /** Color for the marker on the map */
  color?: string;
}
