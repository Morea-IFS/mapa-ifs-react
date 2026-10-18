import { normalizeSearchText, scoreRoomMatch } from './roomSearch';

describe('roomSearch', () => {
  test('normaliza acentos, maiúsculas e pontuação', () => {
    expect(normalizeSearchText('  LAB. Química  ')).toBe('lab quimica');
  });

  test('encontra Sala de Aula 2 ao pesquisar Sala 2', () => {
    expect(scoreRoomMatch('Sala 2', 'Sala de Aula 2')).toBeGreaterThan(0);
  });

  test('prioriza a correspondência exata', () => {
    expect(scoreRoomMatch('biblioteca', 'Biblioteca')).toBeGreaterThan(
      scoreRoomMatch('biblioteca', 'Entrada da biblioteca'),
    );
  });

  test('não retorna locais quando falta um termo pesquisado', () => {
    expect(scoreRoomMatch('sala inexistente', 'Sala de Aula 2')).toBe(0);
  });
});
