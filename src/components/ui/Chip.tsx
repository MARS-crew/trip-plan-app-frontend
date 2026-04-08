import React, { useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';

// ============ Types ============
export interface ChipProps {
  label: string;
  onPress?: () => void;
  isSelected?: boolean;
  className?: string;
}

// ============ Component ============
export const Chip = React.memo<ChipProps>(
  ({ label, onPress, isSelected = false, className }) => {
    // Hooks
    const handlePress = useCallback(() => {
      onPress?.();
    }, [onPress]);

    // 렌더링
    if (onPress) {
      return (
        <Pressable
          onPress={handlePress}
          className={`px-4 py-[6px] rounded-2xl ${isSelected ? 'bg-main' : 'bg-chip'} ${className ?? ''}`}
          accessibilityRole="button"
          accessibilityLabel={label}
          accessibilityState={{ selected: isSelected }}>
          <Text className={`text-p ${isSelected ? 'text-white' : 'text-gray'}`}>{label}</Text>
        </Pressable>
      );
    }

    return (
      <View
        className={`px-4 py-[6px] rounded-2xl ${isSelected ? 'bg-main' : 'bg-chip'} ${className ?? ''}`}
        accessibilityLabel={label}>
        <Text className={`text-p ${isSelected ? 'text-white' : 'text-gray'}`}>{label}</Text>
      </View>
    );
  },
);

Chip.displayName = 'Chip';

export default Chip;