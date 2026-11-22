import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Linking,
} from 'react-native';
import { Compass, ExternalLink, X, Heart, Accessibility } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeContext';

interface AboutModalProps {
  visible: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ visible, onClose }) => {
  const { colors } = useTheme();

  const handleOpenMorea = () => {
    Linking.openURL('https://morea-ifs.org/').catch((err) =>
      console.warn('Erro ao abrir link:', err)
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.overlay}>
        <View
          style={[
            styles.container,
            {
              backgroundColor: colors.fundoCartao,
              borderColor: colors.borda,
            },
          ]}
        >
          <View style={styles.header}>
            <View style={styles.brand}>
              <View
                style={[
                  styles.iconWrapper,
                  { backgroundColor: colors.destaque },
                ]}
              >
                <Compass size={18} color="#000000" strokeWidth={2.4} />
              </View>
              <Text style={[styles.title, { color: colors.textoPrincipal }]}>
                Sobre o MERO
              </Text>
            </View>

            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={18} color={colors.textoAuxiliar} />
            </TouchableOpacity>
          </View>

          <Text style={[styles.description, { color: colors.textoSecundario }]}>
            O <Text style={{ color: colors.textoPrincipal, fontWeight: '700' }}>MERO</Text> (Mapa de Espaços, Recursos e Orientação) é um sistema de navegação e cartografia interativa desenvolvido para a comunidade acadêmica do Instituto Federal de Sergipe (IFS) — Campus Aracaju.
          </Text>

          {/* Destaques de Funcionalidades */}
          <View style={styles.features}>
            <View
              style={[
                styles.featureItem,
                { backgroundColor: colors.fundoInput },
              ]}
            >
              <Accessibility size={16} color={colors.destaque} />
              <Text
                style={[
                  styles.featureText,
                  { color: colors.textoPrincipal },
                ]}
              >
                Algoritmo A* com filtro para rotas acessíveis (sem escadas).
              </Text>
            </View>

            <View
              style={[
                styles.featureItem,
                { backgroundColor: colors.fundoInput },
              ]}
            >
              <Heart size={16} color="#ef4444" />
              <Text
                style={[
                  styles.featureText,
                  { color: colors.textoPrincipal },
                ]}
              >
                Mapeamento completo dos blocos A a H, salas e setores.
              </Text>
            </View>
          </View>

          {/* Link Morea */}
          <TouchableOpacity
            style={[
              styles.linkButton,
              {
                backgroundColor: colors.fundoInput,
                borderColor: colors.destaque,
              },
            ]}
            onPress={handleOpenMorea}
            activeOpacity={0.8}
          >
            <View style={styles.linkInfo}>
              <Text style={[styles.linkTitle, { color: colors.destaque }]}>
                Projeto MOREA — IFS
              </Text>
              <Text
                style={[styles.linkSub, { color: colors.textoAuxiliar }]}
              >
                Monitoramento de Recursos e Eficiência Energética
              </Text>
            </View>
            <ExternalLink size={16} color={colors.destaque} />
          </TouchableOpacity>

          <View style={[styles.footer, { borderTopColor: colors.borda }]}>
            <Text style={[styles.footerText, { color: colors.textoAuxiliar }]}>
              Versão 1.0.0 · MERO Mobile
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    padding: 20,
  },
  container: {
    borderRadius: 20,
    borderWidth: 1.5,
    padding: 18,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
  },
  closeBtn: {
    padding: 4,
  },
  description: {
    fontSize: 12.5,
    lineHeight: 18,
    marginBottom: 14,
  },
  features: {
    gap: 8,
    marginBottom: 14,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    gap: 10,
  },
  featureText: {
    fontSize: 11.5,
    flex: 1,
    lineHeight: 16,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 14,
  },
  linkInfo: {
    flex: 1,
  },
  linkTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  linkSub: {
    fontSize: 10.5,
    marginTop: 2,
  },
  footer: {
    paddingTop: 10,
    borderTopWidth: 1,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 10.5,
  },
});
