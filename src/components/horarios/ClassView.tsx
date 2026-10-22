'use client';

import { useMemo, useState } from 'react';
import { GraduationCap } from 'lucide-react';
import { listClasses, searchSessions } from '@/lib/horarios/api';
import { useApi } from '@/lib/horarios/useApi';
import { classChipLabel, groupClasses, shiftLabel } from '@/lib/horarios/courses';
import { cardText } from '@/lib/horarios/text';
import { nextSession, WEEKDAYS_LONG } from '@/lib/horarios/time';
import { Chip, EmptyBlock, ErrorBlock, LoadingBlock } from './ui';
import { placeText, RouteLink } from './RoomName';
import WeekView from './WeekView';

export default function ClassView({ turma, now, onChange }: { turma: string | null; now: Date; onChange: (code: string) => void }) {
  const classes = useApi('classes', listClasses);
  const groups = useMemo(() => groupClasses(classes.data ?? []), [classes.data]);
  const selected = classes.data?.find((c) => c.code === turma) ?? null;
  const selectedCourse = groups.find((g) => g.classes.some((c) => c.code === turma))?.course ?? null;
  const [pickedCourse, setPickedCourse] = useState<string | null>(null);
  const course = pickedCourse ?? selectedCourse;
  const group = groups.find((g) => g.course === course) ?? null;

  const week = useApi(selected ? `turma|${selected.code}` : null, () => searchSessions({ classCode: selected!.code, pageSize: 100 }));
  const sessions = useMemo(() => week.data?.data ?? [], [week.data]);
  const upcoming = useMemo(() => nextSession(sessions, now), [sessions, now]);

  if (classes.error) return <ErrorBlock error={classes.error} onRetry={classes.reload} />;
  if (!classes.data) return <LoadingBlock slow={classes.slow} lines={2} />;

  const turnoLabel = group?.classes.find((c) => !c.optional)?.shift ? shiftLabel(group.classes.find((c) => !c.optional)!.shift) : null;

  return (
    <div>
      <section aria-label="Escolha da turma" className="mx-auto max-w-3xl rounded-2xl border border-borda bg-fundo-cartao p-4">
        <p className="mb-2 text-sm font-medium text-texto-principal">Curso</p>
        <div className="flex flex-wrap gap-2">
          {groups.map((g) => (
            <Chip key={g.course} active={course === g.course} onClick={() => setPickedCourse(g.course)} title={g.label ?? undefined}>
              {g.course}
            </Chip>
          ))}
        </div>
        {group && (
          <>
            <p className="mb-2 mt-4 text-sm font-medium text-texto-principal">
              {group.label ?? group.course}
              {turnoLabel && <span className="font-normal text-texto-secundario">, {turnoLabel}</span>}
            </p>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Período ou turma">
              {group.classes.map((c) => (
                <Chip key={c.code} active={turma === c.code} onClick={() => onChange(c.code)} aria-label={c.code} className="min-w-14">
                  {classChipLabel(c)}
                </Chip>
              ))}
            </div>
          </>
        )}
      </section>

      {!selected && (
        <div className="mx-auto mt-4 max-w-3xl">
          <EmptyBlock title="Escolha seu curso e período" hint="Mostramos a sua semana de aulas, com a sala de cada uma. A escolha fica salva neste aparelho." />
        </div>
      )}

      {selected && (
        <div className="mt-5">
          <h2 className="mb-3 flex items-center gap-2 text-xl font-bold text-texto-principal">
            <GraduationCap size={22} className="text-destaque" aria-hidden /> {selected.code}
          </h2>

          {week.error ? (
            <ErrorBlock error={week.error} onRetry={week.reload} />
          ) : !week.data ? (
            <LoadingBlock slow={week.slow} />
          ) : sessions.length === 0 ? (
            <EmptyBlock title="Nenhuma aula encontrada para essa turma" />
          ) : (
            <>
              {upcoming && (
                <section aria-label="Próxima aula" className="mb-5 rounded-2xl border border-destaque/40 bg-destaque/5 p-4">
                  <p className="text-sm font-medium text-destaque">
                    {upcoming.status === 'now' ? 'Acontecendo agora' : upcoming.daysAhead === 0 ? 'Próxima aula, hoje' : `Próxima aula, ${WEEKDAYS_LONG[upcoming.session.weekday - 1].toLowerCase()}`}
                  </p>
                  <p className="mt-1 text-lg font-semibold leading-snug text-texto-principal">{cardText(upcoming.session.lines, upcoming.session.classCodes).title}</p>
                  <div className="mt-2 flex items-center justify-between gap-3">
                    <div className="min-w-0 text-sm text-texto-secundario">
                      <p>{upcoming.session.startTime} às {upcoming.session.endTime}</p>
                      <p className="font-medium text-texto-principal">{upcoming.session.room.name}</p>
                      {placeText(upcoming.session.room.name) && <p className="text-xs text-texto-auxiliar">{placeText(upcoming.session.room.name)}</p>}
                    </div>
                    <RouteLink roomName={upcoming.session.room.name} />
                  </div>
                </section>
              )}
              <WeekView sessions={sessions} show="room" now={now} emptyDay="Sem aula neste dia." />
            </>
          )}
        </div>
      )}
    </div>
  );
}
