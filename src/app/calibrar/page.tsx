'use client';

/**
 * FERRAMENTA DE CALIBRAÇÃO DE ROTAS — só use em desenvolvimento
 *
 * Como usar:
 * 1. Adicione esta página em src/app/calibrar/page.tsx
 * 2. Acesse http://localhost:3000/calibrar
 * 3. Selecione o andar, selecione o tipo de nó, clique no mapa
 * 4. Copie o JSON gerado e cole no navigationGraph.ts
 * 5. Delete esta página quando terminar
 */

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import mapaTerreo   from '@/assets/mapa_geral.png';
import mapaSuperior from '@/assets/mapa_geral_superior.png';
import mapaSubsolo  from '@/assets/mapa_geral_subsolo.png';
import { NAV_NODES } from '@/data/navigationGraph';
import type { FloorLevel } from '@/components/FloorSwitcher';

type NodeType = 'room' | 'corridor' | 'stairs' | 'ramp' | 'entrance' | 'junction';

interface PlacedNode {
  id: string;
  x: number;
  y: number;
  floor: FloorLevel;
  type: NodeType;
  label: string;
}

const FLOOR_IMAGES = {
  terreo:   mapaTerreo,
  superior: mapaSuperior,
  subsolo:  mapaSubsolo,
};

const FLOOR_LABELS: Record<FloorLevel, string> = {
  terreo:   'Térreo',
  superior: 'Superior',
  subsolo:  'Subsolo',
};

const TYPE_COLORS: Record<NodeType, string> = {
  room:     '#00d9ff',
  corridor: '#ffffff',
  junction: '#ffdd57',
  stairs:   '#ff922b',
  ramp:     '#6bcb77',
  entrance: '#c084fc',
};

const TYPE_LABELS: Record<NodeType, string> = {
  room:     'Sala',
  corridor: 'Corredor',
  junction: 'Junção',
  stairs:   'Escada',
  ramp:     'Rampa',
  entrance: 'Entrada',
};

