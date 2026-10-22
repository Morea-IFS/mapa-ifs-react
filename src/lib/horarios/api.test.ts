import { HorariosApiError, buildUrl, clearHorariosCache, describeError, getAvailability, listRooms, request, searchSessions } from './api';

const ok = (body: unknown) => Promise.resolve({ ok: true, status: 200, json: async () => body } as Response);
const fail = (status: number) => Promise.resolve({ ok: false, status, json: async () => ({}) } as Response);

describe('cliente da API de horários', () => {
  const fetchMock = jest.fn();
  beforeEach(() => { fetchMock.mockReset(); clearHorariosCache(); global.fetch = fetchMock as unknown as typeof fetch; });

  it('monta a URL sem parâmetros vazios', () => {
    expect(buildUrl('/sessions', { q: 'física', page: 2, classCode: undefined, weekday: undefined })).toMatch(/\/sessions\?q=f%C3%ADsica&page=2$/);
    expect(buildUrl('/classes')).toMatch(/\/classes$/);
  });

  it('usa cache e junta consultas iguais em andamento', async () => {
    fetchMock.mockImplementation(() => ok({ data: [] }));
    await Promise.all([request('/classes'), request('/classes')]);
    await request('/classes');
    expect(fetchMock).toHaveBeenCalledTimes(1);
    await request('/classes', { x: 1 });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('classifica os erros', async () => {
    for (const [status, kind] of [[503, 'not-ready'], [429, 'rate-limit'], [400, 'invalid'], [404, 'invalid'], [500, 'server']] as const) {
      clearHorariosCache();
      fetchMock.mockImplementationOnce(() => fail(status));
      await expect(request('/x')).rejects.toMatchObject({ kind, status });
    }
    clearHorariosCache();
    fetchMock.mockImplementationOnce(() => Promise.reject(new TypeError('Failed to fetch')));
    await expect(request('/x')).rejects.toMatchObject({ kind: 'offline', status: null });
  });

  it('erro não fica em cache', async () => {
    fetchMock.mockImplementationOnce(() => fail(500)).mockImplementationOnce(() => ok({ data: [] }));
    await expect(request('/x')).rejects.toBeInstanceOf(HorariosApiError);
    await expect(request('/x')).resolves.toEqual({ data: [] });
  });

  it('listRooms pede 100 por página e devolve só id e nome', async () => {
    fetchMock.mockImplementation(() => ok({ data: [{ id: 'a', name: 'SALA 01', externalIds: [] }] }));
    expect(await listRooms()).toEqual([{ id: 'a', name: 'SALA 01' }]);
    expect(fetchMock.mock.calls[0][0]).toMatch(/\/rooms\?pageSize=100$/);
  });

  it('disponibilidade e busca repassam os parâmetros', async () => {
    fetchMock.mockImplementation(() => ok({}));
    await getAvailability({ date: '2026-10-19', start: '09:20', end: '11:00' });
    await searchSessions({ classCode: '3º BSI-N', pageSize: 100 });
    expect(fetchMock.mock.calls[0][0]).toMatch(/availability\?date=2026-10-19&start=09%3A20&end=11%3A00&pageSize=100/);
    expect(fetchMock.mock.calls[1][0]).toMatch(/sessions\?classCode=3%C2%BA\+BSI-N&pageSize=100/);
  });

  it('mensagens amigáveis por tipo de erro', () => {
    expect(describeError(new HorariosApiError('offline', null, '')).title).toMatch(/Sem conexão/);
    expect(describeError(new HorariosApiError('rate-limit', 429, '')).hint).toMatch(/minuto/);
    expect(describeError(new Error('x')).title).toMatch(/errado/);
  });
});
