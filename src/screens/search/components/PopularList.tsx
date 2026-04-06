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
    <TouchableOpacity
      className={`h-12 pl-4 flex justify-center ${index > 0 ? 'border-t border-t-chip' : ''}`}
      key={index}
      onPress={() => onPress?.(item)}
      activeOpacity={0.7}>
      <View className="w-full flex-row items-center gap-3">
        <View className="h-6 w-6 rounded-md bg-serve flex items-center justify-center">
          <Text className="text-xs font-pretendardBold text-main">{index + 1}</Text>
        </View>
        <Text className="text-p">{item}</Text>
      </View>
    </TouchableOpacity>
  );
});

PopularList.displayName = 'PopularList';
