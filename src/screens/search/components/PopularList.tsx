import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

// ============ Types ============
export interface PopularListProps {
  index: number;
  item: string;
  onPress?: (item: string) => void;
}

// ============ Component ============
export const PopularList = React.memo<PopularListProps>(({ index, item, onPress }) => {
  return (
    <TouchableOpacity key={index} onPress={() => onPress?.(item)} activeOpacity={0.7}>
      {index > 0 && <View className="h-[1px] bg-chip -mx-4" />}
      <View className="h-12 w-full flex-row items-center gap-3">
        <View className="h-6 w-6 rounded-md bg-serve flex items-center justify-center">
          <Text className="text-xs font-bold text-main">{index + 1}</Text>
        </View>
        <Text className="text-p">{item}</Text>
      </View>
    </TouchableOpacity>
  );
});

PopularList.displayName = 'PopularList';
