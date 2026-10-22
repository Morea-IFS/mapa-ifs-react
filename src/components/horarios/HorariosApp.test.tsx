import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HorariosApp from './HorariosApp';
import { clearHorariosCache } from '@/lib/horarios/api';

const PERIODS = [
  { code: '1', startTime: '07:30', endTime: '08:20' }, { code: '2', startTime: '08:20', endTime: '09:10' },
  { code: '3', startTime: '09:10', endTime: '10:00' }, { code: '4', startTime: '10:10', endTime: '11:00' },
  { code: '7', startTime: '13:50', endTime: '14:40' },
];
const R1 = { id: 'r1', name: 'SALA 01-BL02-S' };
const R2 = { id: 'r2', name: 'LAB. FÍSICA BÁSICA' };
const ESP = { weekday: 1, startPeriod: '3', endPeriod: '4', startTime: '09:10', endTime: '11:00', kind: 'CLASS', classCodes: ['3º BSI-N'], lines: ['Língua Espanhola', '3º BSI-N', 'Fulana de Tal'] };

const body = (url: URL): unknown => {
  const p = url.pathname.replace('/api/v1', '');
  const q = url.searchParams;
  if (p === '/periods') return { semester: '2026.2', data: PERIODS };
  if (p === '/availability') {
    const busy = q.get('end') === '11:00'; // só a janela de dois períodos (3º e 4º) pega a aula das 09:10 às 11:00
    return {
      query: {}, semester: '2026.2', notice: 'Previsão baseada apenas na grade regular.',
      data: [
        { room: R1, free: !busy, freeUntil: busy ? null : '13:50', conflicts: busy ? [{ startTime: '09:10', endTime: '11:00', label: 'Língua Espanhola / 3º BSI-N' }] : [] },
        { room: R2, free: true, freeUntil: null, conflicts: [] },
      ],
    };
  }
  if (p === '/rooms') return { data: [R1, R2], meta: {} };
  if (p === '/rooms/r1/schedule') return { room: R1, semester: '2026.2', days: [{ weekday: 1, name: 'segunda-feira', sessions: [ESP] }] };
  if (p === '/classes') return { data: [
    { code: '3º BSI-N', course: 'BSI', period: 3, shift: 'N', optional: false, sessionCount: 1 },
    { code: '1º IRC-V', course: 'IRC', period: 1, shift: 'V', optional: false, sessionCount: 1 },
  ] };
  if (p === '/sessions') {
    const all = [{ ...ESP, room: R1 }];
    const hit = q.get('classCode') ? all.filter((s) => s.classCodes.includes(q.get('classCode')!)) : q.get('q') === 'espanhola' ? all : [];
    return { semester: '2026.2', data: hit, meta: { total: hit.length } };
  }
  return {};
};

