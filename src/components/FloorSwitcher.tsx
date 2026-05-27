'use client';

import { Building, ArrowDown, ArrowUp } from 'lucide-react';

export type FloorLevel = 'terreo' | 'superior' | 'subsolo';

interface FloorSwitcherProps {
  currentFloor: FloorLevel;
  onFloorChange: (floor: FloorLevel) => void;
}

const floorOptions: { value: FloorLevel; label: string; icon: typeof Building }[] = [
  { value: 'subsolo', label: 'Subsolo', icon: ArrowDown },
  { value: 'terreo', label: 'Térreo', icon: Building },
  { value: 'superior', label: 'Superior', icon: ArrowUp },
];

export default function FloorSwitcher({ currentFloor, onFloorChange }: FloorSwitcherProps) {
  return (
    <div
      className="flex bg-fundo-cartao/80 backdrop-blur-md border border-borda rounded-xl p-1 shadow-lg"
      role="group"
      aria-label="Selecionar andar do mapa"
    >
      {floorOptions.map(({ value, label, icon: Icon }) => (
        <button
          key={value}
          onClick={() => onFloorChange(value)}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all duration-200 ${
            currentFloor === value
              ? 'bg-destaque text-white shadow-[0_0_12px_var(--color-destaque-fraco)]'
              : 'text-texto-auxiliar hover:text-texto-principal hover:bg-fundo-cartao-hover'
          }`}
          title={label}
          aria-label={`Ver mapa do ${label}`}
          aria-pressed={currentFloor === value}
        >
          <Icon size={14} aria-hidden="true" />
          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  );
}
