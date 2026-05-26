'use client';

import { useEffect } from 'react';
import { MapContainer, ImageOverlay, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import Link from 'next/link';
import { blocos } from '@/data/blocos';
import mapaImg from '@/assets/mapa_geral.png';
import 'leaflet/dist/leaflet.css'; // Mantenha isso

// Map image dimensions
const MAP_WIDTH = 1000;
const MAP_HEIGHT = 600;
const bounds: L.LatLngBoundsExpression = [[0, 0], [MAP_HEIGHT, MAP_WIDTH]];

function FitBounds() {
  const map = useMap();
  useEffect(() => {
    map.fitBounds(bounds);
  }, [map]);
  return null;
}

function createMarkerIcon(color: string, label: string): L.DivIcon {
  return new L.DivIcon({
    className: 'campus-marker-wrapper', // mantido para CSS global (leaflet inject)
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

export default function CampusMap() {
  return (
    <div 
      className="w-full h-[70vh] min-h-100 max-h-150 md:h-125 md:min-h-100 md:max-h-137.5 rounded-2xl overflow-hidden border border-borda hover:border-borda-hover shadow-lg hover:shadow-2xl relative transition-all duration-300 campus-map-wrapper"
      role="application"
      aria-label="Mapa interativo do campus"
    >
      
      {/* Bloco Invisível para Leitores de Tela (Acessibilidade) */}
      <div className="sr-only" aria-live="polite">
        <h2>Lista de Blocos e Navegação Alternativa</h2>
        <ul role="list">
          {blocos.map((bloco) => (
            <li key={`sr-${bloco.id}`} role="listitem">
              <Link href={`/bloco/${bloco.id}`} aria-label={`Navegar para os detalhes do ${bloco.name}`}>
                O {bloco.name} contém {bloco.description} Selecione para acessar as plantas e visualizar os laboratórios disponíveis.
              </Link>
            </li>
          ))}
        </ul>
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
        <ImageOverlay url={mapaImg.src} bounds={bounds} />

        {blocos.map((bloco) => {
          const lat = MAP_HEIGHT * (1 - bloco.mapPosition.y / 100);
          const lng = MAP_WIDTH * (bloco.mapPosition.x / 100);
          const color = bloco.color || 'var(--color-destaque)';

          return (
            <Marker
              key={bloco.id}
              position={[lat, lng]}
              icon={createMarkerIcon(color, bloco.name)}
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
      </MapContainer>
    </div>
  );
}
