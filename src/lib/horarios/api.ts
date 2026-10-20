/**
 * Cliente da MERO Horários API (https://github.com/.../mero-horarios-api).
 * A URL base vem de NEXT_PUBLIC_HORARIOS_API_URL (padrão: API local).
 * Respostas ficam em cache por alguns minutos para poupar o limite de requisições da API
 * (na rede do campus muita gente sai pelo mesmo IP).
 */
export const API_BASE = (process.env.NEXT_PUBLIC_HORARIOS_API_URL || 'http://localhost:3000/api/v1').replace(/\/+$/, '');

export type ApiErrorKind = 'offline' | 'not-ready' | 'rate-limit' | 'invalid' | 'server';

export class HorariosApiError extends Error {
  constructor(public readonly kind: ApiErrorKind, public readonly status: number | null, message: string) {
    super(message);
    this.name = 'HorariosApiError';
  }
}

export type SessionKind = 'CLASS' | 'TEACHING_PROJECT' | 'EXTENSION' | 'MONITORING' | 'OTHER';

export interface Room { id: string; name: string }
export interface Session {
  weekday: number; // 1 = segunda ... 5 = sexta
  startPeriod: string;
  endPeriod: string;
  startTime: string; // HH:mm
  endTime: string;
  kind: SessionKind;
  classCodes: string[];
  lines: string[];
}
export interface SessionWithRoom extends Session { room: Room }
export interface RoomSchedule { room: Room; semester: string; days: { weekday: number; name: string; sessions: Session[] }[] }
export interface AvailabilityItem {
  room: Room;
  free: boolean;
  /** HH:mm da próxima aula (só salas livres); null = livre o resto do dia. */
  freeUntil: string | null;
  conflicts: { startTime: string; endTime: string; label: string }[];
}
export interface Availability {
  query: { date: string; weekday: number; start: string; end: string };
  semester: string;
  notice: string;
  data: AvailabilityItem[];
}
export interface ClassInfo {
  code: string;
  course: string;
  period: number | null;
  shift: 'V' | 'N' | null;
  optional: boolean;
  sessionCount: number;
}
export interface Period { code: string; startTime: string; endTime: string }
export interface PageMeta { page: number; pageSize: number; total: number; totalPages: number }
export interface SessionsPage { semester: string; data: SessionWithRoom[]; meta: PageMeta }

type Params = Record<string, string | number | boolean | undefined>;

const TTL_MS = 5 * 60_000;
const TIMEOUT_MS = 45_000; // o plano gratuito do Render "dorme" e a 1ª requisição pode levar quase 1 min
const cache = new Map<string, { at: number; value: unknown }>();
const inflight = new Map<string, Promise<unknown>>();

export function clearHorariosCache(): void {
  cache.clear();
  inflight.clear();
}

export function buildUrl(path: string, params: Params = {}): string {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) if (v !== undefined && v !== '') qs.set(k, String(v));
  const s = qs.toString();
  return `${API_BASE}${path}${s ? `?${s}` : ''}`;
}

function kindFor(status: number): ApiErrorKind {
  if (status === 503) return 'not-ready';
  if (status === 429) return 'rate-limit';
  if (status === 400 || status === 422 || status === 404) return 'invalid';
  return 'server';
}

async function doFetch<T>(url: string): Promise<T> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  let res: Response;
  try {
    res = await fetch(url, { headers: { accept: 'application/json' }, signal: ctrl.signal });
  } catch {
    throw new HorariosApiError('offline', null, 'Não foi possível falar com a API de horários.');
  } finally {
    clearTimeout(timer);
  }
  if (!res.ok) throw new HorariosApiError(kindFor(res.status), res.status, `A API respondeu ${res.status}.`);
  try {
    return (await res.json()) as T;
  } catch {
    throw new HorariosApiError('server', res.status, 'Resposta inválida da API.');
  }
}

export async function request<T>(path: string, params: Params = {}): Promise<T> {
  const url = buildUrl(path, params);
  const hit = cache.get(url);
  if (hit && Date.now() - hit.at < TTL_MS) return hit.value as T;
  const pending = inflight.get(url);
  if (pending) return pending as Promise<T>;
  const p = doFetch<T>(url)
    .then((value) => {
      cache.set(url, { at: Date.now(), value });
      return value;
    })
    .finally(() => inflight.delete(url));
  inflight.set(url, p);
  return p;
}

export async function listRooms(): Promise<Room[]> {
  const res = await request<{ data: Room[] }>('/rooms', { pageSize: 100 });
  return res.data.map((r) => ({ id: r.id, name: r.name }));
}
export const getRoomSchedule = (roomId: string) => request<RoomSchedule>(`/rooms/${encodeURIComponent(roomId)}/schedule`);
export const getAvailability = (p: { date: string; start: string; end: string }) =>
  request<Availability>('/availability', { ...p, pageSize: 100 });
export async function listClasses(): Promise<ClassInfo[]> {
  return (await request<{ data: ClassInfo[] }>('/classes')).data;
}
export const getPeriods = () => request<{ semester: string; data: Period[] }>('/periods');
export async function listPeriods(): Promise<Period[]> {
  return (await getPeriods()).data;
}
export const searchSessions = (p: { q?: string; classCode?: string; weekday?: number; page?: number; pageSize?: number }) =>
  request<SessionsPage>('/sessions', p);

/** Mensagem amigável para cada tipo de erro. */
export function describeError(e: unknown): { title: string; hint: string } {
  const kind = e instanceof HorariosApiError ? e.kind : 'server';
  switch (kind) {
    case 'offline':
      return { title: 'Sem conexão com a API de horários', hint: 'Verifique sua internet e tente de novo. Se o problema continuar, o serviço pode estar fora do ar.' };
    case 'not-ready':
      return { title: 'Horários ainda não disponíveis', hint: 'A grade do semestre ainda não foi importada. Tente novamente mais tarde.' };
    case 'rate-limit':
      return { title: 'Muitas consultas em pouco tempo', hint: 'Aguarde cerca de um minuto e tente de novo.' };
    case 'invalid':
      return { title: 'Não encontramos isso', hint: 'A consulta não é válida ou a sala não existe mais na grade atual.' };
    default:
      return { title: 'Algo deu errado', hint: 'A API de horários respondeu com erro. Tente novamente em instantes.' };
  }
}
