import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ArrowRight } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeContext';
import { BlocoData } from '../types';

interface BlocoCardProps {
  bloco: BlocoData;
  onPress: () => void;
}

export const BlocoCard: React.FC<BlocoCardProps> = ({ bloco, onPress }) => {
  const { colors } = useTheme();
  const accentColor = bloco.color || colors.destaque;
  const totalRooms = bloco.floors.reduce((acc, f) => acc + f.rooms.length, 0);
  const cleanDescription = bloco.description.replace(/^Bloco[s]?\s\w+\s—\s/, '');

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: colors.fundoCartao,
          borderColor: colors.borda,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <View style={[styles.colorBar, { backgroundColor: accentColor }]} />

      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={[styles.title, { color: colors.textoPrincipal }]}>
            {bloco.name}
          </Text>
          <View
            style={[
              styles.pill,
              {
                backgroundColor: `${accentColor}18`,
                borderColor: `${accentColor}40`,
              },
            ]}
          >
            <Text style={[styles.pillText, { color: accentColor }]}>
              {bloco.id}
            </Text>
          </View>
        </View>

        <Text
          style={[styles.description, { color: colors.textoAuxiliar }]}
          numberOfLines={2}
        >
          {cleanDescription}
        </Text>

        <View style={styles.footerRow}>
          <Text style={[styles.metaText, { color: colors.textoSecundario }]}>
            {bloco.floors.length}{' '}
            {bloco.floors.length === 1 ? 'andar' : 'andares'} · {totalRooms}{' '}
            salas
          </Text>
          <ArrowRight size={15} color={accentColor} strokeWidth={2.4} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  colorBar: {
    width: 5,
    alignSelf: 'stretch',
  },
  content: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
  },
  pill: {
    paddingHorizontal: 7,
    paddingVertical: 1.5,
    borderRadius: 6,
    borderWidth: 1,
  },
  pillText: {
    fontSize: 11,
    fontWeight: '800',
  },
  description: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 8,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metaText: {
    fontSize: 11,
    fontWeight: '500',
  },
});
