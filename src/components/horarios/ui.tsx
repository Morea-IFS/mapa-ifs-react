'use client';

import { RefreshCw, WifiOff } from 'lucide-react';
import { describeError } from '@/lib/horarios/api';

/** Botão em forma de pílula, usado para escolher dia, período, curso, turma etc. */
export function Chip({
  active, onClick, children, className = '', ...rest
}: { active?: boolean; onClick?: () => void; children: React.ReactNode; className?: string } & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'>) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full border px-4 text-sm font-medium transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-destaque ${
        active
          ? 'border-destaque bg-destaque-fraco text-destaque'
          : 'border-borda bg-fundo-cartao text-texto-secundario hover:border-borda-hover hover:text-texto-principal'
      } ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

export function LoadingBlock({ slow, lines = 4 }: { slow?: boolean; lines?: number }) {
  return (
    <div role="status" aria-live="polite" className="flex flex-col gap-2">
      {Array.from({ length: lines }, (_, i) => (
        <div key={i} className="h-16 animate-pulse rounded-xl border border-borda bg-fundo-cartao" />
      ))}
      <p className="text-xs text-texto-auxiliar">
        {slow ? 'O servidor de horários estava em repouso e está acordando. Isso pode levar até 1 minuto na primeira consulta.' : 'Carregando…'}
      </p>
    </div>
  );
}

export function ErrorBlock({ error, onRetry }: { error: unknown; onRetry?: () => void }) {
  const { title, hint } = describeError(error);
  return (
    <div role="alert" className="flex flex-col items-start gap-3 rounded-xl border border-borda bg-fundo-cartao p-4">
      <div className="flex items-center gap-2 text-texto-principal">
        <WifiOff size={18} className="text-destaque" aria-hidden />
        <h3 className="text-[15px] font-semibold">{title}</h3>
      </div>
      <p className="text-sm text-texto-secundario">{hint}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-destaque px-4 text-sm font-medium text-destaque hover:bg-destaque-fraco focus:outline-none focus-visible:ring-2 focus-visible:ring-destaque"
        >
          <RefreshCw size={14} aria-hidden /> Tentar de novo
        </button>
      )}
    </div>
  );
}

export function EmptyBlock({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="rounded-xl border border-dashed border-borda p-5 text-center">
      <p className="text-[15px] font-medium text-texto-principal">{title}</p>
      {hint && <p className="mt-1 text-sm text-texto-secundario">{hint}</p>}
    </div>
  );
}

export const inputClass =
  'min-h-11 w-full rounded-xl border border-borda bg-fundo-principal px-3.5 text-base text-texto-principal placeholder:text-texto-auxiliar focus:border-destaque focus:outline-none focus:ring-1 focus:ring-destaque/50 md:text-sm';
