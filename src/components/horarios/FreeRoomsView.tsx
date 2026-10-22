'use client';

import { useMemo, useState } from 'react';
import { Clock, Search } from 'lucide-react';
import { getAvailability, type AvailabilityItem, type Period } from '@/lib/horarios/api';
import { useApi } from '@/lib/horarios/useApi';
import { addDays, dateLabel, defaultFreeWindow, isoDate, periodsLabel, toMinutes } from '@/lib/horarios/time';
import { normalizeSearchText } from '@/lib/roomSearch';
import { getRoomPlace } from '@/data/horariosRooms';
import { cardText } from '@/lib/horarios/text';
import { Chip, EmptyBlock, ErrorBlock, inputClass, LoadingBlock } from './ui';
import { placeText, RouteLink } from './RoomName';

type Window = { date: string; start: string; end: string };

function groupByBuilding(items: AvailabilityItem[]) {
  const groups = new Map<string, { title: string; items: AvailabilityItem[] }>();
  for (const it of items) {
    const place = getRoomPlace(it.room.name);
    const key = place?.blocoId ?? '~';
    const g = groups.get(key) ?? { title: place?.blocoName ?? 'Outros locais', items: [] };
    g.items.push(it);
    groups.set(key, g);
  }
  return [...groups.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, g]) => ({ key, title: g.title, items: g.items.sort((x, y) => x.room.name.localeCompare(y.room.name, 'pt-BR', { numeric: true })) }));
}

function RoomRow({ item, onOpen }: { item: AvailabilityItem; onOpen: (roomName: string) => void }) {
  const where = placeText(item.room.name);
  const conflict = item.conflicts[0];
  const c = conflict ? cardText(conflict.label.split(' / '), []) : null;
  return (
    <li className="flex items-center gap-2 rounded-xl border border-borda bg-fundo-cartao p-1.5 pl-3">
      <button
        type="button"
        onClick={() => onOpen(item.room.name)}
        className="flex min-h-12 min-w-0 flex-1 flex-col justify-center text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-destaque rounded-lg"
        aria-label={`Ver a semana de ${item.room.name}`}
      >
        <span className="text-[15px] font-semibold leading-snug text-texto-principal">{item.room.name}</span>
        {where && <span className="text-xs text-texto-auxiliar">{where}</span>}
        {item.free ? (
          <span className="mt-0.5 flex items-center gap-1.5 text-xs font-medium text-emerald-600">
            <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden />
            {item.freeUntil ? `Livre até ${item.freeUntil}` : 'Livre o resto do dia'}
          </span>
        ) : (
          <span className="mt-0.5 flex items-start gap-1.5 text-xs text-texto-secundario">
            <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-amber-500" aria-hidden />
            <span>
              <span className="font-medium text-amber-600">Ocupada</span>
              {conflict && c && ` das ${conflict.startTime} às ${conflict.endTime}: ${c.title}`}
              {item.conflicts.length > 1 && ` (+${item.conflicts.length - 1})`}
            </span>
          </span>
        )}
      </button>
      <RouteLink roomName={item.room.name} compact />
    </li>
  );
}

