import React from 'react';
import { View, Text } from 'react-native';
import { PlaceCard } from '@/screens/wishList/components';
import type { WishPlace, WishTabTrendingProps } from '@/screens/wishList/types';

// .map() 사용 — 아이템 수가 적으므로 가상화 불필요
const TrendingPlaceItem = React.memo<{ item: WishPlace; onToggleLike: (id: string) => void }>(
  ({ item, onToggleLike }) => (
    <PlaceCard place={item} isLiked={false} onToggleLike={onToggleLike} isTrending={true} />
  ),
);
TrendingPlaceItem.displayName = 'TrendingPlaceItem';

export const WishTabTrending = React.memo<WishTabTrendingProps>(({ places, onToggleLike }) => {
  return (
    <>
      <View>
        <Text className="font-pretendardSemiBold text-h2">현재 핫한 장소</Text>
      </View>
      <View className="mr-[1px] py-4">
        {places.map((item) => (
          <TrendingPlaceItem key={`trending-${item.id}`} item={item} onToggleLike={onToggleLike} />
        ))}
      </View>
    </>
  );
});

WishTabTrending.displayName = 'WishTabTrending';
