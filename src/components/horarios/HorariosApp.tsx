'use client';

import { useCallback, useEffect, useState } from 'react';
import { Building2, DoorOpen, GraduationCap, Search } from 'lucide-react';
import { getPeriods } from '@/lib/horarios/api';
import { useApi } from '@/lib/horarios/useApi';
import { parseState, STORAGE_KEY, toSearch, toStored, type View, type ViewState } from '@/lib/horarios/viewState';
import { ErrorBlock, LoadingBlock } from './ui';
import FreeRoomsView from './FreeRoomsView';
import RoomView from './RoomView';
import ClassView from './ClassView';
import SearchView from './SearchView';

const TABS: { id: View; label: string; icon: React.ElementType }[] = [
  { id: 'livres', label: 'Salas livres', icon: DoorOpen },
  { id: 'sala', label: 'Por sala', icon: Building2 },
  { id: 'turma', label: 'Por turma', icon: GraduationCap },
  { id: 'busca', label: 'Buscar aula', icon: Search },
];

function readInitial(): ViewState {
  let saved: string | null = null;
  try { saved = window.localStorage.getItem(STORAGE_KEY); } catch { /* armazenamento bloqueado */ }
  return parseState(window.location.search, saved);
}

export default function HorariosApp() {
  const [state, setState] = useState<ViewState>(readInitial);
  const [visited, setVisited] = useState<View[]>(() => [readInitial().view]);
  const [now, setNow] = useState(() => new Date());
  const periods = useApi('periods', getPeriods);

  // guarda a escolha no aparelho e na URL (para poder compartilhar o link)
  useEffect(() => {
    try { window.localStorage.setItem(STORAGE_KEY, toStored(state)); } catch { /* ignora */ }
    window.history.replaceState(null, '', `${window.location.pathname}${toSearch(state)}`);
  }, [state]);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(t);
  }, []);

  const go = useCallback((view: View, patch: Partial<ViewState> = {}) => {
    setState((s) => ({ ...s, ...patch, view }));
    setVisited((v) => (v.includes(view) ? v : [...v, view]));
  }, []);
  const setSala = useCallback((sala: string) => go('sala', { sala }), [go]);
  const setTurma = useCallback((turma: string) => go('turma', { turma }), [go]);
  const setQ = useCallback((q: string) => setState((s) => (s.q === q ? s : { ...s, q })), []);

  const panel = (id: View, children: React.ReactNode) =>
    visited.includes(id) && (
      <div key={id} role="tabpanel" id={`painel-${id}`} aria-labelledby={`aba-${id}`} hidden={state.view !== id}>
        {children}
      </div>
    );

  return (
    <div className="mx-auto min-h-screen max-w-300 p-4 pb-16 md:p-8">
      <header className="py-10 pb-6 text-center">
        <h1 className="mb-2 bg-linear-to-br from-destaque via-indigo-500 to-purple-500 bg-clip-text text-3xl font-bold tracking-tight text-transparent md:text-5xl">
          Horários
        </h1>
        <p className="mx-auto max-w-xl text-[0.95rem] text-texto-secundario">
          Veja quais salas estão livres, a semana de cada sala ou da sua turma, e onde é cada aula.
        </p>
        {periods.data && (
          <p className="mt-3 inline-block rounded-full border border-borda bg-fundo-cartao px-3 py-1 text-xs text-texto-secundario">
            Semestre {periods.data.semester}, previsão pela grade regular
          </p>
        )}
      </header>

      <div role="tablist" aria-label="Como você quer consultar" className="mx-auto mb-6 grid max-w-3xl grid-cols-2 gap-2 md:grid-cols-4">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            role="tab"
            id={`aba-${id}`}
            aria-selected={state.view === id}
            aria-controls={`painel-${id}`}
            type="button"
            onClick={() => go(id)}
            className={`flex min-h-14 items-center justify-center gap-2 rounded-xl border px-3 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-destaque ${
              state.view === id ? 'border-destaque bg-destaque-fraco text-destaque' : 'border-borda bg-fundo-cartao text-texto-secundario hover:border-borda-hover hover:text-texto-principal'
            }`}
          >
            <Icon size={18} aria-hidden />
            {label}
          </button>
        ))}
      </div>

      {periods.error ? (
        <div className="mx-auto max-w-xl"><ErrorBlock error={periods.error} onRetry={periods.reload} /></div>
      ) : !periods.data ? (
        <div className="mx-auto max-w-xl"><LoadingBlock slow={periods.slow} lines={3} /></div>
      ) : (
        <>
          {panel('livres', <FreeRoomsView periods={periods.data.data} now={now} onOpenRoom={setSala} />)}
          {panel('sala', <RoomView roomName={state.sala} now={now} onChange={setSala} />)}
          {panel('turma', <ClassView turma={state.turma} now={now} onChange={setTurma} />)}
          {panel('busca', <SearchView initialQuery={state.q} now={now} onQueryChange={setQ} />)}
        </>
      )}
    </div>
  );
}
