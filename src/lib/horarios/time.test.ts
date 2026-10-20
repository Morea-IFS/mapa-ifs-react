import { currentOrNextPeriod, dateLabel, defaultFreeWindow, defaultWeekday, isNow, isoDate, nextSchoolDay, nextSession, periodsLabel, toHHmm, toMinutes, weekdayOf } from './time';

const PERIODS = [
  { code: '1', startTime: '07:30', endTime: '08:20' },
  { code: '2', startTime: '08:20', endTime: '09:10' },
  { code: '3', startTime: '09:10', endTime: '10:00' },
  { code: '7', startTime: '13:50', endTime: '14:40' },
];
// 2026-10-19 é segunda-feira
const at = (iso: string, h: number, m = 0) => new Date(`${iso}T00:00:00`.replace('T00:00:00', `T${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`));

describe('horários', () => {
  it('converte HH:mm e minutos', () => {
    expect(toMinutes('09:20')).toBe(560);
    expect(toHHmm(560)).toBe('09:20');
    expect(toHHmm(0)).toBe('00:00');
  });

  it('dia da semana e data local', () => {
    expect(weekdayOf(new Date(2026, 9, 19))).toBe(1);
    expect(weekdayOf(new Date(2026, 9, 25))).toBe(7);
    expect(isoDate(new Date(2026, 0, 5))).toBe('2026-01-05');
  });

  it('fim de semana vira segunda; dia útil não muda', () => {
    expect(isoDate(nextSchoolDay(new Date(2026, 9, 24)))).toBe('2026-10-26'); // sábado
    expect(isoDate(nextSchoolDay(new Date(2026, 9, 25)))).toBe('2026-10-26'); // domingo
    expect(isoDate(nextSchoolDay(new Date(2026, 9, 21)))).toBe('2026-10-21');
    expect(defaultWeekday(new Date(2026, 9, 24))).toBe(1);
    expect(defaultWeekday(new Date(2026, 9, 23))).toBe(5);
  });

  it('rótulos', () => {
    expect(dateLabel('2026-10-19')).toBe('Seg, 19/10');
    expect(dateLabel('2026-10-24')).toBe('Sáb, 24/10');
    expect(periodsLabel('3', '4')).toBe('3º–4º');
    expect(periodsLabel('5,5', '5,5')).toBe('5,5º');
  });

  it('período atual, próximo ou nenhum', () => {
    expect(currentOrNextPeriod(PERIODS, toMinutes('08:30'))).toMatchObject({ status: 'now', period: { code: '2' } });
    expect(currentOrNextPeriod(PERIODS, toMinutes('08:20'))).toMatchObject({ status: 'now', period: { code: '2' } }); // fim exclusivo
    expect(currentOrNextPeriod(PERIODS, toMinutes('11:00'))).toMatchObject({ status: 'next', period: { code: '7' } });
    expect(currentOrNextPeriod(PERIODS, toMinutes('07:00'))).toMatchObject({ status: 'next', period: { code: '1' } });
    expect(currentOrNextPeriod(PERIODS, toMinutes('15:00'))).toBeNull();
  });

  const S = [
    { weekday: 1, startTime: '07:30', endTime: '09:10', id: 'a' },
    { weekday: 1, startTime: '13:50', endTime: '15:30', id: 'b' },
    { weekday: 3, startTime: '09:10', endTime: '11:00', id: 'c' },
  ];

  it('aula em andamento', () => {
    expect(isNow(S[0], at('2026-10-19', 8, 0))).toBe(true);
    expect(isNow(S[0], at('2026-10-19', 9, 10))).toBe(false); // fim exclusivo
    expect(isNow(S[0], at('2026-10-20', 8, 0))).toBe(false); // outro dia
  });

  it('próxima aula: agora, mais tarde hoje, outro dia e volta para a semana seguinte', () => {
    expect(nextSession(S, at('2026-10-19', 8, 0))).toMatchObject({ status: 'now', session: { id: 'a' }, daysAhead: 0 });
    expect(nextSession(S, at('2026-10-19', 10, 0))).toMatchObject({ status: 'next', session: { id: 'b' }, daysAhead: 0 });
    expect(nextSession(S, at('2026-10-19', 16, 0))).toMatchObject({ status: 'next', session: { id: 'c' }, daysAhead: 2 });
    expect(nextSession(S, at('2026-10-23', 10, 0))).toMatchObject({ status: 'next', session: { id: 'a' }, daysAhead: 3 }); // sexta -> segunda
    expect(nextSession([], new Date())).toBeNull();
  });

  it('janela inicial de salas livres', () => {
    expect(defaultFreeWindow(PERIODS, at('2026-10-19', 8, 30))).toEqual({ date: '2026-10-19', start: '08:20', end: '09:10', status: 'now' });
    expect(defaultFreeWindow(PERIODS, at('2026-10-19', 11, 0))).toEqual({ date: '2026-10-19', start: '13:50', end: '14:40', status: 'next' });
    expect(defaultFreeWindow(PERIODS, at('2026-10-19', 22, 0))).toEqual({ date: '2026-10-20', start: '07:30', end: '08:20', status: 'tomorrow' });
    expect(defaultFreeWindow(PERIODS, at('2026-10-23', 22, 0))).toMatchObject({ date: '2026-10-26', status: 'tomorrow' }); // sexta à noite -> segunda
    expect(defaultFreeWindow(PERIODS, at('2026-10-24', 10, 0))).toMatchObject({ date: '2026-10-26', status: 'tomorrow' }); // sábado
    expect(defaultFreeWindow([], new Date())).toBeNull();
  });
});
