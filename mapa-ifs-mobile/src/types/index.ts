import { ImageSourcePropType } from 'react-native';

export interface Room {
  code: string;
  name: string;
}

export interface Floor {
  name: string;
  image: ImageSourcePropType;
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

export type FloorLevel = 'terreo' | 'superior' | 'subsolo';

export type NodeType = 'sala' | 'corredor' | 'escada' | 'rampa' | 'entrada' | 'juncao' | 'banheiro';

export interface NavNode {
  id: string;
  x: number; // % width
  y: number; // % height
  floor: FloorLevel;
  label?: string;
  type: NodeType;
  connectsTo?: { nodeId: string; floor: FloorLevel }[];
}

export interface NavEdge {
  from: string;
  to: string;
  accessible?: boolean;
}

export interface PathResult {
  path: NavNode[];
  totalDistance: number;
  floorChanges: { floor: FloorLevel; nodeId: string; type: 'escada' | 'rampa' }[];
}

export interface RouteResult {
  pathResult: PathResult;
  fromId: string;
  toId: string;
  accessibleOnly: boolean;
}
