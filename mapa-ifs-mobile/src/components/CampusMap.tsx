import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Svg, {
  Path,
  Circle,
  G,
  Line,
  Defs,
  Marker as SvgMarker,
  Polygon,
} from 'react-native-svg';
import { ArrowRight, X, MapPin } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeContext';
import { blocos } from '../data/blocos';
import { FloorLevel, RouteResult, BlocoData } from '../types';

interface CampusMapProps {
  floor: FloorLevel;
  routeResult?: RouteResult | null;
  onSelectBloco: (blocoId: string) => void;
}

const MAP_WIDTH = 1000;
const MAP_HEIGHT = 600;

// Imagens dos andares locais
const MAP_IMAGES: Record<FloorLevel, any> = {
  terreo: require('../../assets/mapa_geral.png'),
  superior: require('../../assets/mapa_geral_superior.png'),
  subsolo: require('../../assets/mapa_geral_subsolo.png'),
};

// Blocos visíveis por andar (idêntico ao site)
const FLOOR_BLOCKS: Record<FloorLevel, Set<string>> = {
  terreo: new Set(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']),
  superior: new Set(['A', 'B', 'C', 'D', 'F', 'G', 'H']),
  subsolo: new Set(['D', 'E', 'F']),
};

export const CampusMap: React.FC<CampusMapProps> = ({
  floor,
  routeResult,
  onSelectBloco,
}) => {
  const { colors } = useTheme();
  const [selectedBloco, setSelectedBloco] = useState<BlocoData | null>(null);

  // Blocos visíveis no andar atual
  const visibleBlocos = useMemo(
    () => blocos.filter((b) => FLOOR_BLOCKS[floor].has(b.id)),
    [floor]
  );

  // Segmentos da rota neste andar
  const routeSegments = useMemo(() => {
    if (!routeResult) return [];

    const segments: { x: number; y: number }[][] = [];
    let currentSegment: { x: number; y: number }[] = [];

    for (const node of routeResult.pathResult.path) {
      if (node.floor === floor) {
        currentSegment.push({
          x: (node.x / 100) * MAP_WIDTH,
          y: (node.y / 100) * MAP_HEIGHT,
        });
      } else {
        if (currentSegment.length > 0) {
          segments.push(currentSegment);
          currentSegment = [];
        }
      }
    }

    if (currentSegment.length > 0) {
      segments.push(currentSegment);
    }

    return segments;
  }, [routeResult, floor]);

  // Transições de andar na rota
  const floorTransitions = useMemo(() => {
    if (!routeResult) return [];
    return routeResult.pathResult.path.filter(
      (n) => (n.type === 'escada' || n.type === 'rampa') && n.floor === floor
    );
  }, [routeResult, floor]);

  // Ponto de início (se estiver neste andar)
  const startNode = useMemo(() => {
    if (!routeResult || routeResult.pathResult.path.length === 0) return null;
    const first = routeResult.pathResult.path[0];
    return first.floor === floor ? first : null;
  }, [routeResult, floor]);

  // Ponto final (se estiver neste andar)
  const endNode = useMemo(() => {
    if (!routeResult || routeResult.pathResult.path.length === 0) return null;
    const last =
      routeResult.pathResult.path[routeResult.pathResult.path.length - 1];
    return last.floor === floor ? last : null;
  }, [routeResult, floor]);

  const markerOpacity = routeResult ? 0.45 : 1;

  return (
    <View
      style={[
        styles.wrapper,
        {
          backgroundColor: colors.fundoSecundario,
          borderColor: colors.borda,
        },
      ]}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        nestedScrollEnabled
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          nestedScrollEnabled
        >
          <View style={styles.mapCanvas}>
            {/* Imagem do mapa de fundo */}
            <Image
              source={MAP_IMAGES[floor]}
              style={styles.mapImage}
              resizeMode="stretch"
            />

            {/* Camada SVG de rotas */}
            <Svg style={StyleSheet.absoluteFill}>
              <Defs>
                <SvgMarker
                  id="arrow"
                  viewBox="0 0 10 10"
                  refX="5"
                  refY="5"
                  markerWidth="5"
                  markerHeight="5"
                  orient="auto-start-reverse"
                >
                  <Polygon points="0 0, 10 5, 0 10" fill={colors.destaque} />
                </SvgMarker>
              </Defs>

              {/* Linhas da rota */}
              {routeSegments.map((segment, segIdx) => {
                if (segment.length < 2) return null;

                const pathData = segment.reduce(
                  (acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`,
                  ''
                );

                return (
                  <G key={`seg-${segIdx}`}>
                    {/* Halo de destaque */}
                    <Path
                      d={pathData}
                      fill="none"
                      stroke={colors.destaque}
                      strokeWidth={10}
                      strokeOpacity={0.35}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    {/* Linha principal tracejada */}
                    <Path
                      d={pathData}
                      fill="none"
                      stroke={colors.destaque}
                      strokeWidth={4.5}
                      strokeDasharray="9, 6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {/* Nós da rota */}
                    {segment.map((pt, ptIdx) => (
                      <Circle
                        key={`pt-${segIdx}-${ptIdx}`}
                        cx={pt.x}
                        cy={pt.y}
                        r={4}
                        fill={colors.destaque}
                        stroke="#ffffff"
                        strokeWidth={1.5}
                      />
                    ))}
                  </G>
                );
              })}

              {/* Marcador de Origem */}
              {startNode && (
                <G>
                  <Circle
                    cx={(startNode.x / 100) * MAP_WIDTH}
                    cy={(startNode.y / 100) * MAP_HEIGHT}
                    r={14}
                    fill="#10b981"
                    fillOpacity={0.35}
                  />
                  <Circle
                    cx={(startNode.x / 100) * MAP_WIDTH}
                    cy={(startNode.y / 100) * MAP_HEIGHT}
                    r={8}
                    fill="#10b981"
                    stroke="#ffffff"
                    strokeWidth={2}
                  />
                </G>
              )}

              {/* Marcador de Destino */}
              {endNode && (
                <G>
                  <Circle
                    cx={(endNode.x / 100) * MAP_WIDTH}
                    cy={(endNode.y / 100) * MAP_HEIGHT}
                    r={16}
                    fill="#ef4444"
                    fillOpacity={0.35}
                  />
                  <Circle
                    cx={(endNode.x / 100) * MAP_WIDTH}
                    cy={(endNode.y / 100) * MAP_HEIGHT}
                    r={9}
                    fill="#ef4444"
                    stroke="#ffffff"
                    strokeWidth={2}
                  />
                </G>
              )}
            </Svg>

            {/* Marcadores de transição de andar (escada/rampa) */}
            {floorTransitions.map((node) => {
              const xPos = (node.x / 100) * MAP_WIDTH;
              const yPos = (node.y / 100) * MAP_HEIGHT;
              const isRampa = node.type === 'rampa';

              return (
                <View
                  key={`trans-${node.id}`}
                  style={[
                    styles.transitionMarker,
                    {
                      left: xPos - 15,
                      top: yPos - 15,
                      borderColor: isRampa ? '#6bcb77' : '#ff922b',
                      backgroundColor: colors.fundoCartao,
                    },
                  ]}
                >
                  <Text style={styles.transitionEmoji}>
                    {isRampa ? '♿' : '🪜'}
                  </Text>
                </View>
              );
            })}

            {/* Marcadores dos Blocos com Pulso e Rótulo */}
            {visibleBlocos.map((bloco) => {
              const pos = bloco.mapPosition[floor];
              if (!pos) return null;

              const xPos = (pos.x / 100) * MAP_WIDTH;
              const yPos = (pos.y / 100) * MAP_HEIGHT;
              const markerColor = bloco.color || colors.destaque;

              return (
                <TouchableOpacity
                  key={`bloco-${bloco.id}`}
                  activeOpacity={0.8}
                  onPress={() => setSelectedBloco(bloco)}
                  style={[
                    styles.markerContainer,
                    {
                      left: xPos - 38,
                      top: yPos - 18,
                      opacity: markerOpacity,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.markerBubble,
                      {
                        backgroundColor: colors.fundoCartao,
                        borderColor: markerColor,
                        shadowColor: markerColor,
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.markerDot,
                        { backgroundColor: markerColor },
                      ]}
                    />
                    <Text
                      style={[
                        styles.markerLabel,
                        { color: colors.textoPrincipal },
                      ]}
                    >
                      {bloco.name}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </ScrollView>

      {/* Dica de arraste */}
      <View style={styles.dragHint}>
        <Text style={[styles.dragHintText, { color: colors.textoAuxiliar }]}>
          ↔ Arraste o mapa para explorar
        </Text>
      </View>

      {/* Card Flutuante de Bloco Selecionado */}
      {selectedBloco && (
        <View
          style={[
            styles.popupCard,
            {
              backgroundColor: colors.fundoCartao,
              borderColor: selectedBloco.color || colors.destaque,
              shadowColor: '#000',
            },
          ]}
        >
          <View style={styles.popupHeader}>
            <View style={styles.popupTitleRow}>
              <View
                style={[
                  styles.popupDot,
                  {
                    backgroundColor:
                      selectedBloco.color || colors.destaque,
                  },
                ]}
              />
              <Text
                style={[
                  styles.popupTitle,
                  { color: selectedBloco.color || colors.destaque },
                ]}
              >
                {selectedBloco.name}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setSelectedBloco(null)}
              style={styles.popupClose}
            >
              <X size={16} color={colors.textoAuxiliar} />
            </TouchableOpacity>
          </View>

          <Text
            style={[styles.popupDesc, { color: colors.textoSecundario }]}
            numberOfLines={2}
          >
            {selectedBloco.description}
          </Text>

          <View style={styles.popupFooter}>
            <Text style={[styles.popupMeta, { color: colors.textoAuxiliar }]}>
              {selectedBloco.floors.length}{' '}
              {selectedBloco.floors.length === 1 ? 'andar' : 'andares'} ·{' '}
              {selectedBloco.floors.reduce((acc, f) => acc + f.rooms.length, 0)}{' '}
              salas
            </Text>

            <TouchableOpacity
              style={[
                styles.popupAction,
                {
                  backgroundColor:
                    selectedBloco.color || colors.destaque,
                },
              ]}
              onPress={() => {
                const id = selectedBloco.id;
                setSelectedBloco(null);
                onSelectBloco(id);
              }}
            >
              <Text style={styles.popupActionText}>Ver Detalhes</Text>
              <ArrowRight size={13} color="#ffffff" strokeWidth={2.4} />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    height: 380,
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  scrollContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapCanvas: {
    width: MAP_WIDTH,
    height: MAP_HEIGHT,
    position: 'relative',
  },
  mapImage: {
    width: MAP_WIDTH,
    height: MAP_HEIGHT,
  },
  markerContainer: {
    position: 'absolute',
    zIndex: 20,
  },
  markerBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4.5,
    paddingHorizontal: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    gap: 5,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 5,
    elevation: 4,
  },
  markerDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  markerLabel: {
    fontSize: 11,
    fontWeight: '700',
  },
  transitionMarker: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 25,
    elevation: 5,
  },
  transitionEmoji: {
    fontSize: 13,
  },
  dragHint: {
    position: 'absolute',
    bottom: 8,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    pointerEvents: 'none',
  },
  dragHintText: {
    fontSize: 10,
    fontWeight: '500',
  },
  popupCard: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    padding: 12,
    zIndex: 50,
    elevation: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  popupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  popupTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  popupDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  popupTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  popupClose: {
    padding: 2,
  },
  popupDesc: {
    fontSize: 11.5,
    lineHeight: 15,
    marginBottom: 8,
  },
  popupFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  popupMeta: {
    fontSize: 11,
    fontWeight: '500',
  },
  popupAction: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    gap: 4,
  },
  popupActionText: {
    color: '#ffffff',
    fontSize: 11.5,
    fontWeight: '700',
  },
});
