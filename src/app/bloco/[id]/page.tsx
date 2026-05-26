'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { getBlocoById } from '@/data/blocos';
import { ArrowLeft } from 'lucide-react';

export default function BlocoPage() {
  const params = useParams();
  const id = params.id as string;
  const bloco = id ? getBlocoById(id) : undefined;

  if (!bloco) {
    return (
      <motion.div
        className="min-h-screen flex flex-col items-center justify-center gap-3 text-texto-secundario"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h1 className="text-2xl font-bold text-texto-principal">Bloco não encontrado</h1>
        <p>O bloco &quot;{id}&quot; não existe no sistema.</p>
        <Link href="/" className="mt-3 text-destaque font-medium hover:opacity-80 transition-opacity">
          ← Voltar ao mapa
        </Link>
      </motion.div>
    );
  }

  const accentColor = bloco.color || 'var(--color-destaque)';
  const totalRooms = bloco.floors.reduce((acc, f) => acc + f.rooms.length, 0);

  return (
    <motion.div
      className="min-h-screen max-w-900px mx-auto p-4 md:p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <div className="text-center py-10 md:py-12 pb-8" style={{ '--local-accent': accentColor } as React.CSSProperties}>
        <Link href="/" className="inline-flex items-center gap-1 text-[13px] font-medium text-texto-muted hover:text-var(--local-accent) mb-5 transition-colors duration-150">
          <ArrowLeft size={16} /> Mapa
        </Link>
        <motion.h1
          className="text-3xl md:text-4xl font-bold tracking-tight mb-2.5"
          style={{ color: accentColor }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          {bloco.name}
        </motion.h1>
        <motion.p
          className="text-[0.95rem] text-texto-secundario max-w-150 mx-auto leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          {bloco.description}
        </motion.p>

        <motion.div
          className="flex gap-4 justify-center mt-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          <div className="flex items-center gap-1.5 px-4 py-2 bg-fundo-cartao border border-borda rounded-full font-medium text-[13px] shadow-sm">
            <span className="font-bold text-var(--local-accent)">{bloco.floors.length}</span>
            <span className="text-texto-auxiliar">{bloco.floors.length === 1 ? 'Andar' : 'Andares'}</span>
          </div>
          <div className="flex items-center gap-1.5 px-4 py-2 bg-fundo-cartao border border-borda rounded-full font-medium text-[13px] shadow-sm">
            <span className="font-bold text-var(--local-accent)">{totalRooms}</span>
            <span className="text-texto-auxiliar">Salas</span>
          </div>
        </motion.div>
      </div>

      {/* Floors */}
      <div className="flex flex-col gap-6 pb-16" role="region" aria-label={`Plantas do ${bloco.name}`}>
        {bloco.floors.map((floor, index) => (
          <motion.div
            key={floor.name}
            className="bg-fundo-cartao border border-borda hover:border-borda-hover rounded-2xl overflow-hidden transition-colors duration-250 shadow-sm"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.15, duration: 0.5 }}
            style={{ '--local-accent': accentColor } as React.CSSProperties}
          >
            <h2 className="text-base font-semibold text-var(--local-accent) pt-5 px-5 md:px-6 tracking-tight">
              {floor.name}
            </h2>

            <div className="flex flex-col md:flex-row gap-6 p-4 md:p-6 pb-6 items-start">
              <div className="flex-1 w-full min-w-0">
                {/* Image */}
                <div className="w-full rounded-xl border border-borda overflow-hidden bg-fundo-secundario transition-transform duration-250 hover:scale-[1.01] cursor-zoom-in">
                  <Image
                    src={typeof floor.image === 'string' ? floor.image : floor.image}
                    alt={`Visão da planta baixa esquemática do ${floor.name} localizado no ${bloco.name}`}
                    className="w-full h-auto object-cover"
                    width={800}
                    height={600}
                    priority={index === 0}
                  />
                </div>
              </div>

              <div className="w-full md:w-60 shrink-0">
                <h3 className="text-xs font-semibold uppercase tracking-[1px] text-texto-auxiliar mb-3" id={`title-rooms-${index}`}>
                  Salas e Setores
                </h3>
                <ul className="flex flex-col gap-1.5" aria-labelledby={`title-rooms-${index}`}>
                  {floor.rooms.map((room) => (
                    <li key={`${floor.name}-${room.code}`} className="flex gap-2 py-1.5 text-[13px] border-b border-borda/50 last:border-b-0 leading-relaxed">
                      <span
                        className="font-semibold shrink-0 text-[12px]"
                        style={{ color: accentColor }}
                        aria-hidden="true"
                      >
                        {room.code}
                      </span>
                      <span className="text-texto-secundario">
                        <span className="sr-only">Sala {room.code}: </span>
                        {room.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
