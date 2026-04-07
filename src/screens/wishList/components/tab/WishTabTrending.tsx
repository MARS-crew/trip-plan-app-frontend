import React, { useCallback } from 'react';
import { View, Text, FlatList } from 'react-native';
import { PlaceCard } from '@/screens/wishList/components';
import type { WishPlace, WishTabTrendingProps } from '@/screens/wishList/types';

// FlatList renderItem → 반드시 별도 컴포넌트 + memo (스크롤 성능)
const TrendingPlaceItem = React.memo<{ item: WishPlace }>(({ item }) => (
  <PlaceCard place={item} isLiked={false} onToggleLike={() => {}} isTrending={true} />
));
TrendingPlaceItem.displayName = 'TrendingPlaceItem';

export const WishTabTrending = React.memo<WishTabTrendingProps>(({ places }) => {
  const renderItem = useCallback(
    ({ item }: { item: WishPlace }) => <TrendingPlaceItem item={item} />,
    [],
  );

  const keyExtractor = useCallback((item: WishPlace) => `trending-${item.id}`, []);

  return (
    <>
      <View>
        <Text className="text-h2 font-pretendardSemiBold">현재 핫한 장소</Text>
      </View>
      <FlatList
        data={places}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        scrollEnabled={false}
        removeClippedSubviews={true}
        className="py-4 mr-[1px]"
      />
    </>
  );
});

WishTabTrending.displayName = 'WishTabTrending';
