import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  FlatList,
  Switch,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  Navigation,
  ArrowUpDown,
  Search,
  X,
  Check,
  MapPin,
  Accessibility,
  CornerDownRight,
  Trash2,
} from 'lucide-react-native';
import { useTheme } from '../theme/ThemeContext';
import {
  findPath,
  NAV_NODES,
  ROOM_OPTIONS,
  RoomOption,
} from '../data/navigationGraph';
import { RouteResult, FloorLevel } from '../types';

interface RouteDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onRouteChange: (route: RouteResult | null) => void;
  activeRoute: RouteResult | null;
}

const SPECIAL_DESTINATIONS: RoomOption[] = [
  {
    id: 'bathroom-closest',
    label: 'Banheiro mais próximo',
    floor: 'terreo',
  },
  {
    id: 'T_ENTRY',
    label: 'Entrada Principal (Térreo)',
    floor: 'terreo',
  },
];

export const RouteDrawer: React.FC<RouteDrawerProps> = ({
  isOpen,
  onClose,
  onRouteChange,
  activeRoute,
}) => {
  const { colors } = useTheme();

  const [fromId, setFromId] = useState<string>(activeRoute?.fromId || 'T_ENTRY');
  const [toId, setToId] = useState<string>(activeRoute?.toId || '');
  const [accessibleOnly, setAccessibleOnly] = useState<boolean>(
    activeRoute?.accessibleOnly || false
  );

  const [pickerTarget, setPickerTarget] = useState<'from' | 'to' | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [routeCalculated, setRouteCalculated] = useState<RouteResult | null>(
    activeRoute
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Lista combinada para destino ou apenas salas para origem
  const selectableOptions = useMemo(() => {
    let baseList = ROOM_OPTIONS;
    if (pickerTarget === 'to') {
      baseList = [...SPECIAL_DESTINATIONS, ...ROOM_OPTIONS];
    } else {
      // Para origem, garante a entrada principal no topo
      const entryOption: RoomOption = {
        id: 'T_ENTRY',
        label: 'Entrada Principal (Térreo)',
        floor: 'terreo',
      };
      baseList = [
        entryOption,
        ...ROOM_OPTIONS.filter((o) => o.id !== 'T_ENTRY'),
      ];
    }

    if (!searchQuery.trim()) return baseList;

    const q = searchQuery.toLowerCase().trim();
    return baseList.filter(
      (opt) =>
        opt.label.toLowerCase().includes(q) ||
        opt.id.toLowerCase().includes(q) ||
        opt.floor.toLowerCase().includes(q)
    );
  }, [pickerTarget, searchQuery]);

  const getLabelForId = (id: string): string => {
    if (!id) return 'Selecione um local...';
    if (id === 'bathroom-closest') return '🚻 Banheiro mais próximo';
    if (id === 'T_ENTRY') return '🚪 Entrada Principal (Térreo)';
    const found = NAV_NODES.find((n) => n.id === id);
    return found?.label || id;
  };

  const handleSwap = () => {
    if (toId === 'bathroom-closest') {
      // Não inverte se destino for banheiro virtual
      return;
    }
    const temp = fromId;
    setFromId(toId);
    setToId(temp);
    setRouteCalculated(null);
    setErrorMessage(null);
  };

  const handleCalculateRoute = () => {
    setErrorMessage(null);

    if (!fromId) {
      setErrorMessage('Selecione o ponto de partida.');
      return;
    }

    if (!toId) {
      setErrorMessage('Selecione o destino.');
      return;
    }

    let resolvedToId = toId;

    // Resolução dinâmica de banheiro mais próximo
    if (toId === 'bathroom-closest') {
      const fromNode = NAV_NODES.find((n) => n.id === fromId);
      if (!fromNode) {
        setErrorMessage('Ponto de partida inválido.');
        return;
      }

      const bathrooms = NAV_NODES.filter((n) => n.type === 'banheiro');
      let closestId = '';
      let shortestDistance = Infinity;

      for (const bath of bathrooms) {
        const path = findPath(fromId, bath.id, accessibleOnly);
        if (path && path.totalDistance < shortestDistance) {
          shortestDistance = path.totalDistance;
          closestId = bath.id;
        }
      }

      if (!closestId) {
        setErrorMessage(
          'Nenhum banheiro acessível foi encontrado a partir desta localização.'
        );
        return;
      }

      resolvedToId = closestId;
    }

    const pathResult = findPath(fromId, resolvedToId, accessibleOnly);

    if (!pathResult || pathResult.path.length === 0) {
      setErrorMessage(
        accessibleOnly
          ? 'Não há caminho acessível (sem escadas) entre estes dois pontos.'
          : 'Não foi possível encontrar uma rota entre estes dois pontos.'
      );
      return;
    }

    const result: RouteResult = {
      pathResult,
      fromId,
      toId: resolvedToId,
      accessibleOnly,
    };

    setRouteCalculated(result);
    onRouteChange(result);
  };

  const handleClearRoute = () => {
    setRouteCalculated(null);
    setToId('');
    setErrorMessage(null);
    onRouteChange(null);
  };

  // Passos textuais da rota
  const steps = useMemo(() => {
    if (!routeCalculated) return [];
    const result = routeCalculated.pathResult;
    const list: { icon: string; text: string; type: string }[] = [];

    let lastFloor: FloorLevel | null = null;

    result.path.forEach((node, index) => {
      // Mudança de andar
      if (node.floor !== lastFloor) {
        lastFloor = node.floor;
        const floorName =
          node.floor === 'terreo'
            ? 'Térreo'
            : node.floor === 'superior'
            ? 'Andar Superior'
            : 'Subsolo';

        list.push({
          type: 'floor',
          icon: '🏢',
          text: `Você está no ${floorName}`,
        });
      }

      if (node.type === 'escada') {
        const next = result.path[index + 1];
        const dir =
          next && next.floor !== node.floor
            ? next.floor === 'superior'
              ? 'Suba'
              : 'Desça'
            : 'Acesse';
        list.push({
          type: 'escada',
          icon: '🪜',
          text: `${dir} pela escada (${node.label ?? 'Escada'})`,
        });
      }

      if (node.type === 'rampa') {
        const next = result.path[index + 1];
        const dir =
          next && next.floor !== node.floor
            ? next.floor === 'superior'
              ? 'Suba'
              : 'Desça'
            : 'Acesse';
        list.push({
          type: 'rampa',
          icon: '♿',
          text: `${dir} pela rampa acessível (${node.label ?? 'Rampa'})`,
        });
      }

      if (node.type === 'sala' || node.type === 'banheiro') {
        list.push({
          type: 'sala',
          icon: node.type === 'banheiro' ? '🚻' : '📍',
          text: node.label ?? node.id,
        });
      }
    });

    return list;
  }, [routeCalculated]);

  return (
    <Modal
      visible={isOpen}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <SafeAreaView
        style={[
          styles.container,
          { backgroundColor: colors.fundoPrincipal },
        ]}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.innerContainer}
        >
          {/* Header */}
          <View
            style={[
              styles.header,
              { borderBottomColor: colors.borda },
            ]}
          >
            <View style={styles.headerTitleRow}>
              <View
                style={[
                  styles.headerIconWrapper,
                  { backgroundColor: `${colors.destaque}20` },
                ]}
              >
                <Navigation size={18} color={colors.destaque} strokeWidth={2.4} />
              </View>
              <Text
                style={[
                  styles.headerTitle,
                  { color: colors.textoPrincipal },
                ]}
              >
                Traçar Rota
              </Text>
            </View>

            <TouchableOpacity
              onPress={onClose}
              style={[
                styles.closeButton,
                { backgroundColor: colors.fundoCartao },
              ]}
            >
              <X size={18} color={colors.textoAuxiliar} />
            </TouchableOpacity>
          </View>

          <FlatList
            data={['main_form']}
            keyExtractor={(item) => item}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollBody}
            renderItem={() => (
              <View>
                {/* Seletores de Origem e Destino */}
                <View
                  style={[
                    styles.formCard,
                    {
                      backgroundColor: colors.fundoCartao,
                      borderColor: colors.borda,
                    },
                  ]}
                >
                  {/* Origem */}
                  <View style={styles.inputGroup}>
                    <Text
                      style={[
                        styles.inputLabel,
                        { color: colors.textoAuxiliar },
                      ]}
                    >
                      Ponto de Partida
                    </Text>
                    <TouchableOpacity
                      style={[
                        styles.selectButton,
                        {
                          backgroundColor: colors.fundoInput,
                          borderColor: colors.borda,
                        },
                      ]}
                      onPress={() => {
                        setSearchQuery('');
                        setPickerTarget('from');
                      }}
                    >
                      <MapPin size={15} color="#10b981" />
                      <Text
                        style={[
                          styles.selectText,
                          { color: colors.textoPrincipal },
                        ]}
                        numberOfLines={1}
                      >
                        {getLabelForId(fromId)}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* Botão de Inverter */}
                  <View style={styles.swapRow}>
                    <View
                      style={[
                        styles.swapLine,
                        { backgroundColor: colors.borda },
                      ]}
                    />
                    <TouchableOpacity
                      style={[
                        styles.swapButton,
                        {
                          backgroundColor: colors.fundoCartao,
                          borderColor: colors.destaque,
                        },
                      ]}
                      onPress={handleSwap}
                      activeOpacity={0.7}
                    >
                      <ArrowUpDown size={14} color={colors.destaque} />
                    </TouchableOpacity>
                    <View
                      style={[
                        styles.swapLine,
                        { backgroundColor: colors.borda },
                      ]}
                    />
                  </View>

                  {/* Destino */}
                  <View style={styles.inputGroup}>
                    <Text
                      style={[
                        styles.inputLabel,
                        { color: colors.textoAuxiliar },
                      ]}
                    >
                      Destino
                    </Text>
                    <TouchableOpacity
                      style={[
                        styles.selectButton,
                        {
                          backgroundColor: colors.fundoInput,
                          borderColor: colors.borda,
                        },
                      ]}
                      onPress={() => {
                        setSearchQuery('');
                        setPickerTarget('to');
                      }}
                    >
                      <MapPin size={15} color="#ef4444" />
                      <Text
                        style={[
                          styles.selectText,
                          {
                            color: toId
                              ? colors.textoPrincipal
                              : colors.textoAuxiliar,
                          },
                        ]}
                        numberOfLines={1}
                      >
                        {getLabelForId(toId)}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* Atalho rápido para banheiro */}
                  <View style={styles.quickShortcuts}>
                    <TouchableOpacity
                      style={[
                        styles.shortcutChip,
                        toId === 'bathroom-closest' && {
                          backgroundColor: `${colors.destaque}25`,
                          borderColor: colors.destaque,
                        },
                      ]}
                      onPress={() => setToId('bathroom-closest')}
                    >
                      <Text style={styles.shortcutEmoji}>🚻</Text>
                      <Text
                        style={[
                          styles.shortcutText,
                          { color: colors.textoPrincipal },
                        ]}
                      >
                        Banheiro mais próximo
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* Filtro de Acessibilidade */}
                  <View
                    style={[
                      styles.switchRow,
                      { borderTopColor: colors.borda },
                    ]}
                  >
                    <View style={styles.switchLabelRow}>
                      <Accessibility size={16} color={colors.destaque} />
                      <View>
                        <Text
                          style={[
                            styles.switchTitle,
                            { color: colors.textoPrincipal },
                          ]}
                        >
                          Apenas rotas acessíveis
                        </Text>
                        <Text
                          style={[
                            styles.switchSubtitle,
                            { color: colors.textoAuxiliar },
                          ]}
                        >
                          Sem degraus ou escadas (utiliza rampas)
                        </Text>
                      </View>
                    </View>
                    <Switch
                      value={accessibleOnly}
                      onValueChange={setAccessibleOnly}
                      trackColor={{
                        false: colors.borda,
                        true: colors.destaque,
                      }}
                      thumbColor="#ffffff"
                    />
                  </View>
                </View>

                {/* Mensagem de Erro */}
                {errorMessage && (
                  <View style={styles.errorBox}>
                    <Text style={styles.errorText}>⚠️ {errorMessage}</Text>
                  </View>
                )}

                {/* Botões de Ação */}
                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={[
                      styles.calcButton,
                      { backgroundColor: colors.destaque },
                    ]}
                    onPress={handleCalculateRoute}
                    activeOpacity={0.8}
                  >
                    <Navigation size={17} color="#000000" strokeWidth={2.4} />
                    <Text style={styles.calcButtonText}>Calcular Rota</Text>
                  </TouchableOpacity>

                  {routeCalculated && (
                    <TouchableOpacity
                      style={[
                        styles.clearButton,
                        {
                          backgroundColor: colors.fundoCartao,
                          borderColor: colors.borda,
                        },
                      ]}
                      onPress={handleClearRoute}
                    >
                      <Trash2 size={16} color="#ef4444" />
                    </TouchableOpacity>
                  )}
                </View>

                {/* Detalhes da Rota Calculada */}
                {routeCalculated && (
                  <View
                    style={[
                      styles.resultCard,
                      {
                        backgroundColor: colors.fundoCartao,
                        borderColor: colors.destaque,
                      },
                    ]}
                  >
                    <View style={styles.resultHeader}>
                      <View>
                        <Text
                          style={[
                            styles.resultTitle,
                            { color: colors.destaque },
                          ]}
                        >
                          Rota Encontrada!
                        </Text>
                        <Text
                          style={[
                            styles.resultMeta,
                            { color: colors.textoAuxiliar },
                          ]}
                        >
                          {routeCalculated.pathResult.path.length} pontos no
                          grafo ·{' '}
                          {routeCalculated.pathResult.floorChanges.length > 0
                            ? `${routeCalculated.pathResult.floorChanges.length} troca(s) de andar`
                            : 'Mesmo andar'}
                        </Text>
                      </View>

                      <TouchableOpacity
                        style={[
                          styles.viewMapButton,
                          { backgroundColor: colors.destaque },
                        ]}
                        onPress={onClose}
                      >
                        <Text style={styles.viewMapText}>Ver no Mapa</Text>
                      </TouchableOpacity>
                    </View>

                    {/* Passos */}
                    <Text
                      style={[
                        styles.stepsHeader,
                        { color: colors.textoPrincipal },
                      ]}
                    >
                      Instruções passo a passo:
                    </Text>

                    <View style={styles.stepsList}>
                      {steps.map((step, idx) => (
                        <View key={`step-${idx}`} style={styles.stepItem}>
                          <Text style={styles.stepIcon}>{step.icon}</Text>
                          <Text
                            style={[
                              styles.stepText,
                              {
                                color:
                                  step.type === 'floor'
                                    ? colors.destaque
                                    : colors.textoPrincipal,
                                fontWeight:
                                  step.type === 'floor' ? '700' : '400',
                              },
                            ]}
                          >
                            {step.text}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}
              </View>
            )}
          />

          {/* Modal de Busca / Seleção de Local */}
          <Modal
            visible={pickerTarget !== null}
            animationType="fade"
            transparent
            onRequestClose={() => setPickerTarget(null)}
          >
            <SafeAreaView style={styles.pickerOverlay}>
              <View
                style={[
                  styles.pickerContainer,
                  {
                    backgroundColor: colors.fundoCartao,
                    borderColor: colors.borda,
                  },
                ]}
              >
                <View style={styles.pickerHeader}>
                  <Text
                    style={[
                      styles.pickerTitle,
                      { color: colors.textoPrincipal },
                    ]}
                  >
                    {pickerTarget === 'from'
                      ? 'Selecione o Ponto de Partida'
                      : 'Selecione o Destino'}
                  </Text>
                  <TouchableOpacity
                    onPress={() => setPickerTarget(null)}
                    style={styles.pickerClose}
                  >
                    <X size={18} color={colors.textoAuxiliar} />
                  </TouchableOpacity>
                </View>

                {/* Input de Busca */}
                <View
                  style={[
                    styles.searchRow,
                    {
                      backgroundColor: colors.fundoInput,
                      borderColor: colors.borda,
                    },
                  ]}
                >
                  <Search size={16} color={colors.textoAuxiliar} />
                  <TextInput
                    style={[
                      styles.searchInput,
                      { color: colors.textoPrincipal },
                    ]}
                    placeholder="Buscar sala, bloco ou código..."
                    placeholderTextColor={colors.textoAuxiliar}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    autoFocus
                  />
                  {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchQuery('')}>
                      <X size={15} color={colors.textoAuxiliar} />
                    </TouchableOpacity>
                  )}
                </View>

                {/* Lista de Opções */}
                <FlatList
                  data={selectableOptions}
                  keyExtractor={(item) => item.id}
                  showsVerticalScrollIndicator={false}
                  renderItem={({ item }) => {
                    const isSelected =
                      pickerTarget === 'from'
                        ? fromId === item.id
                        : toId === item.id;

                    return (
                      <TouchableOpacity
                        style={[
                          styles.optionItem,
                          { borderBottomColor: colors.borda },
                          isSelected && {
                            backgroundColor: `${colors.destaque}15`,
                          },
                        ]}
                        onPress={() => {
                          if (pickerTarget === 'from') {
                            setFromId(item.id);
                          } else {
                            setToId(item.id);
                          }
                          setPickerTarget(null);
                          setRouteCalculated(null);
                        }}
                      >
                        <View style={styles.optionInfo}>
                          <Text
                            style={[
                              styles.optionLabel,
                              { color: colors.textoPrincipal },
                            ]}
                          >
                            {item.label}
                          </Text>
                          <Text
                            style={[
                              styles.optionFloor,
                              { color: colors.textoAuxiliar },
                            ]}
                          >
                            {item.floor === 'terreo'
                              ? 'Andar Térreo'
                              : item.floor === 'superior'
                              ? 'Andar Superior'
                              : 'Subsolo'}
                          </Text>
                        </View>
                        {isSelected && (
                          <Check size={16} color={colors.destaque} />
                        )}
                      </TouchableOpacity>
                    );
                  }}
                  ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                      <Text
                        style={[
                          styles.emptyText,
                          { color: colors.textoAuxiliar },
                        ]}
                      >
                        Nenhum local encontrado para &quot;{searchQuery}&quot;
                      </Text>
                    </View>
                  }
                />
              </View>
            </SafeAreaView>
          </Modal>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  closeButton: {
    padding: 6,
    borderRadius: 8,
  },
  scrollBody: {
    padding: 16,
    paddingBottom: 40,
  },
  formCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    marginBottom: 14,
  },
  inputGroup: {
    marginBottom: 4,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    gap: 8,
  },
  selectText: {
    fontSize: 13.5,
    fontWeight: '600',
    flex: 1,
  },
  swapRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  swapLine: {
    flex: 1,
    height: 1,
  },
  swapButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  quickShortcuts: {
    flexDirection: 'row',
    marginTop: 10,
  },
  shortcutChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'transparent',
    gap: 6,
  },
  shortcutEmoji: {
    fontSize: 13,
  },
  shortcutText: {
    fontSize: 11.5,
    fontWeight: '600',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  switchLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  switchTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  switchSubtitle: {
    fontSize: 11,
    marginTop: 1,
  },
  errorBox: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: '#ef4444',
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    fontWeight: '600',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  calcButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    borderRadius: 12,
    gap: 8,
    elevation: 3,
  },
  calcButtonText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '800',
  },
  clearButton: {
    width: 46,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultCard: {
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 14,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  resultMeta: {
    fontSize: 11.5,
    marginTop: 2,
  },
  viewMapButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  viewMapText: {
    color: '#000000',
    fontSize: 11.5,
    fontWeight: '700',
  },
  stepsHeader: {
    fontSize: 12.5,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  stepsList: {
    gap: 6,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingVertical: 4,
  },
  stepIcon: {
    fontSize: 15,
  },
  stepText: {
    fontSize: 12.5,
    lineHeight: 18,
    flex: 1,
  },
  pickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  pickerContainer: {
    height: '75%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    padding: 16,
  },
  pickerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  pickerTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  pickerClose: {
    padding: 4,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    padding: 0,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
  },
  optionInfo: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 13.5,
    fontWeight: '600',
  },
  optionFloor: {
    fontSize: 11,
    marginTop: 2,
  },
  emptyContainer: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 12,
  },
});
