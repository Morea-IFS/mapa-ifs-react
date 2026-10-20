import type { SessionKind } from './api';

const norm = (s: string) =>
  s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().replace(/(\d)\s*[º°]\s*-?\s*/g, '$1º ').replace(/\s+/g, ' ').trim();

/**
 * O card do PDF traz disciplina, turma e docente em linhas. A turma já aparece como etiqueta,
 * então sai do texto; a primeira linha restante é o título e as demais são detalhes (docente etc.).
 */
export function cardText(lines: string[], classCodes: string[]): { title: string; details: string[] } {
  const codes = new Set(classCodes);
  const rest = lines.map((l) => l.trim()).filter((l) => l && !codes.has(norm(l)));
  return { title: rest[0] ?? lines[0] ?? '', details: rest.slice(1) };
}

export const KIND_LABEL: Record<SessionKind, string | null> = {
  CLASS: null,
  MONITORING: 'Monitoria',
  TEACHING_PROJECT: 'Projeto de ensino',
  EXTENSION: 'Extensão',
  OTHER: null,
};
