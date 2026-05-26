'use client';

import dynamic from 'next/dynamic';
import { blocos } from '@/data/blocos';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const CampusMap = dynamic(() => import('@/components/CampusMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[70vh] min-h-400px max-h-600px md:h-500px md:min-h-400px md:max-h-550px rounded-2xl overflow-hidden border border-borda shadow-lg relative flex items-center justify-center bg-fundo-secundario text-texto-auxiliar">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-destaque border-t-transparent rounded-full animate-spin" />
        <span className="text-sm">Carregando mapa interativo...</span>
      </div>
    </div>
  )
});

export default function MapaGeralPage() {
  return (
    <div className="min-h-screen p-4 md:p-8 max-w-300 mx-auto animate-in fade-in duration-500">
      <div className="text-center py-10 pb-6">
        <h1 className="text-3xl md:text-7xl font-bold tracking-tight bg-linear-to-br from-destaque via-indigo-500 to-purple-500 bg-clip-text text-transparent mb-2">
          MERO
        </h1>
        <p className="text-[0.95rem] text-texto-secundario">
          Mapa de Espaços e Representação de Orientação.
        </p>
        <p className="text-[0.95rem] text-texto-secundario">
          Um mapa do campus para facilitar sua navegação e localização de salas, blocos e outros pontos de interesse.
        </p>
      </div>

      <div className="mx-auto mb-10 w-full animate-in slide-in-from-bottom-4 duration-700">
        <CampusMap />
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
