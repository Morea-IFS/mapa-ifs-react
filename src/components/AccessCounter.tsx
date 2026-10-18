'use client';

/**
 * AccessCounter — Contador de Acessos (Versão Demo com localStorage)
 *
 * ─────────────────────────────────────────────────────────────────────────
 * COMO FUNCIONA (versão demo):
 *   • Ao montar, lê o valor atual do localStorage ("mero_pageviews")
 *   • Incrementa em +1 e salva de volta
 *   • Exibe o número com uma animação de contagem (count-up)
 *
 * VERSÃO PRODUÇÃO (futura):
 *   • O localStorage será substituído por uma chamada a POST /api/counter
 *   • O banco de dados (Vercel KV) armazena o total real de todos os usuários
 *   • Apenas essa parte muda — o visual e a animação ficam iguais
 * ─────────────────────────────────────────────────────────────────────────
 */

import { Eye } from 'lucide-react';
import { useEffect, useState } from 'react';

const STORAGE_KEY = 'mero_pageviews';

/** Anima um número de `from` até `to` em `duration` ms */
function useCountUp(target: number, duration = 1200) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (target === 0) return;

    const steps = 40;
    const stepTime = duration / steps;
    let current = Math.max(0, target - Math.floor(target * 0.15)); // começa em ~85% do valor
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
    // Lê o valor atual e incrementa (simulando um pageview)
    const stored = parseInt(localStorage.getItem(STORAGE_KEY) ?? '0', 10);
    const next = stored + 1;
    localStorage.setItem(STORAGE_KEY, String(next));
    setTotal(next);
  }, []);

  const displayed = useCountUp(total ?? 0);

  if (total === null) return null; // evita hydration mismatch

  return (
    <div
      className="flex items-center gap-2 text-[11px] text-texto-auxiliar"
      title="Total de pageviews registrados"
    >
      <span className="flex items-center gap-1.5 bg-destaque-fraco border border-destaque/20 rounded-full px-3 py-1 backdrop-blur-sm transition-all duration-300 hover:border-destaque/40 hover:bg-destaque-fraco">
        <Eye
          size={11}
          className="text-destaque shrink-0"
          aria-hidden
        />
        <span className="font-mono font-semibold text-destaque tabular-nums">
          {displayed.toLocaleString('pt-BR')}
        </span>
        <span className="text-texto-auxiliar ml-0.5">acessos</span>
      </span>
    </div>
  );
}