export default function CalibrePage() {
  const [floor, setFloor]       = useState<FloorLevel>('terreo');
  const [nodeType, setNodeType] = useState<NodeType>('corridor');
  const [nodeId, setNodeId]     = useState('');
  const [nodeLabel, setNodeLabel] = useState('');
  const [nodes, setNodes]       = useState<PlacedNode[]>([]);
  const [hover, setHover]       = useState<{ x: number; y: number } | null>(null);
  const [copied, setCopied]     = useState(false);
  const [showExisting, setShowExisting] = useState(true);
  const [selectedNode, setSelectedNode] = useState<PlacedNode | null>(null);
  const imgRef = useRef<HTMLDivElement>(null);

  // Existing nodes from graph for this floor (reference)
  const existingNodes = NAV_NODES.filter((n) => n.floor === floor);

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!imgRef.current) return;
    const rect = imgRef.current.getBoundingClientRect();
    const x = parseFloat(((e.clientX - rect.left) / rect.width  * 100).toFixed(2));
    const y = parseFloat(((e.clientY - rect.top)  / rect.height * 100).toFixed(2));

    const id = nodeId.trim() || `${floor.toUpperCase().slice(0,1)}_${nodeType.toUpperCase()}_${Date.now()}`;

    setNodes((prev) => {
      // remove um nó com o mesmo ID se já existir, para evitar duplicatas
      const filtered = prev.filter((n) => n.id !== id);
      return [...filtered, { id, x, y, floor, type: nodeType, label: nodeLabel.trim() }];
    });
    setNodeId('');
    setNodeLabel('');
  }, [floor, nodeType, nodeId, nodeLabel]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!imgRef.current) return;
    const rect = imgRef.current.getBoundingClientRect();
    setHover({
      x: parseFloat(((e.clientX - rect.left) / rect.width  * 100).toFixed(2)),
      y: parseFloat(((e.clientY - rect.top)  / rect.height * 100).toFixed(2)),
    });
  }, []);

  const removeNode = (id: string) => {
    setNodes((prev) => prev.filter((n) => n.id !== id));
    if (selectedNode?.id === id) setSelectedNode(null);
  };

  // Gera o output TypeScript para copiar — um array de objetos com as propriedades necessárias
  const generateTS = () => {
    if (nodes.length === 0) return '// Nenhum nó colocado ainda.';
    return nodes.map((n) =>
      `  { id: '${n.id}', x: ${n.x}, y: ${n.y}, floor: '${n.floor}', type: '${n.type}'${n.label ? `, label: '${n.label}'` : ''} },`
    ).join('\n');
  };

  const copyTS = () => {
    navigator.clipboard.writeText(generateTS()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(nodes, null, 2)], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `nav_nodes_${floor}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const nodesOnFloor = nodes.filter((n) => n.floor === floor);

  return (
    <div className="min-h-screen bg-fundo-principal text-texto-principal p-4 font-mono">
      <div className="max-w-1400px mx-auto">

        {/* Header */}
        <div className="mb-4 flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold text-destaque">🗺️ Calibrador de Rotas</h1>
            <p className="text-xs text-texto-auxiliar mt-0.5">Clique no mapa para colocar nós. Coordenadas em % do tamanho da imagem.</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={copyTS}
              className="px-3 py-1.5 bg-destaque text-black text-xs font-bold rounded-lg hover:opacity-90 transition-opacity"
            >
              {copied ? '✓ Copiado!' : 'Copiar TypeScript'}
            </button>
            <button
              onClick={exportJSON}
              className="px-3 py-1.5 bg-fundo-cartao border border-borda text-xs rounded-lg hover:border-destaque transition-colors"
            >
              Exportar JSON
            </button>
          </div>
        </div>

        <div className="flex gap-4 flex-col lg:flex-row">

          {/* Left panel - controls */}
          <div className="w-full lg:w-72 shrink-0 flex flex-col gap-3">

            {/* Floor selector */}
            <div className="bg-fundo-cartao border border-borda rounded-xl p-3">
              <p className="text-[10px] uppercase tracking-widest text-texto-auxiliar mb-2">Andar</p>
              <div className="flex gap-1">
                {(['terreo', 'superior', 'subsolo'] as FloorLevel[]).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFloor(f)}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                      floor === f ? 'bg-destaque text-black' : 'bg-fundo-principal text-texto-auxiliar hover:text-texto-principal'
                    }`}
                  >
                    {FLOOR_LABELS[f]}
                  </button>
                ))}
              </div>
            </div>

            {/* Node type */}
            <div className="bg-fundo-cartao border border-borda rounded-xl p-3">
              <p className="text-[10px] uppercase tracking-widest text-texto-auxiliar mb-2">Tipo de Nó</p>
              <div className="grid grid-cols-3 gap-1">
                {(Object.keys(TYPE_LABELS) as NodeType[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setNodeType(t)}
                    className={`py-1.5 text-[11px] font-semibold rounded-lg border transition-all ${
                      nodeType === t
                        ? 'border-transparent text-black'
                        : 'border-borda text-texto-auxiliar hover:border-borda-hover'
                    }`}
                    style={nodeType === t ? { backgroundColor: TYPE_COLORS[t] } : {}}
                  >
                    {TYPE_LABELS[t]}
                  </button>
                ))}
              </div>
            </div>

            {/* Node ID & Label */}
            <div className="bg-fundo-cartao border border-borda rounded-xl p-3 flex flex-col gap-2">
              <p className="text-[10px] uppercase tracking-widest text-texto-auxiliar">Próximo nó</p>
              <input
                type="text"
                value={nodeId}
                onChange={(e) => setNodeId(e.target.value)}
                placeholder="ID (ex: T_C_CORRIDOR_1)"
                className="w-full bg-fundo-principal border border-borda rounded-lg px-2.5 py-1.5 text-xs text-texto-principal placeholder:text-texto-auxiliar outline-none focus:border-destaque"
              />
              <input
                type="text"
                value={nodeLabel}
                onChange={(e) => setNodeLabel(e.target.value)}
                placeholder="Label (ex: C01 - Lab. Informática)"
                className="w-full bg-fundo-principal border border-borda rounded-lg px-2.5 py-1.5 text-xs text-texto-principal placeholder:text-texto-auxiliar outline-none focus:border-destaque"
              />
              <p className="text-[10px] text-texto-auxiliar">
                Deixe o ID vazio para gerar automático. Clique no mapa para colocar.
              </p>
            </div>

            {/* Toggles */}
            <div className="bg-fundo-cartao border border-borda rounded-xl p-3">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-texto-secundario">
                <input
                  type="checkbox"
                  checked={showExisting}
                  onChange={(e) => setShowExisting(e.target.checked)}
                  className="accent-destaque"
                />
                Mostrar nós existentes (referência)
              </label>
            </div>

            {/* Placed nodes list */}
            <div className="bg-fundo-cartao border border-borda rounded-xl p-3 flex-1 overflow-hidden">
              <p className="text-[10px] uppercase tracking-widest text-texto-auxiliar mb-2">
                Nós colocados ({nodesOnFloor.length})
              </p>
              <ul className="flex flex-col gap-1 max-h-48 overflow-y-auto">
                {nodesOnFloor.length === 0 && (
                  <li className="text-xs text-texto-auxiliar">Nenhum nó neste andar ainda.</li>
                )}
                {nodesOnFloor.map((n) => (
                  <li
                    key={n.id}
                    className={`flex items-center gap-2 text-[11px] py-1 px-2 rounded-lg cursor-pointer transition-colors ${
                      selectedNode?.id === n.id ? 'bg-destaque/15' : 'hover:bg-fundo-cartao-hover'
                    }`}
                    onClick={() => setSelectedNode(n.id === selectedNode?.id ? null : n)}
                  >
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: TYPE_COLORS[n.type] }}
                    />
                    <span className="flex-1 truncate text-texto-secundario">{n.id}</span>
                    <span className="text-texto-auxiliar shrink-0">{n.x},{n.y}</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); removeNode(n.id); }}
                      className="text-red-400 hover:text-red-300 shrink-0 leading-none"
                      aria-label={`Remover nó ${n.id}`}
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Map area */}
          <div className="flex-1 min-w-0 flex flex-col gap-3">

            {/* Coordinate display */}
            <div className="flex items-center gap-4 text-xs text-texto-auxiliar bg-fundo-cartao border border-borda rounded-xl px-4 py-2">
              <span>Cursor: <span className="text-destaque font-bold">
                {hover ? `x: ${hover.x}% · y: ${hover.y}%` : '—'}
              </span></span>
              {selectedNode && (
                <span>Selecionado: <span className="text-destaque font-bold">{selectedNode.id}</span> · {selectedNode.x},{selectedNode.y}</span>
              )}
              <span className="ml-auto">
                <span className="inline-flex items-center gap-1">
                  {(Object.keys(TYPE_COLORS) as NodeType[]).map((t) => (
                    <span key={t} className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: TYPE_COLORS[t] }} />
                      <span>{TYPE_LABELS[t]}</span>
                    </span>
                  ))}
                </span>
              </span>
            </div>

            {/* Map with overlay */}
            <div
              ref={imgRef}
              className="relative w-full cursor-crosshair rounded-xl overflow-hidden border border-borda select-none"
              onClick={handleClick}
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setHover(null)}
              role="application"
              aria-label="Mapa para colocar nós de navegação"
            >
              <Image
                src={FLOOR_IMAGES[floor]}
                alt={`Mapa ${FLOOR_LABELS[floor]}`}
                className="w-full h-auto block pointer-events-none"
                priority
              />

              {/* SVG overlay for nodes */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                {/* Existing nodes (reference, greyed) */}
                {showExisting && existingNodes.map((n) => (
                  <g key={`existing-${n.id}`}>
                    <circle
                      cx={n.x}
                      cy={n.y}
                      r="0.7"
                      fill={TYPE_COLORS[n.type as NodeType] ?? '#888'}
                      opacity="0.35"
                    />
                  </g>
                ))}

                {/* New nodes */}
                {nodesOnFloor.map((n) => (
                  <g key={n.id}>
                    <circle
                      cx={n.x}
                      cy={n.y}
                      r="1"
                      fill={TYPE_COLORS[n.type]}
                      stroke={selectedNode?.id === n.id ? '#fff' : 'rgba(0,0,0,0.5)'}
                      strokeWidth={selectedNode?.id === n.id ? '0.5' : '0.25'}
                      opacity="0.9"
                    />
                  </g>
                ))}

                {/* Hover crosshair */}
                {hover && (
                  <>
                    <line x1={hover.x} y1="0" x2={hover.x} y2="100" stroke="#00d9ff" strokeWidth="0.15" opacity="0.4" />
                    <line x1="0" y1={hover.y} x2="100" y2={hover.y} stroke="#00d9ff" strokeWidth="0.15" opacity="0.4" />
                    <circle cx={hover.x} cy={hover.y} r="0.8" fill="none" stroke="#00d9ff" strokeWidth="0.3" opacity="0.8" />
                  </>
                )}
              </svg>
            </div>

            {/* TypeScript output */}
            <div className="bg-fundo-cartao border border-borda rounded-xl p-3">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] uppercase tracking-widest text-texto-auxiliar">
                  Output TypeScript — cole em navigationGraph.ts
                </p>
                <button
                  onClick={copyTS}
                  className="text-[11px] text-destaque hover:opacity-80 transition-opacity"
                >
                  {copied ? '✓ Copiado!' : 'Copiar'}
                </button>
              </div>
              <pre className="text-[11px] text-green-400 bg-fundo-principal rounded-lg p-3 overflow-x-auto max-h-48 overflow-y-auto leading-relaxed">
                {generateTS()}
              </pre>
            </div>

          </div>
        </div>

        {/* Instructions */}
        <div className="mt-4 bg-fundo-cartao border border-borda rounded-xl p-4 text-xs text-texto-auxiliar leading-relaxed">
          <p className="font-bold text-texto-secundario mb-2">📋 Fluxo de trabalho recomendado:</p>
          <ol className="list-decimal list-inside flex flex-col gap-1">
            <li>Comece pelo <strong className="text-texto-principal">Térreo</strong> — coloque os nós de <span style={{color: TYPE_COLORS.junction}}>Junção</span> e <span style={{color: TYPE_COLORS.corridor}}>Corredor</span> sobre os corredores centrais do mapa primeiro.</li>
            <li>Adicione as <span style={{color: TYPE_COLORS.entrance}}>Entradas</span> de cada bloco (onde o corredor entra no bloco).</li>
            <li>Adicione as <span style={{color: TYPE_COLORS.stairs}}>Escadas</span> e a <span style={{color: TYPE_COLORS.ramp}}>Rampa</span> — use exatamente os mesmos IDs que estão no <code>navigationGraph.ts</code>.</li>
            <li>Adicione as <span style={{color: TYPE_COLORS.room}}>Salas</span> individualmente.</li>
            <li>Repita para o <strong className="text-texto-principal">Andar Superior</strong> e <strong className="text-texto-principal">Subsolo</strong>.</li>
            <li>Copie o output TS, substitua o array <code>NAV_NODES</code> no <code>navigationGraph.ts</code>.</li>
            <li>Ajuste as arestas <code>NAV_EDGES</code> se algum ID foi renomeado.</li>
            <li>Delete esta página de calibração do projeto.</li>
          </ol>
        </div>

      </div>
    </div>
  );
}