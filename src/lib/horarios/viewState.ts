export type View = 'livres' | 'sala' | 'turma' | 'busca';
export interface ViewState { view: View; sala: string | null; turma: string | null; q: string }

const VIEWS: View[] = ['livres', 'sala', 'turma', 'busca'];
export const STORAGE_KEY = 'mero:horarios';
const isView = (v: unknown): v is View => typeof v === 'string' && (VIEWS as string[]).includes(v);

/** Lê o estado inicial: o que estiver na URL vale mais; depois o que ficou salvo no aparelho. */
export function parseState(search: string, saved: string | null): ViewState {
  let stored: Partial<ViewState> = {};
  try { stored = saved ? (JSON.parse(saved) as Partial<ViewState>) : {}; } catch { stored = {}; }
  const p = new URLSearchParams(search);
  const aba = p.get('aba');
  const sala = p.get('sala') ?? (typeof stored.sala === 'string' ? stored.sala : null);
  const turma = p.get('turma') ?? (typeof stored.turma === 'string' ? stored.turma : null);
  const q = p.get('q') ?? '';
  const view: View = isView(aba) ? aba : p.has('sala') ? 'sala' : p.has('turma') ? 'turma' : p.has('q') ? 'busca' : isView(stored.view) ? stored.view : 'livres';
  return { view, sala, turma, q };
}

/** Parâmetros da URL (só o que não é padrão), para o link da página poder ser compartilhado. */
export function toSearch(s: ViewState): string {
  const p = new URLSearchParams();
  if (s.view !== 'livres') p.set('aba', s.view);
  if (s.view === 'sala' && s.sala) p.set('sala', s.sala);
  if (s.view === 'turma' && s.turma) p.set('turma', s.turma);
  if (s.view === 'busca' && s.q) p.set('q', s.q);
  const out = p.toString();
  return out ? `?${out}` : '';
}

export const toStored = (s: ViewState): string => JSON.stringify({ view: s.view, sala: s.sala, turma: s.turma });
