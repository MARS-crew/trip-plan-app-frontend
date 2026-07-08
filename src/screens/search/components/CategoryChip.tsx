import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

// ============ Types ============
export interface CategoryChipProps {
  category: string;
  onPress?: (category: string) => void;
}

// ============ Constants ============
const CHIP_SHADOW_STYLE = { elevation: 2 };

// ============ Component ============
export const CategoryChip = React.memo<CategoryChipProps>(({ category, onPress }) => {
  return (
    <TouchableOpacity
      className="h-11 rounded-xl bg-white justify-center items-center"
      style={CHIP_SHADOW_STYLE}
      onPress={() => onPress?.(category)}
      activeOpacity={0.7}
    >
      <Text className="text-sm font-pretendardMedium">{category}</Text>
    </TouchableOpacity>
  );
});

CategoryChip.displayName = 'CategoryChip';
