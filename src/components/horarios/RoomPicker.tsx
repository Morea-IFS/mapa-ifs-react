'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import type { Room } from '@/lib/horarios/api';
import { scoreRoomMatch } from '@/lib/roomSearch';
import { getRoomPlace } from '@/data/horariosRooms';
import { inputClass } from './ui';
import { placeText } from './RoomName';

/** Escolha de sala com busca (ignora acentos e aceita várias palavras). */
export default function RoomPicker({ rooms, value, onChange }: { rooms: Room[]; value: string | null; onChange: (name: string) => void }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    return rooms
      .map((r) => {
        const place = getRoomPlace(r.name);
        // procura no nome da sala e também em "Bloco B", para quem não sabe o nome do PDF
        const score = Math.max(scoreRoomMatch(query, r.name), scoreRoomMatch(query, `${place?.blocoName ?? ''} ${place?.label ?? ''}`) * 0.8);
        return { r, score };
      })
      .filter((x) => query.trim() === '' || x.score > 0)
      .sort((a, b) => b.score - a.score || a.r.name.localeCompare(b.r.name, 'pt-BR', { numeric: true }))
      .map((x) => x.r);
  }, [rooms, query]);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', esc);
    return () => { document.removeEventListener('mousedown', close); document.removeEventListener('keydown', esc); };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex min-h-12 w-full items-center gap-2.5 rounded-xl border border-borda bg-fundo-cartao px-3.5 text-left transition-colors hover:border-borda-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-destaque"
      >
        <span className={`flex-1 truncate text-[15px] ${value ? 'font-medium text-texto-principal' : 'text-texto-auxiliar'}`}>{value ?? 'Escolha uma sala ou laboratório'}</span>
        <ChevronDown size={16} className={`shrink-0 text-texto-auxiliar transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full z-40 mt-1.5 overflow-hidden rounded-xl border border-borda bg-fundo-secundario shadow-2xl">
          <div className="border-b border-borda p-2">
            <div className="relative">
              <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-texto-auxiliar" aria-hidden />
              <input
                autoFocus
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar por nome ou bloco"
                aria-label="Buscar sala"
                className={`${inputClass} pl-9`}
              />
            </div>
          </div>
          <ul role="listbox" aria-label="Salas" className="max-h-[50vh] overflow-y-auto p-1">
            {filtered.length === 0 && <li className="px-3 py-4 text-sm text-texto-secundario">Nenhuma sala encontrada.</li>}
            {filtered.map((r) => (
              <li key={r.id} role="option" aria-selected={r.name === value}>
                <button
                  type="button"
                  onClick={() => { onChange(r.name); setOpen(false); setQuery(''); }}
                  className={`flex min-h-11 w-full flex-col justify-center rounded-lg px-3 py-1.5 text-left hover:bg-fundo-cartao-hover focus:bg-fundo-cartao-hover focus:outline-none ${r.name === value ? 'bg-destaque-fraco' : ''}`}
                >
                  <span className="text-sm font-medium text-texto-principal">{r.name}</span>
                  {placeText(r.name) && <span className="text-xs text-texto-auxiliar">{placeText(r.name)}</span>}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
