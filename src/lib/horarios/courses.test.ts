import type { ClassInfo } from './api';
import { classChipLabel, groupClasses, shiftLabel } from './courses';
import { cardText } from './text';

const c = (code: string, course: string, period: number | null, shift: ClassInfo['shift'] = null, optional = false): ClassInfo => ({ code, course, period, shift, optional, sessionCount: 1 });

describe('turmas', () => {
  it('agrupa por curso, ordena períodos e deixa optativas por último', () => {
    const groups = groupClasses([c('OPTATIVAS BSI', 'BSI', null, null, true), c('2º BSI-N', 'BSI', 2, 'N'), c('10º AU', 'AU', 10), c('1º BSI-N', 'BSI', 1, 'N'), c('9º AU', 'AU', 9)]);
    expect(groups.map((g) => g.course)).toEqual(['AU', 'BSI']);
    expect(groups[0].classes.map((x) => x.code)).toEqual(['9º AU', '10º AU']);
    expect(groups[1].classes.map((x) => x.code)).toEqual(['1º BSI-N', '2º BSI-N', 'OPTATIVAS BSI']);
    expect(groups[1].label).toBe('Sistemas de Informação');
  });

  it('Optativas COAU entram no grupo AU; siglas sem nome conhecido ficam sem rótulo', () => {
    const groups = groupClasses([c('3º AU', 'AU', 3), c('OPTATIVAS COAU', 'COAU', null, null, true), c('1º IRC-V', 'IRC', 1, 'V')]);
    expect(groups.find((g) => g.course === 'AU')!.classes.map((x) => x.code)).toEqual(['3º AU', 'OPTATIVAS COAU']);
    expect(groups.find((g) => g.course === 'COAU')).toBeUndefined();
    expect(groups.find((g) => g.course === 'IRC')!.label).toBeNull();
  });

  it('rótulos dos botões e do turno', () => {
    expect(classChipLabel(c('3º BSI-N', 'BSI', 3, 'N'))).toBe('3º');
    expect(classChipLabel(c('OPTATIVAS BSI', 'BSI', null, null, true))).toBe('Optativas');
    expect(shiftLabel('N')).toBe('noturno');
    expect(shiftLabel('V')).toBe('vespertino');
    expect(shiftLabel(null)).toBeNull();
  });
});

describe('texto do card', () => {
  it('tira a linha da turma e separa título e detalhes', () => {
    expect(cardText(['Projeto arquitetônico I', '3° AU', 'Flávia Saldanha'], ['3º AU'])).toEqual({ title: 'Projeto arquitetônico I', details: ['Flávia Saldanha'] });
  });
  it('card sem turma (projeto, monitoria)', () => {
    expect(cardText(['Olimpíada de Química', 'PROJETO DE ENSINO', 'Luís Fabrício / Karine Oliveira'], [])).toEqual({
      title: 'Olimpíada de Química', details: ['PROJETO DE ENSINO', 'Luís Fabrício / Karine Oliveira'],
    });
  });
  it('card só com título', () => {
    expect(cardText(['Materiais de Construção'], [])).toEqual({ title: 'Materiais de Construção', details: [] });
  });
  it('mantém "Grupo 1 Sérgio Souza" e ignora variações do símbolo da turma', () => {
    expect(cardText(['Topografia', '2º IEDF-V', 'Grupo 2 Glacielle Fernandes'], ['2º IEDF-V'])).toEqual({ title: 'Topografia', details: ['Grupo 2 Glacielle Fernandes'] });
    expect(cardText(['Prática', '8 ° AU', 'Fulano'], ['8º AU']).details).toEqual(['Fulano']);
  });
});
