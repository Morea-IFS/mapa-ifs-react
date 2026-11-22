import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Navigation as NavIcon, X, Compass } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeContext';
import { Header } from '../components/Header';
import { FloorSwitcher } from '../components/FloorSwitcher';
import { CampusMap } from '../components/CampusMap';
import { BlocoCard } from '../components/BlocoCard';
import { RouteDrawer } from '../components/RouteDrawer';
import { ThemeModal } from '../components/ThemeModal';
import { AboutModal } from '../components/AboutModal';
import { blocos } from '../data/blocos';
import { NAV_NODES } from '../data/navigationGraph';
import { FloorLevel, RouteResult } from '../types';
import { RootStackParamList } from '../types/navigation';

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Home'
>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { colors, themeMode } = useTheme();

  const [currentFloor, setCurrentFloor] = useState<FloorLevel>('terreo');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [routeResult, setRouteResult] = useState<RouteResult | null>(null);
  const [themeModalVisible, setThemeModalVisible] = useState(false);
  const [aboutModalVisible, setAboutModalVisible] = useState(false);

  const handleRouteChange = useCallback((result: RouteResult | null) => {
    setRouteResult(result);

    // Ajusta automaticamente o andar para o ponto de partida da rota
    if (result) {
      const originNode = NAV_NODES.find((n) => n.id === result.fromId);
      if (originNode) {
        setCurrentFloor(originNode.floor);
      }
    }
  }, []);

  const handleSelectBloco = (blocoId: string) => {
    navigation.navigate('BlocoDetail', { blocoId });
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
        {/* Cabeçalho */}
        <Header
          onOpenTheme={() => setThemeModalVisible(true)}
          onOpenAbout={() => setAboutModalVisible(true)}
        />

        {/* Barra de Controles: Seletor de Andar + Botão Traçar Rota */}
        <View style={styles.controlsRow}>
          <View style={styles.switcherWrapper}>
            <FloorSwitcher
              currentFloor={currentFloor}
              onFloorChange={setCurrentFloor}
            />
          </View>

          <TouchableOpacity
            style={[
              styles.routeButton,
              routeResult
                ? {
                    backgroundColor: colors.destaque,
                    borderColor: colors.destaque,
                    shadowColor: colors.destaque,
                  }
                : {
                    backgroundColor: colors.fundoCartao,
                    borderColor: colors.borda,
                  },
            ]}
            onPress={() => setDrawerOpen(true)}
            activeOpacity={0.8}
          >
            <NavIcon
              size={15}
              color={routeResult ? '#000000' : colors.textoPrincipal}
              strokeWidth={2.4}
            />
            <Text
              style={[
                styles.routeButtonText,
                {
                  color: routeResult ? '#000000' : colors.textoPrincipal,
                  fontWeight: '700',
                },
              ]}
            >
              {routeResult ? 'Rota Ativa' : 'Rotas'}
            </Text>
            {routeResult && <View style={styles.activePulseDot} />}
          </TouchableOpacity>
        </View>

        {/* Banner de Rota Ativa */}
        {routeResult && (
          <View
            style={[
              styles.routeBanner,
              {
                backgroundColor: `${colors.destaque}15`,
                borderColor: `${colors.destaque}40`,
              },
            ]}
          >
            <NavIcon size={14} color={colors.destaque} strokeWidth={2.4} />
            <Text
              style={[styles.bannerText, { color: colors.textoPrincipal }]}
              numberOfLines={1}
            >
              <Text style={{ color: colors.destaque, fontWeight: '700' }}>
                Rota ativa:{' '}
              </Text>
              {routeResult.pathResult.floorChanges.length > 0
                ? `${routeResult.pathResult.floorChanges.length} troca(s) de andar`
                : 'mesmo andar'}
              {routeResult.accessibleOnly ? ' · Acessível' : ''}
            </Text>

            <TouchableOpacity
              onPress={() => setRouteResult(null)}
              style={styles.bannerClearBtn}
            >
              <X size={15} color={colors.textoAuxiliar} />
            </TouchableOpacity>
          </View>
        )}

        {/* Mapa Interativo do Campus */}
        <CampusMap
          floor={currentFloor}
          routeResult={routeResult}
          onSelectBloco={handleSelectBloco}
        />

        {/* Seção Acesso Rápido */}
        <View style={styles.quickAccessSection}>
          <View style={styles.sectionHeader}>
            <Text
              style={[styles.sectionTitle, { color: colors.textoAuxiliar }]}
            >
              Acesso Rápido aos Blocos
            </Text>
            <Text style={[styles.sectionCount, { color: colors.destaque }]}>
              {blocos.length} Blocos
            </Text>
          </View>

          {blocos.map((bloco) => (
            <BlocoCard
              key={bloco.id}
              bloco={bloco}
              onPress={() => handleSelectBloco(bloco.id)}
            />
          ))}
        </View>

        {/* Rodapé */}
        <View style={[styles.footer, { borderTopColor: colors.borda }]}>
          <View style={styles.footerBrand}>
            <Compass size={14} color={colors.destaque} />
            <Text
              style={[styles.footerTitle, { color: colors.textoPrincipal }]}
            >
              MERO · IFS
            </Text>
          </View>
          <Text style={[styles.footerSub, { color: colors.textoAuxiliar }]}>
            Desenvolvido para o Projeto Morea — Instituto Federal de Sergipe
          </Text>
        </View>
      </ScrollView>

      {/* Drawer de Busca e Traçado de Rota */}
      <RouteDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onRouteChange={handleRouteChange}
        activeRoute={routeResult}
      />

      {/* Modais */}
      <ThemeModal
        visible={themeModalVisible}
        onClose={() => setThemeModalVisible(false)}
      />

      <AboutModal
        visible={aboutModalVisible}
        onClose={() => setAboutModalVisible(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContainer: {
    paddingBottom: 30,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  switcherWrapper: {
    flex: 1,
  },
  routeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 6,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },
  routeButtonText: {
    fontSize: 12.5,
  },
  activePulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#000000',
  },
  routeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  bannerText: {
    fontSize: 12,
    flex: 1,
  },
  bannerClearBtn: {
    padding: 2,
  },
  quickAccessSection: {
    paddingHorizontal: 16,
    marginTop: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  sectionCount: {
    fontSize: 11,
    fontWeight: '700',
  },
  footer: {
    marginHorizontal: 16,
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    alignItems: 'center',
  },
  footerBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  footerTitle: {
    fontSize: 12,
    fontWeight: '800',
  },
  footerSub: {
    fontSize: 10.5,
    textAlign: 'center',
  },
});
