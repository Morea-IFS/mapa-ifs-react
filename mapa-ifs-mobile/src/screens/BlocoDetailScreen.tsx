import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ArrowLeft, Zap, ExternalLink, MapPin } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeContext';
import { getBlocoById } from '../data/blocos';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'BlocoDetail'>;

export const BlocoDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { blocoId } = route.params;
  const { colors } = useTheme();

  const bloco = getBlocoById(blocoId);

  if (!bloco) {
    return (
      <SafeAreaView
        style={[styles.safeArea, { backgroundColor: colors.fundoPrincipal }]}
      >
        <View style={styles.notFoundContainer}>
          <Text style={[styles.notFoundTitle, { color: colors.textoPrincipal }]}>
            Bloco não encontrado
          </Text>
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: colors.destaque }]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Voltar ao Mapa</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const accentColor = bloco.color || colors.destaque;
  const totalRooms = bloco.floors.reduce((acc, f) => acc + f.rooms.length, 0);

  const handleOpenEnergyDashboard = () => {
    if (bloco.energyDashboardId) {
      Linking.openURL(
        `https://morea-ifs.org/device-fullscreen/${bloco.energyDashboardId}/`
      ).catch((err) => console.warn('Erro ao abrir dashboard:', err));
    }
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.fundoPrincipal }]}
      edges={['top', 'left', 'right']}
    >
      <StatusBar style={colors.statusBarStyle === 'dark' ? 'dark' : 'light'} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {/* Top Bar com Voltar */}
        <View style={styles.topBar}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={[
              styles.navBackButton,
              {
                backgroundColor: colors.fundoCartao,
                borderColor: colors.borda,
              },
            ]}
            activeOpacity={0.7}
          >
            <ArrowLeft size={18} color={colors.textoPrincipal} strokeWidth={2.4} />
          </TouchableOpacity>

          <View
            style={[
              styles.blockBadge,
              {
                backgroundColor: `${accentColor}20`,
                borderColor: accentColor,
              },
            ]}
          >
            <Text style={[styles.blockBadgeText, { color: accentColor }]}>
              {bloco.id}
            </Text>
          </View>
        </View>

        {/* Informações Principais do Bloco */}
        <View style={styles.headerSection}>
          <Text style={[styles.blockTitle, { color: accentColor }]}>
            {bloco.name}
          </Text>
          <Text
            style={[styles.blockDescription, { color: colors.textoSecundario }]}
          >
            {bloco.description}
          </Text>

          {/* Badges de Andares e Salas */}
          <View style={styles.metricsRow}>
            <View
              style={[
                styles.metricBadge,
                {
                  backgroundColor: colors.fundoCartao,
                  borderColor: colors.borda,
                },
              ]}
            >
              <Text style={[styles.metricNumber, { color: accentColor }]}>
                {bloco.floors.length}
              </Text>
              <Text
                style={[styles.metricLabel, { color: colors.textoAuxiliar }]}
              >
                {bloco.floors.length === 1 ? 'Andar' : 'Andares'}
              </Text>
            </View>

            <View
              style={[
                styles.metricBadge,
                {
                  backgroundColor: colors.fundoCartao,
                  borderColor: colors.borda,
                },
              ]}
            >
              <Text style={[styles.metricNumber, { color: accentColor }]}>
                {totalRooms}
              </Text>
              <Text
                style={[styles.metricLabel, { color: colors.textoAuxiliar }]}
              >
                Salas mapeadas
              </Text>
            </View>
          </View>
        </View>

        {/* Card de Consumo Elétrico (quando disponível) */}
        {bloco.energyDashboardId && (
          <TouchableOpacity
            style={[
              styles.energyCard,
              {
                backgroundColor: colors.fundoCartao,
                borderColor: '#eab308',
              },
            ]}
            onPress={handleOpenEnergyDashboard}
            activeOpacity={0.8}
          >
            <View style={styles.energyLeft}>
              <View style={styles.energyIconBox}>
                <Zap size={20} color="#eab308" fill="#eab308" />
              </View>
              <View>
                <Text
                  style={[
                    styles.energyTitle,
                    { color: colors.textoPrincipal },
                  ]}
                >
                  Consumo Elétrico em Tempo Real
                </Text>
                <Text
                  style={[
                    styles.energySubtitle,
                    { color: colors.textoAuxiliar },
                  ]}
                >
                  Acesse o painel do Projeto MOREA
                </Text>
              </View>
            </View>
            <ExternalLink size={16} color="#eab308" />
          </TouchableOpacity>
        )}

        {/* Lista de Andares e Plantas Baixas */}
        <View style={styles.floorsSection}>
          <Text
            style={[styles.sectionHeading, { color: colors.textoAuxiliar }]}
          >
            Plantas e Salas por Andar
          </Text>

          {bloco.floors.map((floor, floorIndex) => (
            <View
              key={`floor-${floorIndex}`}
              style={[
                styles.floorCard,
                {
                  backgroundColor: colors.fundoCartao,
                  borderColor: colors.borda,
                },
              ]}
            >
              {/* Título do Andar */}
              <View
                style={[
                  styles.floorHeader,
                  { borderBottomColor: colors.borda },
                ]}
              >
                <View
                  style={[
                    styles.floorIndicatorDot,
                    { backgroundColor: accentColor },
                  ]}
                />
                <Text style={[styles.floorName, { color: accentColor }]}>
                  {floor.name}
                </Text>
              </View>

              {/* Imagem da Planta Baixa */}
              <View
                style={[
                  styles.imageWrapper,
                  { backgroundColor: colors.fundoSecundario },
                ]}
              >
                <Image
                  source={floor.image}
                  style={styles.floorImage}
                  resizeMode="contain"
                />
              </View>

              {/* Salas e Setores */}
              <View style={styles.roomsContainer}>
                <Text
                  style={[
                    styles.roomsSectionTitle,
                    { color: colors.textoAuxiliar },
                  ]}
                >
                  Salas e Setores
                </Text>

                <View style={styles.roomsList}>
                  {floor.rooms.map((room, roomIdx) => (
                    <View
                      key={`room-${roomIdx}`}
                      style={[
                        styles.roomItem,
                        { borderBottomColor: colors.borda },
                      ]}
                    >
                      <View
                        style={[
                          styles.roomCodeBadge,
                          {
                            backgroundColor: `${accentColor}18`,
                            borderColor: `${accentColor}40`,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.roomCodeText,
                            { color: accentColor },
                          ]}
                        >
                          {room.code}
                        </Text>
                      </View>
                      <Text
                        style={[
                          styles.roomNameText,
                          { color: colors.textoPrincipal },
                        ]}
                      >
                        {room.name}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  navBackButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  blockBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1.5,
  },
  blockBadgeText: {
    fontSize: 13,
    fontWeight: '800',
  },
  headerSection: {
    paddingVertical: 14,
  },
  blockTitle: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  blockDescription: {
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 16,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  metricBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  metricNumber: {
    fontSize: 14,
    fontWeight: '800',
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  energyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    marginBottom: 20,
  },
  energyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  energyIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(234, 179, 8, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  energyTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  energySubtitle: {
    fontSize: 11,
    marginTop: 2,
  },
  floorsSection: {
    marginTop: 6,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  floorCard: {
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 18,
  },
  floorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    gap: 8,
  },
  floorIndicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  floorName: {
    fontSize: 15,
    fontWeight: '800',
  },
  imageWrapper: {
    width: '100%',
    height: 220,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  floorImage: {
    width: '100%',
    height: '100%',
  },
  roomsContainer: {
    padding: 16,
  },
  roomsSectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  roomsList: {
    gap: 2,
  },
  roomItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    borderBottomWidth: 1,
    gap: 10,
  },
  roomCodeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    minWidth: 44,
    alignItems: 'center',
  },
  roomCodeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  roomNameText: {
    fontSize: 12.5,
    flex: 1,
  },
  notFoundContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  notFoundTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  backButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },
  backButtonText: {
    color: '#000000',
    fontWeight: '700',
    fontSize: 14,
  },
});
