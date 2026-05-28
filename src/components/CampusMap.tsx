'use client';

import { useEffect, useState, useMemo } from 'react';
import { MapContainer, ImageOverlay, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import Link from 'next/link';
import { blocos } from '@/data/blocos';
import RouteOverlay from '@/components/RouteOverlay';
import mapaTerreo from '@/assets/mapa_geral.png';
import mapaSuperior from '@/assets/mapa_geral_superior.png';
import mapaSubsolo from '@/assets/mapa_geral_subsolo.png';
import 'leaflet/dist/leaflet.css';
import type { FloorLevel } from './FloorSwitcher';
import type { RouteResult } from './RouteDrawer';

// Map image dimensions
const MAP_WIDTH = 1000;
const MAP_HEIGHT = 600;
const bounds: L.LatLngBoundsExpression = [[0, 0], [MAP_HEIGHT, MAP_WIDTH]];

// Define which blocks exist on each floor
const FLOOR_BLOCKS: Record<FloorLevel, Set<string>> = {
  terreo: new Set(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']),
  superior: new Set(['A', 'B', 'C', 'D', 'F', 'G', 'H']),
  subsolo: new Set(['D', 'E', 'F']),
};

const MAP_IMAGES: Record<FloorLevel, typeof mapaTerreo> = {
  terreo: mapaTerreo,
  superior: mapaSuperior,
  subsolo: mapaSubsolo,
};

function FitBounds() {
  const map = useMap();
  useEffect(() => {
    map.fitBounds(bounds);
  }, [map]);
  return null;
}

function createMarkerIcon(color: string, label: string): L.DivIcon {
  return new L.DivIcon({
    className: 'campus-marker-wrapper',
    html: `
      <div class="campus-marker" style="--marker-color: ${color}">
        <div class="campus-marker-pulse"></div>
        <div class="campus-marker-dot"></div>
        <div class="campus-marker-label">${label}</div>
      </div>
    `,
    iconSize: [120, 50],
    iconAnchor: [60, 25],
  });
}

interface CampusMapProps {
  floor?: FloorLevel;
  routeResult?: RouteResult | null;
}

export default function CampusMap({ floor = 'terreo', routeResult }: CampusMapProps) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayedFloor, setDisplayedFloor] = useState<FloorLevel>(floor);

  // Animate floor transition
  useEffect(() => {
    if (floor !== displayedFloor) {
      const startTimer = setTimeout(() => setIsTransitioning(true), 0);
      const endTimer = setTimeout(() => {
        setDisplayedFloor(floor);
        setIsTransitioning(false);
      }, 200);

      return () => {
        clearTimeout(startTimer);
        clearTimeout(endTimer);
      };
    }
  }, [floor, displayedFloor]);

  const visibleBlocos = useMemo(
    () => blocos.filter((b) => FLOOR_BLOCKS[displayedFloor].has(b.id)),
    [displayedFloor]
  );

  const mapImage = MAP_IMAGES[displayedFloor];

  // When a route is active, dim block markers slightly so route stands out
  const markerOpacity = routeResult ? 0.45 : 1;

  return (
    <div
      className="w-full h-[70vh] min-h-100 max-h-150 md:h-125 md:min-h-100 md:max-h-137.5 rounded-2xl overflow-hidden border border-borda hover:border-borda-hover shadow-lg hover:shadow-2xl relative transition-all duration-300 campus-map-wrapper"
      role="application"
      aria-label={`Mapa interativo do campus — ${displayedFloor === 'terreo' ? 'Térreo' : displayedFloor === 'superior' ? 'Andar Superior' : 'Subsolo'}`}
    >
      {/* Transition overlay */}
      <div
        className={`absolute inset-0 bg-fundo-principal/60 z-1000 pointer-events-none transition-opacity duration-200 ${
          isTransitioning ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Bloco Invisível para Leitores de Tela */}
      <div className="sr-only" aria-live="polite">
        <h2>Lista de Blocos e Navegação Alternativa</h2>
        <ul role="list">
          {visibleBlocos.map((bloco) => (
            <li key={`sr-${bloco.id}`} role="listitem">
              <Link href={`/bloco/${bloco.id}`} aria-label={`Navegar para os detalhes do ${bloco.name}`}>
                O {bloco.name} contém {bloco.description} Selecione para acessar as plantas e visualizar os laboratórios disponíveis.
              </Link>
            </li>
          ))}
        </ul>
        {routeResult && (
          <div aria-live="assertive">
            Rota traçada com {routeResult.pathResult.path.length} pontos.{' '}
            {routeResult.pathResult.floorChanges.length > 0
              ? `Inclui ${routeResult.pathResult.floorChanges.length} troca(s) de andar.`
              : 'Rota no mesmo andar.'}
          </div>
        )}
      </div>

      <MapContainer
        crs={L.CRS.Simple}
        bounds={bounds}
        maxBounds={bounds}
        maxBoundsViscosity={1.0}
        zoom={0}
        minZoom={-1}
        maxZoom={3}
        zoomSnap={0.25}
        zoomDelta={0.5}
        scrollWheelZoom={true}
        dragging={true}
        className="w-full h-full campus-map-container"
        attributionControl={false}
      >
        <FitBounds />
        <ImageOverlay url={mapImage.src} bounds={bounds} />

        {/* Block markers — dimmed when route is active */}
        {visibleBlocos.map((bloco) => {
          const pos = bloco.mapPosition[displayedFloor];
          if (!pos) return null;

          const lat = MAP_HEIGHT * (1 - pos.y / 100);
          const lng = MAP_WIDTH * (pos.x / 100);
          const color = bloco.color || 'var(--color-destaque)';

          return (
            <Marker
              key={`${bloco.id}-${displayedFloor}`}
              position={[lat, lng]}
              icon={createMarkerIcon(color, bloco.name)}
              opacity={markerOpacity}
            >
              <Popup className="campus-popup">
                <div className="p-4">
                  <h3 className="text-base font-bold mb-1.5 tracking-tight" style={{ color }}>
                    {bloco.name}
                  </h3>
                  <p className="text-xs text-texto-secundario leading-relaxed mb-3">
                    {bloco.description}
                  </p>
                  <div className="flex gap-4 mb-3.5">
                    <span className="flex flex-col items-center">
                      <span className="text-xl font-bold text-texto-principal">{bloco.floors.length}</span>
                      <span className="text-[10px] text-texto-auxiliar uppercase tracking-wider">
                        {bloco.floors.length === 1 ? 'Andar' : 'Andares'}
                      </span>
                    </span>
                    <span className="flex flex-col items-center">
                      <span className="text-xl font-bold text-texto-principal">
                        {bloco.floors.reduce((acc, f) => acc + f.rooms.length, 0)}
                      </span>
                      <span className="text-[10px] text-texto-auxiliar uppercase tracking-wider">Salas</span>
                    </span>
                  </div>
                  <Link
                    href={`/bloco/${bloco.id}`}
                    className="block text-center px-4 py-2 rounded-md font-semibold text-[13px] text-white transition-all hover:scale-[1.02] hover:opacity-90"
                    style={{ backgroundColor: color }}
                  >
                    Ver Detalhes →
                  </Link>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Route overlay — rendered on top of everything */}
        {routeResult && (
          <RouteOverlay
            pathResult={routeResult.pathResult}
            fromId={routeResult.fromId}
            toId={routeResult.toId}
            currentFloor={displayedFloor}
          />
        )}
      </MapContainer>
    </div>
  );
}