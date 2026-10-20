import type { ClassInfo } from './api';

/**
 * Nomes por extenso das siglas de curso. Só entram siglas com significado conhecido;
 * as demais aparecem pela própria sigla (complete aqui se quiser).
 */
export const COURSE_LABELS: Record<string, string> = {
  AU: 'Arquitetura e Urbanismo',
  BEE: 'Engenharia Elétrica',
  BSI: 'Sistemas de Informação',
  LFIS: 'Licenciatura em Física',
};

/** "Optativas COAU" (Coordenação de Arquitetura e Urbanismo) fica junto de AU. */
const COURSE_ALIAS: Record<string, string> = { COAU: 'AU' };

export interface CourseGroup { course: string; label: string | null; classes: ClassInfo[] }

export function groupClasses(classes: ClassInfo[]): CourseGroup[] {
  const groups = new Map<string, ClassInfo[]>();
  for (const c of classes) {
    const course = COURSE_ALIAS[c.course] ?? c.course;
    groups.set(course, [...(groups.get(course) ?? []), c]);
  }
  return [...groups.entries()]
    .map(([course, list]) => ({
      course,
      label: COURSE_LABELS[course] ?? null,
      classes: list.sort((a, b) => Number(a.optional) - Number(b.optional) || (a.period ?? 0) - (b.period ?? 0)),
    }))
    .sort((a, b) => a.course.localeCompare(b.course, 'pt-BR'));
}

/** Rótulo curto do botão da turma: "3º", "Optativas". */
export const classChipLabel = (c: ClassInfo): string => (c.optional ? 'Optativas' : c.period !== null ? `${c.period}º` : c.code);

export const shiftLabel = (s: ClassInfo['shift']): string | null => (s === 'V' ? 'vespertino' : s === 'N' ? 'noturno' : null);
