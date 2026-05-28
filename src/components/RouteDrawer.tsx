'use client';

import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { X, Navigation, MapPin, ArrowRight, AlertCircle, Accessibility, ChevronDown, Search } from 'lucide-react';
import { findPath, ROOM_OPTIONS, NODE_MAP, type PathResult, type FloorLevel } from '@/data/navigationGraph';

interface RouteDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onRouteChange: (result: RouteResult | null) => void;
}

export interface RouteResult {
  pathResult: PathResult;
  fromId: string;
  toId: string;
  accessibleOnly: boolean;
}

// ── Combobox com busca 
function RoomCombobox({
  value,
  onChange,
  placeholder,
  excludeId,
  icon: Icon,
  accentColor,
  isDestination = false, // Nova flag para identificar se é o campo de destino
}: {
  value: string;
  onChange: (id: string) => void;
  placeholder: string;
  excludeId?: string;
  icon: React.ElementType;
  accentColor: string;
  isDestination?: boolean;
}) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    
    // Injeta a opção genérica inteligente no topo se for o campo de destino
    const baseOptions = isDestination
      ? [
          { id: 'banheiro', label: 'Banheiro (Mais Próximo)', floor: 'terreo' as FloorLevel },
          ...ROOM_OPTIONS,
        ]
      : ROOM_OPTIONS;

    return baseOptions.filter(
      (r) =>
        r.id !== excludeId &&
        (q === '' || r.label.toLowerCase().includes(q))
    ).slice(0, 60);
  }, [query, excludeId, isDestination]);

  // Procura o selecionado considerando a opção virtual também
  const selected = value === 'banheiro' 
    ? { id: 'banheiro', label: 'Banheiro (Mais Próximo)', floor: 'terreo' as FloorLevel }
    : ROOM_OPTIONS.find((r) => r.id === value);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const floorLabel: Record<FloorLevel, string> = {
    terreo: 'Térreo',
    superior: 'Superior',
    subsolo: 'Subsolo',
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-2.5 px-3.5 py-3 bg-fundo-principal border border-borda hover:border-borda-hover rounded-xl text-left transition-all duration-150 focus:outline-none focus:ring-1 focus:ring-destaque/50"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <Icon size={16} style={{ color: accentColor }} className="shrink-0" aria-hidden />
        <span className={`flex-1 text-sm truncate ${selected ? 'text-texto-principal' : 'text-texto-auxiliar'}`}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          size={14}
          className={`text-texto-auxiliar shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          aria-hidden
        />
      </button>

      {open && (
        <div
          className="absolute top-full left-0 right-0 mt-1.5 z-50 bg-fundo-cartao border border-borda rounded-xl shadow-2xl overflow-hidden"
          role="listbox"
        >
          {/* Search input */}
          <div className="p-2 border-b border-borda">
            <div className="flex items-center gap-2 px-2.5 py-2 bg-fundo-principal rounded-lg">
              <Search size={13} className="text-texto-auxiliar shrink-0" aria-hidden />
              <input
                autoFocus
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar sala ou banheiro..."
                className="flex-1 bg-transparent text-sm text-texto-principal placeholder:text-texto-auxiliar outline-none"
                aria-label="Buscar sala"
              />
            </div>
          </div>

          {/* Options */}
          <ul className="max-h-56 overflow-y-auto py-1" role="listbox">
            {filtered.length === 0 ? (
              <li className="px-4 py-3 text-sm text-texto-auxiliar text-center">
                Nenhuma sala encontrada
              </li>
            ) : (
              filtered.map((room) => {
                const isGeneric = room.id === 'banheiro';
                return (
                  <li key={room.id} role="option" aria-selected={room.id === value}>
                    <button
                      type="button"
                      onClick={() => { onChange(room.id); setOpen(false); setQuery(''); }}
                      className={`w-full flex items-start gap-2.5 px-3.5 py-2.5 text-left hover:bg-fundo-cartao-hover transition-colors duration-100 ${
                        room.id === value ? 'bg-destaque/10' : ''
                      }`}
                    >
                      <span className={`mt-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-md border uppercase shrink-0 leading-none ${
                        isGeneric 
                          ? 'border-destaque/30 bg-destaque/10 text-destaque font-extrabold' 
                          : 'border-borda text-texto-auxiliar'
                      }`}>
                        {isGeneric ? '🚗 Auto' : floorLabel[room.floor]}
                      </span>
                      <span className={`text-sm leading-snug ${isGeneric ? 'text-destaque font-medium' : 'text-texto-principal'}`}>
                        {room.label}
                      </span>
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

// ── Steps de instrução da rota ──────────────────────────────
function RouteSteps({ result }: { result: PathResult }) {
  const steps: { icon: React.ReactNode; text: string; type: string }[] = [];

  const floorLabel: Record<FloorLevel, string> = {
    terreo: 'Térreo',
    superior: 'Andar Superior',
    subsolo: 'Subsolo',
  };

  let currentFloor: FloorLevel | null = null;

  for (const node of result.path) {
    if (node.floor !== currentFloor) {
      currentFloor = node.floor;
      steps.push({
        type: 'floor',
        icon: <span className="w-5 h-5 rounded-full bg-destaque/20 text-destaque text-[10px] font-bold flex items-center justify-center shrink-0">▶</span>,
        text: `Andar: ${floorLabel[currentFloor]}`,
      });
    }
    if (node.type === 'stairs') {
      const next = result.path[result.path.indexOf(node) + 1];
      const dir = next && next.floor !== node.floor
        ? (next.floor === 'superior' ? 'Suba' : 'Desça')
        : 'Use';
      steps.push({
        type: 'stairs',
        icon: <span aria-hidden className="text-base">🪜</span>,
        text: `${dir} pela escada — ${node.label ?? 'Escada'}`,
      });
    }
    if (node.type === 'ramp') {
      const next = result.path[result.path.indexOf(node) + 1];
      const dir = next && next.floor !== node.floor
        ? (next.floor === 'superior' ? 'Suba' : 'Desça')
        : 'Use';
      steps.push({
        type: 'ramp',
        icon: <span aria-hidden className="text-base">♿</span>,
        text: `${dir} pela rampa — ${node.label ?? 'Rampa'}`,
      });
    }
    if (node.type === 'room' || node.type === 'bathroom') {
      steps.push({
        type: 'room',
        icon: node.type === 'bathroom' 
          ? <span aria-hidden className="text-base shrink-0 mt-0.5">🚻</span>
          : <MapPin size={14} className="text-destaque shrink-0 mt-0.5" aria-hidden />,
        text: node.label ?? node.id,
      });
    }
  }

  return (
    <ol className="flex flex-col gap-1.5 mt-3" aria-label="Passos da rota">
      {steps.map((step, i) => (
        <li
          key={i}
          className={`flex items-start gap-2.5 text-[13px] leading-snug py-1.5 px-3 rounded-lg ${
            step.type === 'floor'   ? 'bg-destaque/8 text-destaque font-semibold' :
            step.type === 'stairs' || step.type === 'ramp' ? 'bg-fundo-cartao-hover text-texto-principal font-medium' :
            step.type === 'room'   ? 'text-texto-principal' : 'text-texto-secundario'
          }`}
        >
          {step.icon}
          <span>{step.text}</span>
        </li>
      ))}
    </ol>
  );
}

// ── Componente principal ────────────────────────────────────
export default function RouteDrawer({ isOpen, onClose, onRouteChange }: RouteDrawerProps) {
  const [fromId, setFromId] = useState('');
  const [toId,   setToId]   = useState('');
  const [accessible, setAccessible] = useState(false);
  const [result, setResult] = useState<PathResult | null>(null);
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = useCallback(() => {
    if (!fromId || !toId) {
      setError('Selecione a origem e o destino.');
      return;
    }
    if (fromId === toId) {
      setError('A origem e o destino não podem ser iguais.');
      return;
    }

    setLoading(true);
    setError('');

    setTimeout(() => {
      let path: PathResult | null = null;
      let finalToId = toId;

      const isBathroomTarget = toId.toLowerCase().includes('banheiro');

      if (isBathroomTarget && typeof NODE_MAP !== 'undefined') {
        const bathroomNodes = Array.from(NODE_MAP.values()).filter(
          (n) =>
            n.type === 'bathroom' ||
            n.id.toLowerCase().includes('banheiro') ||
            n.label?.toLowerCase().includes('banheiro')
        );

        let minDistance = Infinity;
        
        for (const node of bathroomNodes) {
          const p = findPath(fromId, node.id, accessible);
          if (p && p.totalDistance < minDistance) {
            minDistance = p.totalDistance;
            path = p;
            finalToId = node.id; // Resolve dinamicamente para o ID real do banheiro mais próximo
          }
        }
      } else {
        path = findPath(fromId, toId, accessible);
      }

      setLoading(false);

      if (!path) {
        setError(
          accessible
            ? 'Rota acessível não encontrada. Tente desativar a opção de baixa mobilidade.'
            : 'Rota não encontrada entre os locais selecionados.'
        );
        setResult(null);
        onRouteChange(null);
      } else {
        setResult(path);
        onRouteChange({ pathResult: path, fromId, toId: finalToId, accessibleOnly: accessible });
      }
    }, 50);
  }, [fromId, toId, accessible, onRouteChange]);

  const handleClear = () => {
    setFromId('');
    setToId('');
    setResult(null);
    setError('');
    onRouteChange(null);
  };

  const distanceLabel = result
    ? result.totalDistance < 50
      ? '< 1 min a pé'
      : result.totalDistance < 100
      ? '~1–2 min a pé'
      : '~3–5 min a pé'
    : '';

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-3500 md:hidden animate-in fade-in duration-200"
          onClick={onClose}
          aria-hidden
        />
      )}

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Buscar rota no campus"
        className={`fixed top-0 right-0 h-dvh w-full max-w-sm bg-fundo-secundario/98 backdrop-blur-xl border-l border-borda z-4500 flex flex-col overflow-hidden shadow-2xl transition-transform duration-350 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center gap-3 px-5 pt-6 pb-4 border-b border-borda shrink-0">
          <div className="w-9 h-9 rounded-xl bg-destaque/15 flex items-center justify-center shrink-0">
            <Navigation size={18} className="text-destaque" aria-hidden />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-bold text-texto-principal tracking-tight">Buscar Rota</h2>
            <p className="text-[11px] text-texto-auxiliar">Navegação pelo campus IFS</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-texto-auxiliar hover:text-texto-principal hover:bg-fundo-cartao transition-colors duration-150"
            aria-label="Fechar painel de busca de rota"
          >
            <X size={18} aria-hidden />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-5">
          <div className="flex flex-col gap-3">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-texto-auxiliar mb-1.5">
                De (Origem)
              </label>
              <RoomCombobox
                value={fromId}
                onChange={(id) => { setFromId(id); setResult(null); setError(''); }}
                placeholder="Selecione a sala de origem"
                excludeId={toId}
                icon={MapPin}
                accentColor="var(--color-destaque)"
              />
            </div>

            <div className="flex items-center gap-2">
              <div className="flex-1 h-px bg-borda" />
              <div className="w-7 h-7 rounded-full border border-borda bg-fundo-cartao flex items-center justify-center">
                <ArrowRight size={13} className="text-texto-auxiliar" aria-hidden />
              </div>
              <div className="flex-1 h-px bg-borda" />
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-texto-auxiliar mb-1.5">
                Para (Destino)
              </label>
              <RoomCombobox
                value={toId}
                onChange={(id) => { setToId(id); setResult(null); setError(''); }}
                placeholder="Selecione a sala de destino"
                excludeId={fromId}
                icon={Navigation}
                accentColor="#f06595"
                isDestination={true} 
              />
            </div>
          </div>

          <label className="flex items-start gap-3 p-3.5 bg-fundo-cartao border border-borda hover:border-borda-hover rounded-xl cursor-pointer transition-colors duration-150 group">
            <div className="relative shrink-0 mt-0.5">
              <input
                type="checkbox"
                checked={accessible}
                onChange={(e) => { setAccessible(e.target.checked); setResult(null); setError(''); }}
                className="sr-only"
                aria-describedby="accessible-desc"
              />
              <div className={`w-10 h-5.5 rounded-full border transition-all duration-200 ${
                accessible
                  ? 'bg-destaque border-destaque'
                  : 'bg-fundo-principal border-borda group-hover:border-borda-hover'
              }`}>
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-200 ${
                  accessible ? 'left-5.5' : 'left-0.5'
                }`} />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <Accessibility size={14} className="text-destaque" aria-hidden />
                <span className="text-sm font-semibold text-texto-principal">Baixa mobilidade</span>
              </div>
              <p id="accessible-desc" className="text-[11px] text-texto-auxiliar mt-0.5 leading-relaxed">
                Prefere rampas e evita escadas sempre que possível.
              </p>
            </div>
          </label>

          {error && (
            <div
              role="alert"
              className="flex items-start gap-2.5 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm"
            >
              <AlertCircle size={16} className="shrink-0 mt-0.5" aria-hidden />
              <span>{error}</span>
            </div>
          )}

          <button
            onClick={handleSearch}
            disabled={!fromId || !toId || loading}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-destaque hover:bg-destaque/90 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-xl transition-all duration-150 shadow-[0_0_20px_rgba(0,217,255,0.25)] hover:shadow-[0_0_28px_rgba(0,217,255,0.35)] active:scale-[0.98]"
            aria-busy={loading}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" aria-hidden />
                Calculando...
              </>
            ) : (
              <>
                <Navigation size={16} aria-hidden />
                Traçar Rota
              </>
            )}
          </button>

          {result && (
            <div
              className="animate-in slide-in-from-bottom-2 fade-in duration-300"
              role="region"
              aria-label="Resultado da rota"
            >
              <div className="flex items-center gap-3 p-4 bg-fundo-cartao border border-borda rounded-xl mb-1">
                <div className="w-9 h-9 rounded-xl bg-green-500/15 flex items-center justify-center shrink-0">
                  <Navigation size={16} className="text-green-400" aria-hidden />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-texto-principal">Rota encontrada</p>
                    <p className="text-[11px] text-texto-auxiliar">
                        {result.floorChanges.length > 0
                            ? `${result.floorChanges.length} troca${result.floorChanges.length > 1 ? 's' : ''} de andar · `
                            : ''}
                        {distanceLabel}
                        {accessible && ' · Rota acessível'}
                    </p>
                </div>
              </div>

              <RouteSteps result={result} />

              <button
                onClick={handleClear}
                className="mt-4 w-full py-2.5 text-sm text-texto-auxiliar hover:text-texto-principal border border-borda hover:border-borda-hover rounded-xl transition-colors duration-150"
              >
                Limpar rota
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}