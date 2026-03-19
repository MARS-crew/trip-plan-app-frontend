import React from 'react';
import { View, Text } from 'react-native';
import { Shadow } from 'react-native-shadow-2';

// ============ Types ============
export interface CategoryChipProps {
  category: string;
}

// ============ Component ============
export const CategoryChip = React.memo<CategoryChipProps>(({ category }) => {
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
        <View className="h-11 rounded-xl bg-white justify-center items-center">
          <Text className="text-sm font-medium">{category}</Text>
        </View>
      </Shadow>
    </View>
  );
});

CategoryChip.displayName = 'CategoryChip';
