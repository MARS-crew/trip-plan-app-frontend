import React from 'react';
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
    // 2. 렌더링
    if (onPress) {
      return (
        <Pressable
          onPress={onPress}
          className={`px-4 py-2 bg-chip rounded-2xl ${className ?? ''}`}
          accessibilityRole="button"
          accessibilityLabel={label}
          accessibilityState={{ selected: isSelected }}>
          <Text className="text-p text-black">{label}</Text>
        </Pressable>
      );
    }

    return (
      <View
        className={`px-4 py-2 bg-chip rounded-2xl ${className ?? ''}`}
        accessibilityLabel={label}>
        <Text className="text-p text-black">{label}</Text>
      </View>
    );
  },
);

Chip.displayName = 'Chip';

export default Chip;
