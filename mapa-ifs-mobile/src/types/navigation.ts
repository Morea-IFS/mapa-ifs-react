import type { RouteResult } from './index';

export type RootStackParamList = {
  Home: { routeResult?: RouteResult | null };
  BlocoDetail: { blocoId: string };
};
