import React from 'react';
import { View, Text } from 'react-native';
import { PlaceCard } from '@/screens/wishList/components';
import type { WishTabTrendingProps } from '@/screens/wishList/types';

export const WishTabTrending = React.memo<WishTabTrendingProps>(({ places, onToggleLike }) => {
  return (
    <>
      <View>
        <Text className="font-pretendardSemiBold text-h2">현재 핫한 장소</Text>
      </View>
      <View className="mx-[1px] py-4">
        {places.map((item) => (
          <PlaceCard
            key={`trending-${item.id}`}
            place={item}
            isLiked={false}
            onToggleLike={onToggleLike}
            isTrending={true}
          />
        ))}
      </View>
    </>
  );
});

WishTabTrending.displayName = 'WishTabTrending';
