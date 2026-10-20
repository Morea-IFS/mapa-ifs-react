'use client';

import { useState } from 'react';
import { defaultWeekday, WEEKDAYS_LONG, WEEKDAYS_SHORT, toMinutes, weekdayOf } from '@/lib/horarios/time';
import SessionCard, { type CardSession } from './SessionCard';

/**
 * A semana de aulas. No celular mostra um dia por vez (abas Seg a Sex, já no dia de hoje);
 * em telas largas mostra os cinco dias lado a lado.
 */
export default function WeekView({
  sessions, show, now, emptyDay,
}: { sessions: CardSession[]; show: 'classes' | 'room'; now: Date; emptyDay: string }) {
  const [day, setDay] = useState(() => defaultWeekday(now));
  const today = weekdayOf(now);
  const byDay = (d: number) => sessions.filter((s) => s.weekday === d).sort((a, b) => toMinutes(a.startTime) - toMinutes(b.startTime));

  return (
    <div>
      <div role="tablist" aria-label="Dia da semana" className="mb-3 grid grid-cols-5 gap-1.5 lg:hidden">
        {WEEKDAYS_SHORT.map((label, i) => {
          const d = i + 1;
          const n = byDay(d).length;
          return (
            <button
              key={label}
              role="tab"
              id={`tab-dia-${d}`}
              aria-selected={day === d}
              aria-controls={`painel-dia-${d}`}
              type="button"
              onClick={() => setDay(d)}
              className={`flex min-h-14 flex-col items-center justify-center rounded-xl border text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-destaque ${
                day === d ? 'border-destaque bg-destaque-fraco text-destaque' : 'border-borda bg-fundo-cartao text-texto-secundario'
              }`}
            >
              <span>{label}</span>
              <span className="text-[11px] font-normal">{today === d ? 'hoje' : `${n} ${n === 1 ? 'aula' : 'aulas'}`}</span>
            </button>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        {WEEKDAYS_LONG.map((name, i) => {
          const d = i + 1;
          const list = byDay(d);
          return (
            <section
              key={name}
              role="tabpanel"
              id={`painel-dia-${d}`}
              aria-labelledby={`tab-dia-${d}`}
              className={`${day === d ? 'block' : 'hidden'} min-w-0 lg:block`}
            >
              <h3 className={`mb-2 hidden text-sm font-semibold lg:block ${today === d ? 'text-destaque' : 'text-texto-principal'}`}>
                {name}{today === d ? ' (hoje)' : ''}
              </h3>
              {list.length === 0 ? (
                <p className="rounded-xl border border-dashed border-borda p-4 text-sm text-texto-secundario">{emptyDay}</p>
              ) : (
                <ul className="flex flex-col gap-2">
                  {list.map((s, k) => (
                    <SessionCard key={`${s.startTime}-${s.room?.id ?? ''}-${k}`} session={s} show={show} now={now} />
                  ))}
                </ul>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
