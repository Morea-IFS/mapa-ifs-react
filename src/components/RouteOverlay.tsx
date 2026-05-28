'use client';

import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { NODE_MAP, type PathResult, type FloorLevel } from '@/data/navigationGraph';

interface RouteOverlayProps {
  pathResult: PathResult | null;
  fromId: string;
  toId: string;
  currentFloor: FloorLevel;
}

// Map image dimensions (must match CampusMap.tsx)
const MAP_WIDTH  = 1000;
const MAP_HEIGHT = 600;

/** Convert graph percentage coords → Leaflet LatLng */
function toLatLng(x: number, y: number): L.LatLng {
  return L.latLng(MAP_HEIGHT * (1 - y / 100), MAP_WIDTH * (x / 100));
}

export default function RouteOverlay({ pathResult, fromId, toId, currentFloor }: RouteOverlayProps) {
  const map = useMap();
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    // Remove previous overlay
    if (layerGroupRef.current) {
      layerGroupRef.current.clearLayers();
    } else {
      layerGroupRef.current = L.layerGroup().addTo(map);
    }

    if (!pathResult) return;

    const lg = layerGroupRef.current;
    const nodesOnFloor = pathResult.path.filter((n) => n.floor === currentFloor);

    if (nodesOnFloor.length < 2) {
      // Floor has only one point (transition floor) - show indicator
      const transitionNode = pathResult.path.find(
        (n) => (n.type === 'stairs' || n.type === 'ramp') && n.floor !== currentFloor
      );
      if (transitionNode) {
        const pos = toLatLng(transitionNode.x, transitionNode.y);
        const icon = L.divIcon({
          className: 'route-transition-wrapper',
          html: `<div class="route-transition-marker" aria-label="Troca de andar aqui">
            <span>${transitionNode.type === 'ramp' ? '♿' : '🪜'}</span>
          </div>`,
          iconSize: [36, 36],
          iconAnchor: [18, 18],
        });
        L.marker(pos, { icon }).addTo(lg);
      }
      return;
    }

    // INTERCEPTAÇÃO INTELIGENTE: Agrupa nós em múltiplos caminhos isolados/desconectados
    // caso a rota saia do andar atual e retorne posteriormente (ex: Superior -> Térreo -> Superior)
    const segments: L.LatLng[][] = [];
    let currentSegment: L.LatLng[] = [];

    for (const node of pathResult.path) {
      if (node.floor === currentFloor) {
        currentSegment.push(toLatLng(node.x, node.y));
      } else {
        // Quando a rota muda de andar, fecha o segmento atual se houver pontos suficientes
        if (currentSegment.length >= 2) {
          segments.push(currentSegment);
        }
        currentSegment = []; // Reinicia para coletar novos pontos caso retorne a este andar
      }
    }
    // Adiciona o último trecho pendente
    if (currentSegment.length >= 2) {
      segments.push(currentSegment);
    }

    // Renderiza individualmente cada segmento desconectado no mapa Leaflet
    segments.forEach((points) => {
      // ── Shadow / halo line (for contrast) ──
      L.polyline(points, {
        color: '#000000',
        weight: 9,
        opacity: 0.18,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(lg);

      // ── Main dashed route line ──
      const routeLine = L.polyline(points, {
        color: 'var(--route-color, #00d9ff)',
        weight: 4,
        opacity: 0.95,
        lineCap: 'round',
        lineJoin: 'round',
        dashArray: '10, 8',
      });

      // We need to set a CSS class on the SVG element to animate it
      routeLine.on('add', () => {
        const el = (routeLine as L.Polyline & { _path?: SVGElement })._path;
        if (el) {
          el.style.setProperty('--route-color', '#00d9ff');
          el.classList.add('route-animated-dash');
        }
      });

      routeLine.addTo(lg);

      // ── Direction arrows along the path (Processado por segmento interno) ──
      if (points.length >= 2) {
        for (let i = 0; i < points.length - 1; i++) {
          const mid = L.latLng(
            (points[i].lat + points[i + 1].lat) / 2,
            (points[i].lng + points[i + 1].lng) / 2
          );
          const dx = points[i + 1].lng - points[i].lng;
          const dy = points[i + 1].lat - points[i].lat;
          const angle = Math.atan2(dy, dx) * (180 / Math.PI);

          const arrowIcon = L.divIcon({
            className: 'route-arrow-wrapper',
            html: `<div class="route-arrow" style="transform:rotate(${angle}deg)" aria-hidden="true">›</div>`,
            iconSize: [16, 16],
            iconAnchor: [8, 8],
          });
          L.marker(mid, { icon: arrowIcon, interactive: false }).addTo(lg);
        }
      }
    });

    // ── Highlight nodes: stairs/ramps on this floor ──
    nodesOnFloor
      .filter((n) => n.type === 'stairs' || n.type === 'ramp')
      .forEach((node) => {
        const pos = toLatLng(node.x, node.y);
        const icon = L.divIcon({
          className: 'route-waypoint-wrapper',
          html: `<div class="route-waypoint route-waypoint--transition" aria-label="${node.label ?? 'Transição de andar'}">
            <span class="route-waypoint-emoji">${node.type === 'ramp' ? '♿' : '🪜'}</span>
          </div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });
        L.marker(pos, { icon, interactive: false }).addTo(lg);
      });

    // ── Origin marker ──
    const fromNode = NODE_MAP.get(fromId);
    if (fromNode && fromNode.floor === currentFloor) {
      const pos = toLatLng(fromNode.x, fromNode.y);
      const icon = L.divIcon({
        className: 'route-waypoint-wrapper',
        html: `<div class="route-waypoint route-waypoint--origin" role="img" aria-label="Origem: ${fromNode.label ?? fromId}">
          <div class="route-waypoint-dot route-waypoint-dot--origin"></div>
          <div class="route-waypoint-pulse route-waypoint-pulse--origin"></div>
          <div class="route-waypoint-label">Origem</div>
        </div>`,
        iconSize: [80, 56],
        iconAnchor: [40, 20],
      });
      L.marker(pos, { icon, interactive: false }).addTo(lg);
    }

    // ── Destination marker ──
    const toNode = NODE_MAP.get(toId);
    if (toNode && toNode.floor === currentFloor) {
      const pos = toLatLng(toNode.x, toNode.y);
      const icon = L.divIcon({
        className: 'route-waypoint-wrapper',
        html: `<div class="route-waypoint route-waypoint--dest" role="img" aria-label="Destino: ${toNode.label ?? toId}">
          <div class="route-waypoint-dot route-waypoint-dot--dest"></div>
          <div class="route-waypoint-pulse route-waypoint-pulse--dest"></div>
          <div class="route-waypoint-label">Destino</div>
        </div>`,
        iconSize: [80, 56],
        iconAnchor: [40, 20],
      });
      L.marker(pos, { icon, interactive: false }).addTo(lg);
    }

    // Cleanup on unmount or re-render
    return () => {
      layerGroupRef.current?.clearLayers();
    };
  }, [map, pathResult, fromId, toId, currentFloor]);

  return null;
}