/** Normaliza termos para tornar a busca tolerante a acentos e pontuação. */
export function normalizeSearchText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt-BR')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

/**
 * Calcula uma pontuação de relevância para uma consulta e um nome.
 * Todos os termos da consulta precisam aparecer para que o resultado seja
 * considerado; termos em ordem e frases completas recebem pontuação maior.
 */
export function scoreRoomMatch(query: string, label: string): number {
  const normalizedQuery = normalizeSearchText(query);
  const normalizedLabel = normalizeSearchText(label);

  if (!normalizedQuery) return 1;
  if (!normalizedLabel) return 0;
  if (normalizedLabel === normalizedQuery) return 1000;
  if (normalizedLabel.startsWith(normalizedQuery)) return 850;
  if (normalizedLabel.includes(normalizedQuery)) return 750;

  const queryTokens = normalizedQuery.split(' ');
  const labelTokens = normalizedLabel.split(' ');
  const tokenPositions: number[] = [];
  let score = 0;

  for (const queryToken of queryTokens) {
    let bestScore = 0;
    let bestPosition = -1;

    labelTokens.forEach((labelToken, index) => {
      if (labelToken === queryToken) {
        if (bestScore < 12) {
          bestScore = 12;
          bestPosition = index;
        }
      } else if (labelToken.startsWith(queryToken) && bestScore < 7) {
        bestScore = 7;
        bestPosition = index;
      } else if (labelToken.includes(queryToken) && bestScore < 4) {
        bestScore = 4;
        bestPosition = index;
      }
    });

    if (bestScore === 0) return 0;
    score += bestScore;
    tokenPositions.push(bestPosition);
  }

  const inOrder = tokenPositions.every((position, index) =>
    index === 0 || position > tokenPositions[index - 1],
  );

  if (inOrder) score += 10;
  if (queryTokens.length > 1 && new Set(tokenPositions).size === queryTokens.length) {
    score += 5;
  }

  return score;
}
