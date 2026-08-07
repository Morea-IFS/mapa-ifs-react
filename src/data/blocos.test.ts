import { blocos, getBlocoById } from './blocos'; // Ajuste o caminho de importação se necessário

describe('Validação da Estrutura de Dados dos Blocos (blocos.ts)', () => {

  test('Deve conter exatamente os 8 blocos cadastrados (A ao H)', () => {
    expect(blocos).toHaveLength(8);
    const ids = blocos.map((b) => b.id);
    expect(ids).toEqual(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']);
  });

  test('Todos os blocos devem ter propriedades obrigatórias preenchidas', () => {
    blocos.forEach((bloco) => {
      expect(bloco.id).toBeTruthy();
      expect(bloco.name).toBeTruthy();
      expect(bloco.description).toBeTruthy();
      expect(bloco.color).toMatch(/^#[0-9a-fA-F]{6}$/); 
      expect(bloco.mapPosition).toBeDefined();
      expect(bloco.floors.length).toBeGreaterThan(0);
    });
  });

  test('Todas as salas dentro dos andares devem possuir código e nome', () => {
    blocos.forEach((bloco) => {
      bloco.floors.forEach((floor) => {
        expect(floor.name).toBeTruthy();
        expect(floor.image).toBeDefined();
        expect(floor.rooms.length).toBeGreaterThan(0);

        floor.rooms.forEach((room) => {
          expect(room.code).toBeTruthy();
          expect(room.name).toBeTruthy();
        });
      });
    });
  });

  describe('Função helper getBlocoById', () => {
    test('Deve retornar o bloco correto independente de letras maiúsculas/minúsculas', () => {
      const blocoA = getBlocoById('A');
      const blocoa = getBlocoById('a');
      const blocoB = getBlocoById('B');

      expect(blocoA).toBeDefined();
      expect(blocoA?.name).toBe('Bloco A');
      expect(blocoa).toEqual(blocoA);
      expect(blocoB?.name).toBe('Bloco B');
    });

    test('Deve retornar undefined para IDs inexistentes', () => {
      const resultado = getBlocoById('Z');
      expect(resultado).toBeUndefined();
    });
  });
});