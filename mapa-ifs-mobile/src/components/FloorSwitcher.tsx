import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Building2, ArrowDown, ArrowUp } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeContext';
import { FloorLevel } from '../types';

interface FloorSwitcherProps {
  currentFloor: FloorLevel;
  onFloorChange: (floor: FloorLevel) => void;
}

export const FloorSwitcher: React.FC<FloorSwitcherProps> = ({
  currentFloor,
  onFloorChange,
}) => {
  const { colors } = useTheme();

  const options: { value: FloorLevel; label: string; icon: any }[] = [
    { value: 'subsolo', label: 'Subsolo', icon: ArrowDown },
    { value: 'terreo', label: 'Térreo', icon: Building2 },
    { value: 'superior', label: 'Superior', icon: ArrowUp },
  ];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.fundoCartao,
          borderColor: colors.borda,
        },
      ]}
    >
      {options.map((opt) => {
        const Icon = opt.icon;
        const isSelected = currentFloor === opt.value;

        return (
          <TouchableOpacity
            key={opt.value}
            onPress={() => onFloorChange(opt.value)}
            activeOpacity={0.7}
            style={[
              styles.button,
              isSelected && {
                backgroundColor: colors.destaque,
                shadowColor: colors.destaque,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.35,
                shadowRadius: 6,
                elevation: 4,
              },
            ]}
          >
            <Icon
              size={15}
              color={isSelected ? '#000000' : colors.textoAuxiliar}
              strokeWidth={2.2}
            />
            <Text
              style={[
                styles.label,
                {
                  color: isSelected ? '#000000' : colors.textoAuxiliar,
                  fontWeight: isSelected ? '700' : '600',
                },
              ]}
            >
              {opt.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 14,
    borderWidth: 1,
    padding: 3,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    paddingHorizontal: 10,
    borderRadius: 11,
    gap: 6,
  },
  label: {
    fontSize: 12,
    letterSpacing: -0.2,
  },
});
