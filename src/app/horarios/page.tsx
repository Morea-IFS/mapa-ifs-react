'use client';

import dynamic from 'next/dynamic';

// Carregado só no navegador: o estado inicial vem da URL, do aparelho e da hora atual.
const HorariosApp = dynamic(() => import('@/components/horarios/HorariosApp'), {
  ssr: false,
  loading: () => (
    <div className="mx-auto flex min-h-screen max-w-300 items-start justify-center p-8 pt-32 text-sm text-texto-auxiliar" role="status">
      Carregando horários…
    </div>
  ),
});

export default function HorariosPage() {
  return <HorariosApp />;
}
