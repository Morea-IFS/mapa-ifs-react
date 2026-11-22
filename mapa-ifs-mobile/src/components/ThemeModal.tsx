import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Moon, Sun, Eye, X, Check } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeContext';
import { ThemeMode } from '../theme/colors';

interface ThemeModalProps {
  visible: boolean;
  onClose: () => void;
}

export const ThemeModal: React.FC<ThemeModalProps> = ({ visible, onClose }) => {
  const { colors, themeMode, setThemeMode } = useTheme();

  const themeOptions: {
    mode: ThemeMode;
    label: string;
    description: string;
    icon: any;
  }[] = [
    {
      mode: 'escuro',
      label: 'Tema Escuro (Padrão)',
      description: 'Ideal para ambientes com pouca luz e economia de bateria.',
      icon: Moon,
    },
    {
      mode: 'claro',
      label: 'Tema Claro',
      description: 'Maior contraste para ambientes abertos e sob sol forte.',
      icon: Sun,
    },
    {
      mode: 'alto-contraste',
      label: 'Alto Contraste',
      description: 'Preto puro com amarelo e verde para acessibilidade visual.',
      icon: Eye,
    },
  ];

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
            <Text style={[styles.title, { color: colors.textoPrincipal }]}>
              Aparência do Aplicativo
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={18} color={colors.textoAuxiliar} />
            </TouchableOpacity>
          </View>

          <View style={styles.list}>
            {themeOptions.map((opt) => {
              const Icon = opt.icon;
              const isSelected = themeMode === opt.mode;

              return (
                <TouchableOpacity
                  key={opt.mode}
                  style={[
                    styles.option,
                    {
                      backgroundColor: isSelected
                        ? `${colors.destaque}15`
                        : colors.fundoInput,
                      borderColor: isSelected
                        ? colors.destaque
                        : colors.borda,
                    },
                  ]}
                  onPress={() => {
                    setThemeMode(opt.mode);
                    onClose();
                  }}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.iconCircle,
                      {
                        backgroundColor: isSelected
                          ? colors.destaque
                          : colors.fundoCartao,
                      },
                    ]}
                  >
                    <Icon
                      size={18}
                      color={isSelected ? '#000000' : colors.textoAuxiliar}
                      strokeWidth={2.2}
                    />
                  </View>

                  <View style={styles.optionContent}>
                    <Text
                      style={[
                        styles.optionLabel,
                        { color: colors.textoPrincipal },
                      ]}
                    >
                      {opt.label}
                    </Text>
                    <Text
                      style={[
                        styles.optionDesc,
                        { color: colors.textoAuxiliar },
                      ]}
                    >
                      {opt.description}
                    </Text>
                  </View>

                  {isSelected && (
                    <Check size={18} color={colors.destaque} strokeWidth={2.4} />
                  )}
                </TouchableOpacity>
              );
            })}
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
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
  },
  closeBtn: {
    padding: 4,
  },
  list: {
    gap: 10,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    gap: 12,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionContent: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 13.5,
    fontWeight: '700',
    marginBottom: 2,
  },
  optionDesc: {
    fontSize: 11,
    lineHeight: 14,
  },
});