export default function FreeRoomsView({ periods, now, onOpenRoom }: { periods: Period[]; now: Date; onOpenRoom: (roomName: string) => void }) {
  const defaults = useMemo(() => defaultFreeWindow(periods, now), [periods, now]);
  const [custom, setCustom] = useState<Partial<Window>>({});
  const [show, setShow] = useState<'free' | 'busy'>('free');
  const [filter, setFilter] = useState('');
  const [exact, setExact] = useState(false);

  const win: Window | null = defaults ? { date: custom.date ?? defaults.date, start: custom.start ?? defaults.start, end: custom.end ?? defaults.end } : null;
  const valid = win !== null && toMinutes(win.end) > toMinutes(win.start);
  const isNowMode = Object.keys(custom).length === 0 && defaults?.status !== 'tomorrow';
  const today = isoDate(now);
  const tomorrow = isoDate(addDays(now, 1));

  const { data, error, loading, slow, reload } = useApi(
    win && valid ? `free|${win.date}|${win.start}|${win.end}` : null,
    () => getAvailability(win!),
  );

  const overlaps = (p: Period) => win !== null && toMinutes(p.startTime) < toMinutes(win.end) && toMinutes(win.start) < toMinutes(p.endTime);
  const single = win ? periods.filter(overlaps).length === 1 : false;

  const pickPeriod = (p: Period) => {
    if (!win) return;
    const selected = periods.filter(overlaps);
    if (selected.length === 1 && selected[0].code !== p.code) {
      const [a, b] = [selected[0], p].sort((x, y) => toMinutes(x.startTime) - toMinutes(y.startTime));
      setCustom((c) => ({ ...c, start: a.startTime, end: b.endTime }));
    } else {
      setCustom((c) => ({ ...c, start: p.startTime, end: p.endTime }));
    }
  };
  const goNow = () => setCustom({});

  const all = data?.data ?? [];
  const f = normalizeSearchText(filter);
  const matches = (it: AvailabilityItem) => !f || normalizeSearchText(`${it.room.name} ${getRoomPlace(it.room.name)?.blocoName ?? ''}`).includes(f);
  const freeList = all.filter((i) => i.free && matches(i));
  const busyList = all.filter((i) => !i.free && matches(i));
  const shown = show === 'free' ? freeList : busyList;
  const selectedPeriods = win ? periods.filter(overlaps) : [];

  return (
    <div className="mx-auto max-w-3xl">
      <section aria-label="Quando" className="rounded-2xl border border-borda bg-fundo-cartao p-4">
        <div className="flex flex-wrap items-center gap-2">
          <Chip active={isNowMode} onClick={goNow}>
            <Clock size={15} aria-hidden /> Agora
          </Chip>
          <Chip active={win?.date === today && !isNowMode} onClick={() => setCustom((c) => ({ ...c, date: today }))}>Hoje</Chip>
          <Chip active={win?.date === tomorrow} onClick={() => setCustom((c) => ({ ...c, date: tomorrow }))}>Amanhã</Chip>
          <label className="ml-auto flex items-center gap-2 text-sm text-texto-secundario">
            <span className="sr-only md:not-sr-only">Dia</span>
            <input
              type="date"
              value={win?.date ?? ''}
              onChange={(e) => e.target.value && setCustom((c) => ({ ...c, date: e.target.value }))}
              className={`${inputClass} w-auto`}
              aria-label="Escolher o dia"
            />
          </label>
        </div>

        <p className="mb-2 mt-4 text-sm font-medium text-texto-principal">Horário</p>
        <div className="-mx-4 overflow-x-auto px-4 pb-1">
          <div className="flex w-max gap-1.5" role="group" aria-label="Períodos de aula">
            {periods.map((p) => (
              <button
                key={p.code}
                type="button"
                onClick={() => pickPeriod(p)}
                aria-pressed={overlaps(p)}
                className={`flex min-h-14 w-16 shrink-0 flex-col items-center justify-center rounded-xl border text-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-destaque ${
                  overlaps(p) ? 'border-destaque bg-destaque-fraco text-destaque' : 'border-borda bg-fundo-principal text-texto-secundario hover:border-borda-hover'
                }`}
              >
                <span className="text-base font-semibold leading-none">{p.code}</span>
                <span className="mt-1 text-[11px] leading-none tabular-nums">{p.startTime}</span>
              </button>
            ))}
          </div>
        </div>
        <p className="mt-2 text-xs text-texto-auxiliar">{single ? 'Toque em outro horário para escolher um intervalo.' : 'Toque em um horário para recomeçar.'}</p>

        <button
          type="button"
          onClick={() => setExact((v) => !v)}
          aria-expanded={exact}
          className="mt-3 text-sm font-medium text-destaque underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-destaque"
        >
          {exact ? 'Esconder horário exato' : 'Informar horário exato'}
        </button>
        {exact && win && (
          <div className="mt-2 grid grid-cols-2 gap-3">
            <label className="text-sm text-texto-secundario">
              Das
              <input type="time" value={win.start} onChange={(e) => e.target.value && setCustom((c) => ({ ...c, start: e.target.value }))} className={`${inputClass} mt-1`} />
            </label>
            <label className="text-sm text-texto-secundario">
              Às
              <input type="time" value={win.end} onChange={(e) => e.target.value && setCustom((c) => ({ ...c, end: e.target.value }))} className={`${inputClass} mt-1`} />
            </label>
          </div>
        )}
      </section>

      {win && (
        <p className="mb-3 mt-4 text-sm text-texto-secundario" aria-live="polite">
          {valid ? (
            <>
              <span className="font-medium text-texto-principal">{dateLabel(win.date)}</span>, das {win.start} às {win.end}
              {selectedPeriods.length > 0 && ` (${periodsLabel(selectedPeriods[0].code, selectedPeriods[selectedPeriods.length - 1].code)} horário)`}
              {defaults?.status === 'tomorrow' && custom.date === undefined && custom.start === undefined && ' — fora do horário de aula agora, mostrando o próximo dia útil'}
            </>
          ) : (
            'O horário final precisa ser depois do inicial.'
          )}
        </p>
      )}

      {error ? (
        <ErrorBlock error={error} onRetry={reload} />
      ) : !data && loading ? (
        <LoadingBlock slow={slow} />
      ) : data ? (
        <div className={loading ? 'opacity-60 transition-opacity' : 'transition-opacity'}>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Chip active={show === 'free'} onClick={() => setShow('free')}>Livres ({all.filter((i) => i.free).length})</Chip>
            <Chip active={show === 'busy'} onClick={() => setShow('busy')}>Ocupadas ({all.filter((i) => !i.free).length})</Chip>
          </div>
          <div className="relative mb-4">
            <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-texto-auxiliar" aria-hidden />
            <input
              type="search"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Filtrar por nome ou bloco (ex.: lab, Bloco B)"
              aria-label="Filtrar salas"
              className={`${inputClass} pl-9`}
            />
          </div>

          {shown.length === 0 ? (
            <EmptyBlock
              title={show === 'free' ? 'Nenhuma sala livre nesse horário' : 'Nenhuma sala ocupada nesse horário'}
              hint={filter ? 'Limpe o filtro para ver todas.' : show === 'free' ? 'Tente outro horário ou veja as ocupadas.' : undefined}
            />
          ) : (
            <div className="flex flex-col gap-5">
              {groupByBuilding(shown).map((g) => (
                <section key={g.key} aria-label={g.title}>
                  <h3 className="mb-2 text-sm font-semibold text-texto-principal">
                    {g.title} <span className="font-normal text-texto-auxiliar">({g.items.length})</span>
                  </h3>
                  <ul className="flex flex-col gap-2">
                    {g.items.map((it) => <RoomRow key={it.room.id} item={it} onOpen={onOpenRoom} />)}
                  </ul>
                </section>
              ))}
            </div>
          )}
          <p className="mt-5 text-xs leading-relaxed text-texto-auxiliar">{data.notice}</p>
        </div>
      ) : null}
    </div>
  );
}
