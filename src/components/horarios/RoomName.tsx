import Link from 'next/link';
import { Navigation } from 'lucide-react';
import { getRoomPlace, routeHref } from '@/data/horariosRooms';

/** Onde fica a sala, em linguagem do MERO: "Bloco B, andar superior". */
export function placeText(name: string): string | null {
  const place = getRoomPlace(name);
  if (!place) return null;
  return place.floorLabel ? `${place.blocoName}, ${place.floorLabel.toLowerCase()}` : place.blocoName;
}

/** Link "Traçar rota" até a sala no mapa; não aparece quando a sala não tem ponto no mapa. */
export function RouteLink({ roomName, compact = false }: { roomName: string; compact?: boolean }) {
  const nodeId = getRoomPlace(roomName)?.nodeId;
  if (!nodeId) return null;
  return (
    <Link
      href={routeHref(nodeId)}
      aria-label={`Traçar rota até ${roomName}`}
      className={`inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full border border-borda text-sm font-medium text-destaque transition-colors hover:border-destaque hover:bg-destaque-fraco focus:outline-none focus-visible:ring-2 focus-visible:ring-destaque ${compact ? 'w-11 justify-center' : 'px-4'}`}
    >
      <Navigation size={15} aria-hidden />
      {!compact && <span>Traçar rota</span>}
    </Link>
  );
}
