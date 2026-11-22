import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Compass, Moon, Sun, Eye, Info } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeContext';

interface HeaderProps {
  onOpenTheme: () => void;
  onOpenAbout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenTheme, onOpenAbout }) => {
  const { colors, themeMode } = useTheme();

  const ThemeIcon =
    themeMode === 'claro' ? Sun : themeMode === 'alto-contraste' ? Eye : Moon;

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.brandContainer}>
          <View
            style={[
              styles.iconWrapper,
              {
                backgroundColor: colors.destaque,
                shadowColor: colors.destaque,
              },
            ]}
          >
            <Compass size={18} color="#000000" strokeWidth={2.4} />
          </View>
          <View>
            <Text
              style={[
                styles.title,
                {
                  color: colors.textoPrincipal,
                },
              ]}
            >
              MERO
            </Text>
            <Text style={[styles.badgeText, { color: colors.destaque }]}>
              IFS · Campus Aracaju
            </Text>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              {
                backgroundColor: colors.fundoCartao,
                borderColor: colors.borda,
              },
            ]}
            onPress={onOpenTheme}
            activeOpacity={0.7}
            accessibilityLabel="Mudar tema de cores"
          >
            <ThemeIcon size={17} color={colors.destaque} strokeWidth={2.2} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionButton,
              {
                backgroundColor: colors.fundoCartao,
                borderColor: colors.borda,
              },
            ]}
            onPress={onOpenAbout}
            activeOpacity={0.7}
            accessibilityLabel="Sobre o MERO"
          >
            <Info size={17} color={colors.textoAuxiliar} strokeWidth={2.2} />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={[styles.subtitle, { color: colors.textoSecundario }]}>
        Mapa de Espaços, Recursos e Orientação
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 8,
    paddingBottom: 14,
    paddingHorizontal: 16,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitle: {
    fontSize: 12.5,
    lineHeight: 17,
  },
});
