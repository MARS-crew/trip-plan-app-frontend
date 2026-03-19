import { TimeB, X } from '@/assets';
import React from 'react';
import { View, Text } from 'react-native';

// ============ Types ============
export interface SearchListProps {
  item: string;
  // TODO: props 정의
}

// ============ Component ============
export const SearchList = React.memo<SearchListProps>(({ item }) => {
  return (
    <View className="h-[42px] flex-row items-center justify-between">
      <View className=" flex-row items-center gap-3">
        <TimeB />
        <Text className="text-p1">{item}</Text>
      </View>
      <X />
    </View>
  );
});

SearchList.displayName = 'SearchList';
