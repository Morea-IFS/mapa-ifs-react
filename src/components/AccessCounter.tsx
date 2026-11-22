'use client';

/**
 * AccessCounter — Contador de Acessos Global (CounterAPI)
 *
 * Usa https://api.counterapi.dev (gratuito, sem cadastro).
 * Cada visita incrementa um contador global compartilhado entre todos os usuários.
 * Se a API falhar (sem internet, limite etc.), exibe silenciosamente sem quebrar.
 */

import { Eye } from 'lucide-react';
import { useEffect, useState } from 'react';

const COUNTER_URL = 'https://api.counterapi.dev/v1/mapa-ifs-mero/visitas/up';
const LOCAL_KEY = 'mero_pageviews';

/** Anima um número de `from` até `to` em `duration` ms */
function useCountUp(target: number, duration = 1200) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (target === 0) return;

    const steps = 40;
    const stepTime = duration / steps;
    let current = Math.max(0, target - Math.floor(target * 0.15));
    const increment = (target - current) / steps;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setDisplay(target);
        clearInterval(timer);
      } else {
        setDisplay(Math.floor(current));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [target, duration]);

  return display;
}

export default function AccessCounter() {
  const [total, setTotal] = useState<number | null>(null);

  useEffect(() => {
    // Incrementa e salva localmente (fallback offline)
    const local = parseInt(localStorage.getItem(LOCAL_KEY) ?? '0', 10) + 1;
    localStorage.setItem(LOCAL_KEY, String(local));

    // Tenta buscar o total global pela CounterAPI
    fetch(COUNTER_URL)
      .then((res) => res.json())
      .then((data) => {
        if (typeof data?.count === 'number') {
          setTotal(data.count);
        } else {
          setTotal(local); // fallback: exibe o contador local
        }
      })
      .catch(() => {
        setTotal(local); // sem internet: exibe o contador local
      });
  }, []);

  const displayed = useCountUp(total ?? 0);

  if (total === null) return null;

  return (
    <div
      className="flex items-center gap-2 text-[11px] text-texto-auxiliar"
      title="Total de acessos ao MERO"
    >
      <span className="flex items-center gap-1.5 bg-destaque-fraco border border-destaque/20 rounded-full px-3 py-1 backdrop-blur-sm transition-all duration-300 hover:border-destaque/40">
        <Eye size={11} className="text-destaque shrink-0" aria-hidden />
        <span className="font-mono font-semibold text-destaque tabular-nums">
          {displayed.toLocaleString('pt-BR')}
        </span>
        <span className="text-texto-auxiliar ml-0.5">acessos</span>
      </span>
    </div>
  );
}

