import { parseState, toSearch, toStored } from './viewState';

describe('estado da página de horários', () => {
  it('começa em "salas livres" sem nada salvo', () => {
    expect(parseState('', null)).toEqual({ view: 'livres', sala: null, turma: null, q: '' });
  });

  it('a URL vale mais que o salvo', () => {
    const saved = toStored({ view: 'turma', sala: null, turma: '2º BSI-N', q: '' });
    expect(parseState('?aba=sala&sala=SALA%2001-BL02-S', saved)).toMatchObject({ view: 'sala', sala: 'SALA 01-BL02-S', turma: '2º BSI-N' });
  });

  it('volta para onde o usuário parou', () => {
    const saved = toStored({ view: 'turma', sala: null, turma: '3º BSI-N', q: '' });
    expect(parseState('', saved)).toMatchObject({ view: 'turma', turma: '3º BSI-N' });
  });

  it('um link só com sala, turma ou busca abre a aba certa', () => {
    expect(parseState('?sala=LABIC', null).view).toBe('sala');
    expect(parseState('?turma=1%C2%BA%20AU', null)).toMatchObject({ view: 'turma', turma: '1º AU' });
    expect(parseState('?q=f%C3%ADsica', null)).toMatchObject({ view: 'busca', q: 'física' });
  });

  it('ignora lixo: aba inválida e JSON quebrado', () => {
    expect(parseState('?aba=xyz', '{quebrado').view).toBe('livres');
    expect(parseState('', JSON.stringify({ view: 'xyz', turma: 5 }))).toEqual({ view: 'livres', sala: null, turma: null, q: '' });
  });

  it('gera a URL só com o que importa', () => {
    expect(toSearch({ view: 'livres', sala: 'X', turma: 'Y', q: 'z' })).toBe('');
    expect(toSearch({ view: 'sala', sala: 'SALA 01-BL02-S', turma: '3º BSI-N', q: '' })).toBe('?aba=sala&sala=SALA+01-BL02-S');
    expect(toSearch({ view: 'turma', sala: null, turma: '3º BSI-N', q: '' })).toBe('?aba=turma&turma=3%C2%BA+BSI-N');
    expect(toSearch({ view: 'busca', sala: null, turma: null, q: 'física' })).toMatch(/^\?aba=busca&q=f/);
  });

  it('ida e volta mantém a turma com o símbolo º', () => {
    const s = { view: 'turma' as const, sala: null, turma: '3º BSI-N', q: '' };
    expect(parseState(toSearch(s), null)).toEqual(s);
  });
});
