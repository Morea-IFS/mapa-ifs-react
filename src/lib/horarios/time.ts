import type { Period } from './api';

export const WEEKDAYS_SHORT = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex'] as const;
export const WEEKDAYS_LONG = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira'] as const;

export const toMinutes = (hhmm: string): number => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};
export const toHHmm = (min: number): string => `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`;
export const minutesOf = (d: Date): number => d.getHours() * 60 + d.getMinutes();

/** AAAA-MM-DD no fuso do aparelho. */
export const isoDate = (d: Date): string =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export const parseIso = (iso: string): Date => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
};

/** 1 = segunda ... 7 = domingo. */
export const weekdayOf = (d: Date): number => (d.getDay() === 0 ? 7 : d.getDay());

export const addDays = (d: Date, n: number): Date => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);

/** Sábado e domingo avançam para a segunda; dia útil continua o mesmo. */
export const nextSchoolDay = (d: Date): Date => (weekdayOf(d) === 6 ? addDays(d, 2) : weekdayOf(d) === 7 ? addDays(d, 1) : d);

/** "Seg, 19/10". */
export function dateLabel(iso: string): string {
  const d = parseIso(iso);
  const wd = weekdayOf(d);
  const name = wd <= 5 ? WEEKDAYS_SHORT[wd - 1] : wd === 6 ? 'Sáb' : 'Dom';
  return `${name}, ${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
}

/** "3º–4º" ou "3º". */
export const periodsLabel = (start: string, end: string): string => (start === end ? `${start}º` : `${start}º–${end}º`);

/** Dia útil para mostrar por padrão: hoje, ou segunda no fim de semana. */
export const defaultWeekday = (now: Date): number => Math.min(weekdayOf(nextSchoolDay(now)), 5);

/** Período em andamento (status "now") ou o próximo do dia (status "next"). Null depois do último. */
export function currentOrNextPeriod(periods: Period[], minutes: number): { period: Period; status: 'now' | 'next' } | null {
  for (const p of periods) {
    if (minutes >= toMinutes(p.startTime) && minutes < toMinutes(p.endTime)) return { period: p, status: 'now' };
    if (minutes < toMinutes(p.startTime)) return { period: p, status: 'next' };
  }
  return null;
}

type Timed = { weekday: number; startTime: string; endTime: string };

export const isNow = (s: Timed, now: Date): boolean =>
  s.weekday === weekdayOf(now) && minutesOf(now) >= toMinutes(s.startTime) && minutesOf(now) < toMinutes(s.endTime);

/** Aula em andamento ou a próxima da semana (volta para o começo da semana depois da última). */
export function nextSession<T extends Timed>(sessions: T[], now: Date): { session: T; status: 'now' | 'next'; daysAhead: number } | null {
  if (sessions.length === 0) return null;
  const wd = weekdayOf(now);
  const m = minutesOf(now);
  const sorted = [...sessions].sort((a, b) => a.weekday - b.weekday || toMinutes(a.startTime) - toMinutes(b.startTime));
  const current = sorted.find((s) => isNow(s, now));
  if (current) return { session: current, status: 'now', daysAhead: 0 };
  const upcoming = sorted.find((s) => s.weekday > wd || (s.weekday === wd && toMinutes(s.startTime) > m)) ?? sorted[0];
  return { session: upcoming, status: 'next', daysAhead: (upcoming.weekday - wd + 7) % 7 };
}

/**
 * Janela inicial de "salas livres": o período em andamento (ou o próximo) de hoje; fora do horário de aula
 * (fim de semana ou depois do último período) vai para o primeiro período do próximo dia útil.
 */
export function defaultFreeWindow(periods: Period[], now: Date): { date: string; start: string; end: string; status: 'now' | 'next' | 'tomorrow' } | null {
  if (periods.length === 0) return null;
  const isSchoolToday = weekdayOf(now) <= 5;
  if (isSchoolToday) {
    const cp = currentOrNextPeriod(periods, minutesOf(now));
    if (cp) return { date: isoDate(now), start: cp.period.startTime, end: cp.period.endTime, status: cp.status };
  }
  const day = nextSchoolDay(addDays(now, isSchoolToday ? 1 : 0));
  return { date: isoDate(day), start: periods[0].startTime, end: periods[0].endTime, status: 'tomorrow' };
}