describe('página de horários', () => {
  const calls: string[] = [];
  beforeEach(() => {
    jest.useFakeTimers({
      doNotFake: ['setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'setImmediate', 'clearImmediate', 'nextTick', 'queueMicrotask', 'requestAnimationFrame', 'cancelAnimationFrame', 'performance'],
      now: new Date(2026, 9, 19, 9, 30), // segunda-feira, 09:30 (3º horário)
    });
    clearHorariosCache();
    calls.length = 0;
    window.localStorage.clear();
    window.history.replaceState(null, '', '/horarios');
    global.fetch = jest.fn(async (input: RequestInfo | URL) => {
      const url = new URL(String(input));
      calls.push(url.pathname.replace('/api/v1', '') + url.search);
      return { ok: true, status: 200, json: async () => body(url) } as Response;
    }) as unknown as typeof fetch;
  });
  afterEach(() => jest.useRealTimers());

  it('abre em "Salas livres" já no período atual e mostra até quando cada sala fica livre', async () => {
    render(<HorariosApp />);
    expect(await screen.findByText(/Livre até 13:50/)).toBeInTheDocument();
    expect(screen.getByText('Livre o resto do dia')).toBeInTheDocument();
    expect(screen.getByText(/Semestre 2026.2/)).toBeInTheDocument();
    expect(calls.some((c) => c.startsWith('/availability?date=2026-10-19&start=09%3A10&end=10%3A00'))).toBe(true); // 3º horário
    expect(screen.getByRole('button', { name: /^3/ })).toHaveAttribute('aria-pressed', 'true');
  });

  it('escolher dois períodos consulta o intervalo e mostra quem está ocupando a sala', async () => {
    const user = userEvent.setup();
    render(<HorariosApp />);
    await screen.findByText(/Livre até 13:50/);
    await user.click(screen.getByRole('button', { name: /^4/ })); // 3º -> 3º a 4º
    await waitFor(() => expect(calls.some((c) => c.includes('start=09%3A10&end=11%3A00'))).toBe(true));
    await user.click(screen.getByRole('button', { name: /Ocupadas/ }));
    expect(await screen.findByText(/das 09:10 às 11:00: Língua Espanhola/)).toBeInTheDocument();
    expect(screen.getByText(/\(3º–4º horário\)/)).toBeInTheDocument(); // resumo da janela escolhida
  });

  it('tocar numa sala abre a semana dela, com link para traçar a rota no mapa', async () => {
    const user = userEvent.setup();
    render(<HorariosApp />);
    await user.click(await screen.findByRole('button', { name: 'Ver a semana de SALA 01-BL02-S' }));
    const panel = await screen.findByRole('tabpanel', { name: 'Por sala' });
    expect(await within(panel).findByText('Língua Espanhola')).toBeInTheDocument();
    expect(within(panel).getByText('3º BSI-N')).toBeInTheDocument();
    expect(within(panel).getByText(/Em uso agora, até 11:00/)).toBeInTheDocument();
    expect(within(panel).getByRole('link', { name: 'Traçar rota até SALA 01-BL02-S' })).toHaveAttribute('href', '/?destino=S_B07');
    expect(window.location.search).toBe('?aba=sala&sala=SALA+01-BL02-S');
  });

  it('por turma: escolhe curso e período, mostra a próxima aula e a sala', async () => {
    const user = userEvent.setup();
    render(<HorariosApp />);
    await user.click(screen.getByRole('tab', { name: /Por turma/ }));
    await user.click(await screen.findByRole('button', { name: 'BSI' }));
    await user.click(screen.getByRole('button', { name: '3º BSI-N' }));
    const next = await screen.findByRole('region', { name: 'Próxima aula' });
    expect(within(next).getByText('Acontecendo agora')).toBeInTheDocument();
    expect(within(next).getByText('SALA 01-BL02-S')).toBeInTheDocument();
    expect(JSON.parse(window.localStorage.getItem('mero:horarios')!)).toMatchObject({ view: 'turma', turma: '3º BSI-N' });
  });

  it('lembra a turma e a aba na próxima visita', async () => {
    window.localStorage.setItem('mero:horarios', JSON.stringify({ view: 'turma', sala: null, turma: '3º BSI-N' }));
    render(<HorariosApp />);
    expect(await screen.findByRole('region', { name: 'Próxima aula' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Por turma/ })).toHaveAttribute('aria-selected', 'true');
  });

  it('buscar aula: digita, espera a pausa e lista os resultados', async () => {
    const user = userEvent.setup();
    render(<HorariosApp />);
    await user.click(screen.getByRole('tab', { name: /Buscar aula/ }));
    await user.type(await screen.findByRole('searchbox', { name: 'Buscar aula' }), 'espanhola');
    expect(await screen.findByText('1 aula encontrada')).toBeInTheDocument();
    expect(screen.getByText(/Segunda-feira, 3º–4º horários/)).toBeInTheDocument();
    expect(calls.filter((c) => c.startsWith('/sessions')).length).toBe(1); // um pedido só, depois da pausa
  });

  it('busca sem resultado explica o que fazer', async () => {
    const user = userEvent.setup();
    render(<HorariosApp />);
    await user.click(screen.getByRole('tab', { name: /Buscar aula/ }));
    await user.type(await screen.findByRole('searchbox', { name: 'Buscar aula' }), 'zzzz');
    expect(await screen.findByText(/Nada encontrado para "zzzz"/)).toBeInTheDocument();
  });

  it('mostra erro com botão de tentar de novo quando a API está fora', async () => {
    (global.fetch as jest.Mock).mockImplementation(async () => { throw new TypeError('Failed to fetch'); });
    render(<HorariosApp />);
    expect(await screen.findByText('Sem conexão com a API de horários')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Tentar de novo/ })).toBeInTheDocument();
  });
});
