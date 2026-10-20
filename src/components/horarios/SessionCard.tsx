'use client';

import type { Room, Session } from '@/lib/horarios/api';
import { cardText, KIND_LABEL } from '@/lib/horarios/text';
import { isNow, periodsLabel, WEEKDAYS_LONG } from '@/lib/horarios/time';
import { placeText, RouteLink } from './RoomName';

export type CardSession = Session & { room?: Room };

/**
 * Uma aula. `show` diz o que complementa o título:
 *  - "classes": as turmas (visão de uma sala);
 *  - "room": a sala, com o link para o mapa (visão de turma e busca).
 */
export default function SessionCard({
  session, show, showDay = false, now = null,
}: { session: CardSession; show: 'classes' | 'room'; showDay?: boolean; now?: Date | null }) {
  const { title, details } = cardText(session.lines, session.classCodes);
  const live = now ? isNow(session, now) : false;
  const kind = KIND_LABEL[session.kind];
  const where = session.room ? placeText(session.room.name) : null;

  return (
    <li
      className={`flex gap-3 rounded-xl border p-3 ${live ? 'border-destaque bg-destaque/5' : 'border-borda bg-fundo-cartao'}`}
      aria-current={live ? 'time' : undefined}
    >
      <div className="w-12 shrink-0 text-right tabular-nums leading-tight">
        <p className="text-sm font-semibold text-texto-principal">{session.startTime}</p>
        <p className="text-xs text-texto-auxiliar">{session.endTime}</p>
      </div>
      <div className={`w-0.5 shrink-0 self-stretch rounded-full ${live ? 'bg-destaque' : 'bg-borda-hover'}`} aria-hidden />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <p className="text-[15px] font-semibold leading-snug text-texto-principal">{title}</p>
          {live && <span className="rounded-full bg-destaque px-2 py-0.5 text-[11px] font-semibold text-fundo-principal">Agora</span>}
          {kind && <span className="rounded-full border border-borda-hover px-2 py-0.5 text-[11px] text-texto-secundario">{kind}</span>}
        </div>

        {details.length > 0 && <p className="mt-0.5 text-xs leading-relaxed text-texto-secundario">{details.join(' / ')}</p>}

        {show === 'classes' && session.classCodes.length > 0 && (
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {session.classCodes.map((c) => (
              <span key={c} className="rounded-md bg-fundo-secundario px-2 py-0.5 text-xs font-medium text-texto-principal">{c}</span>
            ))}
          </div>
        )}

        {show === 'room' && session.room && (
          <div className="mt-1.5 flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="text-sm font-medium text-texto-principal">{session.room.name}</p>
              {where && <p className="text-xs text-texto-auxiliar">{where}</p>}
            </div>
            <RouteLink roomName={session.room.name} compact />
          </div>
        )}

        <p className="mt-1.5 text-xs text-texto-auxiliar">
          {showDay && `${WEEKDAYS_LONG[session.weekday - 1]}, `}
          {session.startPeriod === session.endPeriod ? `${session.startPeriod}º horário` : `${periodsLabel(session.startPeriod, session.endPeriod)} horários`}
        </p>
      </div>
    </li>
  );
}
