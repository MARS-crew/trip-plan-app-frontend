import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Shadow } from 'react-native-shadow-2';

// ============ Types ============
export interface CategoryChipProps {
  category: string;
  onPress?: (category: string) => void;
}

// ============ Component ============
export const CategoryChip = React.memo<CategoryChipProps>(({ category, onPress }) => {
  return (
    <View key={category} className="flex-1">
      <Shadow
        distance={2}
        startColor="rgba(0,0,0,0.1)"
        style={{
          borderRadius: 8,
          width: '100%',
        }}
        stretch>
        <TouchableOpacity
          className="h-11 rounded-xl bg-white justify-center items-center"
          onPress={() => onPress?.(category)}
          activeOpacity={0.7}
        >
          <Text className="text-sm font-pretendardMedium">{category}</Text>
        </TouchableOpacity>
      </Shadow>
    </View>
  );
});

CategoryChip.displayName = 'CategoryChip';
