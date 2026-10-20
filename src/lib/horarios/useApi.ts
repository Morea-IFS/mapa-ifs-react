'use client';

import { useCallback, useEffect, useState } from 'react';
import { HorariosApiError } from './api';

type Result<T> = { key: string; data: T | null; error: HorariosApiError | null };

/**
 * Busca assíncrona com chave. Mantém o dado anterior enquanto carrega a nova consulta
 * (a tela não "pisca") e avisa quando a API demora (servidor acordando).
 * `key` identifica a consulta; passe null para não buscar.
 */
export function useApi<T>(key: string | null, fetcher: () => Promise<T>) {
  const [result, setResult] = useState<Result<T> | null>(null);
  const [slowKey, setSlowKey] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (key === null) return;
    let cancelled = false;
    const timer = setTimeout(() => { if (!cancelled) setSlowKey(key); }, 4000);
    fetcher()
      .then((data) => { if (!cancelled) setResult({ key, data, error: null }); })
      .catch((e: unknown) => {
        if (!cancelled) setResult({ key, data: null, error: e instanceof HorariosApiError ? e : new HorariosApiError('server', null, String(e)) });
      })
      .finally(() => clearTimeout(timer));
    return () => { cancelled = true; clearTimeout(timer); };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- a consulta é identificada por `key`
  }, [key, tick]);

  const reload = useCallback(() => setTick((t) => t + 1), []);
  const settled = result !== null && result.key === key;
  const loading = key !== null && !settled;
  return {
    data: result?.data ?? null,
    error: settled ? result.error : null,
    loading,
    slow: loading && slowKey === key,
    reload,
  };
}
