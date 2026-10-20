'use client';

import { Suspense, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { blocos } from '@/data/blocos';
import Link from 'next/link';
import { ArrowRight, CalendarClock, Navigation } from 'lucide-react';
import FloorSwitcher, { type FloorLevel } from '@/components/FloorSwitcher';
import RouteDrawer, { type RouteResult } from '@/components/RouteDrawer';
import { NAV_NODES, NODE_MAP } from '@/data/navigationGraph';

const CampusMap = dynamic(() => import('@/components/CampusMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[70vh] min-h-100 max-h-150 md:h-125 md:min-h-100 md:max-h-137.5 rounded-2xl overflow-hidden border border-borda shadow-lg relative flex items-center justify-center bg-fundo-secundario text-texto-auxiliar">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-destaque border-t-transparent rounded-full animate-spin" />
        <span className="text-sm">Carregando mapa interativo...</span>
      </div>
    </div>
  ),
});

function MapaGeralContent() {
  // /?destino=S_B07 (vindo da página de horários): já sai com a rota da Entrada até a sala
  const searchParams = useSearchParams();
  const destino = searchParams?.get('destino') ?? null;
  const initialToId = destino && destino !== 'T_ENTRY' && NODE_MAP.has(destino) ? destino : undefined;

  const [currentFloor, setCurrentFloor] = useState<FloorLevel>('terreo');
  const [routeResult, setRouteResult] = useState<RouteResult | null>(null);

  const handleRouteChange = useCallback((result: RouteResult | null) => {
    setRouteResult(result);

    // Se uma rota for encontrada, tente extrair o andar inicial para centralizar o mapa
    if (result) {
      const originNode = NAV_NODES.find((n) => n.id === result.fromId);
      if (originNode) setCurrentFloor(originNode.floor);
    }
  }, []);

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-300 mx-auto animate-in fade-in duration-500">
      <div className="text-center py-10 pb-6">
        <h1 className="text-3xl md:text-7xl font-bold tracking-tight bg-linear-to-br from-destaque via-indigo-500 to-purple-500 bg-clip-text text-transparent mb-2">
          MERO
        </h1>
        <p className="text-[0.95rem] text-texto-secundario">
          Mapa de Espaços, Recursos e Orientação.
        </p>
        <p className="text-[0.95rem] text-texto-secundario">
          Um mapa do campus para facilitar sua navegação e localização de salas, blocos e outros pontos de interesse.
        </p>
      </div>

      <div className="mx-auto mb-4 flex max-w-xs justify-center">
        <FloorSwitcher currentFloor={currentFloor} onFloorChange={setCurrentFloor} />
      </div>

      {/* Banner de rota ativa */}
      {routeResult && (
        <div
          className="mx-auto mb-3 max-w-2xl flex items-center gap-3 px-4 py-2.5 bg-destaque/10 border border-destaque/30 rounded-xl animate-in slide-in-from-top-2 fade-in duration-300"
          role="status"
          aria-live="polite"
        >
          <Navigation size={14} className="text-destaque shrink-0" aria-hidden />
          <p className="text-xs text-texto-secundario flex-1 min-w-0 truncate">
            <span className="text-destaque font-semibold">Rota ativa</span>
            {' — '}
            {routeResult.pathResult.floorChanges.length > 0
              ? `${routeResult.pathResult.floorChanges.length} troca(s) de andar`
              : 'mesmo andar'}
            {routeResult.accessibleOnly ? ' · Rota acessível' : ''}
          </p>
          <button
            onClick={() => { setRouteResult(null); }}
            className="text-[11px] text-texto-auxiliar hover:text-texto-principal transition-colors duration-150 shrink-0"
            aria-label="Limpar rota ativa"
          >
            Limpar
          </button>
        </div>
      )}

      <div className="mx-auto mb-10 w-full animate-in slide-in-from-bottom-4 duration-700">
        <CampusMap floor={currentFloor} routeResult={routeResult} />
      </div>

      {/* Pesquisa de espaços disponível diretamente na tela principal */}
      <div className="mx-auto mb-5 max-w-3xl animate-in slide-in-from-bottom-2 duration-500">
        <RouteDrawer
          isOpen={true}
          onClose={() => {}}
          presentation="inline"
          onRouteChange={handleRouteChange}
          initialFromId={initialToId ? 'T_ENTRY' : undefined}
          initialToId={initialToId}
        />
      </div>

      <div className="mx-auto mb-5 max-w-3xl">
        <Link
          href="/horarios"
          className="group flex items-center gap-3.5 rounded-xl border border-borda bg-fundo-cartao p-4 transition-colors duration-200 hover:border-destaque focus:outline-none focus-visible:ring-2 focus-visible:ring-destaque"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-destaque-fraco text-destaque">
            <CalendarClock size={20} aria-hidden />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[15px] font-semibold text-texto-principal">Horários das salas</span>
            <span className="block text-xs text-texto-secundario">Salas livres agora, a semana de cada sala e a da sua turma</span>
          </span>
          <ArrowRight className="shrink-0 text-texto-auxiliar transition-transform duration-150 group-hover:translate-x-1" size={18} aria-hidden />
        </Link>
      </div>

      <div className="pb-16">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-texto-secundario mb-4">
          Acesso Rápido
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {blocos.map((bloco) => (
            <div key={bloco.id} className="animate-in fade-in duration-500 fill-mode-both">
              <Link
                href={`/bloco/${bloco.id}`}
                className="group flex items-start gap-3.5 p-4 bg-fundo-cartao hover:bg-fundo-cartao-hover border border-borda hover:border-borda-hover rounded-xl hover:-translate-y-0.5 transition-all duration-250 hover:shadow-md cursor-pointer relative overflow-hidden"
                style={{ '--card-accent': bloco.color || 'var(--color-destaque)' } as React.CSSProperties}
              >
                <div
                  className="w-1 self-stretch rounded-sm shrink-0 shadow-[0_0_10px_color-mix(in_srgb,var(--card-accent)_40%,transparent)]"
                  style={{ backgroundColor: 'var(--card-accent)' }}
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-[15px] font-semibold text-texto-principal mb-0.5">{bloco.name}</h3>
                  <p className="text-[11px] text-texto-auxiliar leading-relaxed mb-1.5 line-clamp-2">
                    {bloco.description.replace(/^Bloco[s]?\s\w+\s—\s/, '')}
                  </p>
                  <p className="text-[11px] text-texto-auxiliar">
                    {bloco.floors.length} {bloco.floors.length === 1 ? 'andar' : 'andares'} · {bloco.floors.reduce((acc, f) => acc + f.rooms.length, 0)} salas
                  </p>
                </div>
                <ArrowRight className="text-texto-auxiliar group-hover:text-(--card-accent) group-hover:translate-x-1 transition-all duration-150 mt-1 shrink-0" size={18} />
              </Link>
            </div>
          ))}
        </div>
      </div>


    </div>
  );
}

export default function MapaGeralPage() {
  return (
    <Suspense fallback={null}>
      <MapaGeralContent />
    </Suspense>
  );
}
