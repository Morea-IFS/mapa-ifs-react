'use client';

import { useMemo } from 'react';
import { getRoomSchedule, listRooms } from '@/lib/horarios/api';
import { useApi } from '@/lib/horarios/useApi';
import { isNow, toMinutes, weekdayOf, minutesOf } from '@/lib/horarios/time';
import { normalizeSearchText } from '@/lib/roomSearch';
import { EmptyBlock, ErrorBlock, LoadingBlock } from './ui';
import RoomPicker from './RoomPicker';
import { placeText, RouteLink } from './RoomName';
import WeekView from './WeekView';

/** Situação da sala agora, só quando hoje é dia de aula. */
function statusNow(sessions: { weekday: number; startTime: string; endTime: string }[], now: Date): { busy: boolean; text: string } | null {
  if (weekdayOf(now) > 5) return null;
  const live = sessions.find((s) => isNow(s, now));
  if (live) return { busy: true, text: `Em uso agora, até ${live.endTime}` };
  const later = sessions
    .filter((s) => s.weekday === weekdayOf(now) && toMinutes(s.startTime) > minutesOf(now))
    .sort((a, b) => toMinutes(a.startTime) - toMinutes(b.startTime))[0];
  return { busy: false, text: later ? `Livre agora, até ${later.startTime}` : 'Livre pelo resto do dia' };
}

export default function RoomView({ roomName, now, onChange }: { roomName: string | null; now: Date; onChange: (name: string) => void }) {
  const rooms = useApi('rooms', listRooms);
  const room = useMemo(() => {
    if (!roomName || !rooms.data) return null;
    const key = normalizeSearchText(roomName);
    return rooms.data.find((r) => normalizeSearchText(r.name) === key) ?? null;
  }, [roomName, rooms.data]);

  const schedule = useApi(room ? `sala|${room.id}` : null, () => getRoomSchedule(room!.id));
  const sessions = useMemo(() => (schedule.data?.days ?? []).flatMap((d) => d.sessions), [schedule.data]);
  const now_ = room && schedule.data ? statusNow(sessions, now) : null;

  if (rooms.error) return <ErrorBlock error={rooms.error} onRetry={rooms.reload} />;
  if (!rooms.data) return <LoadingBlock slow={rooms.slow} lines={2} />;

  return (
    <div>
      <div className="mx-auto max-w-xl">
        <RoomPicker rooms={rooms.data} value={room?.name ?? null} onChange={onChange} />
      </div>

      {roomName && !room && (
        <div className="mx-auto mt-4 max-w-xl">
          <EmptyBlock title={`Não achamos "${roomName}" na grade atual`} hint="Escolha uma sala na lista acima." />
        </div>
      )}

      {!room && !roomName && (
        <div className="mx-auto mt-4 max-w-xl">
          <EmptyBlock title="Escolha uma sala para ver a semana dela" hint="Você também pode tocar em uma sala na aba Salas livres." />
        </div>
      )}

      {room && (
        <div className="mt-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              <h2 className="text-xl font-bold leading-tight text-texto-principal">{room.name}</h2>
              {placeText(room.name) && <p className="text-sm text-texto-secundario">{placeText(room.name)}</p>}
              {now_ && (
                <p className={`mt-1 flex items-center gap-1.5 text-sm font-medium ${now_.busy ? 'text-amber-600' : 'text-emerald-600'}`}>
                  <span className={`h-2 w-2 rounded-full ${now_.busy ? 'bg-amber-500' : 'bg-emerald-500'}`} aria-hidden />
                  {now_.text}
                </p>
              )}
            </div>
            <RouteLink roomName={room.name} />
          </div>

          {schedule.error ? (
            <ErrorBlock error={schedule.error} onRetry={schedule.reload} />
          ) : !schedule.data ? (
            <LoadingBlock slow={schedule.slow} />
          ) : (
            <WeekView sessions={sessions} show="classes" now={now} emptyDay="Sem aulas previstas. A sala fica livre o dia todo." />
          )}
        </div>
      )}
    </div>
  );
}
