'use client';

import { useEffect, useState } from 'react';
import { Search, X } from 'lucide-react';
import { searchSessions } from '@/lib/horarios/api';
import { useApi } from '@/lib/horarios/useApi';
import { WEEKDAYS_SHORT } from '@/lib/horarios/time';
import { Chip, EmptyBlock, ErrorBlock, inputClass, LoadingBlock } from './ui';
import SessionCard from './SessionCard';

const STEP = 20;
const MAX = 100;
const EXAMPLES = ['física', 'programação', 'monitoria'];

export default function SearchView({ initialQuery, now, onQueryChange }: { initialQuery: string; now: Date; onQueryChange: (q: string) => void }) {
  const [text, setText] = useState(initialQuery);
  const [debounced, setDebounced] = useState(initialQuery);
  const [weekday, setWeekday] = useState<number | null>(null);
  const [size, setSize] = useState(STEP);

  useEffect(() => {
    const t = setTimeout(() => { setDebounced(text.trim()); setSize(STEP); onQueryChange(text.trim()); }, 350);
    return () => clearTimeout(t);
  }, [text, onQueryChange]);

  const enough = debounced.length >= 2;
  const { data, error, loading, slow, reload } = useApi(
    enough ? `busca|${debounced}|${weekday ?? ''}|${size}` : null,
    () => searchSessions({ q: debounced, weekday: weekday ?? undefined, pageSize: size }),
  );
  const total = data?.meta.total ?? 0;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="relative">
        <Search size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-texto-auxiliar" aria-hidden />
        <input
          type="search"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Disciplina, professor(a) ou turma"
          aria-label="Buscar aula"
          enterKeyHint="search"
          autoComplete="off"
          className={`${inputClass} min-h-12 pl-10 pr-10`}
        />
        {text && (
          <button type="button" onClick={() => setText('')} aria-label="Limpar busca" className="absolute right-1 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-texto-auxiliar hover:text-texto-principal focus:outline-none focus-visible:ring-2 focus-visible:ring-destaque">
            <X size={16} aria-hidden />
          </button>
        )}
      </div>

      <div className="-mx-4 mt-3 overflow-x-auto px-4">
        <div className="flex w-max gap-2" role="group" aria-label="Filtrar por dia">
          <Chip active={weekday === null} onClick={() => { setWeekday(null); setSize(STEP); }}>Todos os dias</Chip>
          {WEEKDAYS_SHORT.map((d, i) => (
            <Chip key={d} active={weekday === i + 1} onClick={() => { setWeekday(i + 1); setSize(STEP); }}>{d}</Chip>
          ))}
        </div>
      </div>

      <div className="mt-5">
        {!enough ? (
          <div className="rounded-xl border border-dashed border-borda p-5">
            <p className="text-[15px] font-medium text-texto-principal">Descubra onde e quando é a aula</p>
            <p className="mt-1 text-sm text-texto-secundario">Digite pelo menos 2 letras. A busca ignora acentos e vale para o nome da disciplina, do docente e da turma.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {EXAMPLES.map((e) => <Chip key={e} onClick={() => setText(e)}>{e}</Chip>)}
            </div>
          </div>
        ) : error ? (
          <ErrorBlock error={error} onRetry={reload} />
        ) : !data && loading ? (
          <LoadingBlock slow={slow} lines={3} />
        ) : data ? (
          <div className={loading ? 'opacity-60 transition-opacity' : 'transition-opacity'}>
            {total === 0 ? (
              <EmptyBlock title={`Nada encontrado para "${debounced}"`} hint="Confira a grafia, tente menos palavras ou escolha Todos os dias." />
            ) : (
              <>
                <p className="mb-3 text-sm text-texto-secundario" aria-live="polite">
                  {total} {total === 1 ? 'aula encontrada' : 'aulas encontradas'}
                </p>
                <ul className="flex flex-col gap-2">
                  {data.data.map((s, i) => (
                    <SessionCard key={`${s.room.id}-${s.weekday}-${s.startTime}-${i}`} session={s} show="room" showDay now={now} />
                  ))}
                </ul>
                {total > data.data.length && (
                  size < MAX ? (
                    <div className="mt-4 flex justify-center">
                      <Chip onClick={() => setSize((n) => Math.min(MAX, n + STEP))}>Mostrar mais</Chip>
                    </div>
                  ) : (
                    <p className="mt-4 text-center text-sm text-texto-secundario">Mostrando as primeiras {MAX}. Use um dia da semana ou mais palavras para refinar.</p>
                  )
                )}
              </>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
