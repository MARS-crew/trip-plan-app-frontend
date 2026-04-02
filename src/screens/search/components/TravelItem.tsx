import { ActiveStar, MarkerGrayIcon, TimeB, VectorGrayIcon, X } from '@/assets';
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { CategoryChip } from '@/screens/wishList/components';
import type { TravelItemData } from '../types';
import { Shadow } from 'react-native-shadow-2';

// ============ Types ============
export interface TravelItemProps {
  item: TravelItemData;
  onPress?: (item: TravelItemData) => void;
}

// ============ Component ============
export const TravelItem = React.memo<TravelItemProps>(({ item, onPress }) => {
  return (
    <Shadow
      distance={2}
      startColor="rgba(0,0,0,0.1)"
      style={{
        borderRadius: 8,
        width: '100%',
      }}
      stretch>
      <TouchableOpacity
        className="h-28 w-full bg-white flex-row rounded-r-lg"
        onPress={() => onPress?.(item)}
        activeOpacity={0.8}
      >
        <View className="w-28 h-28 rounded-l-lg overflow-hidden shrink-0">
          <Image source={item.image} className="w-full h-full" resizeMode="cover" />
        </View>
        <View className="flex-1 flex-row justify-between p-3 items-center">
          <View className="flex justify-center">
            <View className="gap-0.5 flex-row items-center mb-1">
              <ActiveStar />
              <Text className="text-p">{item.rating.toFixed(1)}</Text>
              <Text className="text-p text-gray">({item.reviewCount.toLocaleString()})</Text>
            </View>
            <Text className="text-h3 font-pretendardSemiBold mb-0.5">{item.name}</Text>
            <View className="flex-row gap-1 items-center mb-1.5">
              <MarkerGrayIcon width={12} height={12} />
              <Text className="text-p text-gray">{item.location}</Text>
            </View>
            <View className="flex-row">
              {item.categories.map((category, index) => (
                <CategoryChip
                  key={category}
                  label={category}
                  className={`px-2 py-[2px] rounded-2xl${
                    index < item.categories.length - 1 ? ' mr-2' : ''
                  }`}
                />
              ))}
            </View>
          </View>
          <VectorGrayIcon width={16} height={16} />
        </View>
      </TouchableOpacity>
    </Shadow>
  );
});

TravelItem.displayName = 'TravelItem';
