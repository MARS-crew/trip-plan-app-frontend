import { TimeB, X } from '@/assets';
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

// ============ Types ============
export interface SearchListProps {
  item: string;
  onPress?: (item: string) => void;
  onDelete?: (item: string) => void;
}

// ============ Component ============
export const SearchList = React.memo<SearchListProps>(({ item, onPress, onDelete }) => {
  return (
    <View className="h-[42px] flex-row items-center justify-between">
      <TouchableOpacity className="flex-row items-center gap-3 flex-1" onPress={() => onPress?.(item)} activeOpacity={0.7}>
        <TimeB />
        <Text className="text-p1">{item}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onDelete?.(item)}>
        <X />
      </TouchableOpacity>
    </View>
  );
});

SearchList.displayName = 'SearchList';
