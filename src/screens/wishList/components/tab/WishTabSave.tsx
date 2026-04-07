import React, { useCallback } from 'react';
import { View, Text, FlatList } from 'react-native';
import { EmptyLocation } from '@/assets/icons';
import { PlaceCard } from '@/screens/wishList/components';
import type { WishPlace, WishTabSaveProps } from '@/screens/wishList/types';

const SavePlaceItem = React.memo<{
  item: WishPlace;
  isLiked: boolean;
  onToggleLike: (id: string) => void;
}>(({ item, isLiked, onToggleLike }) => (
  <PlaceCard place={item} isLiked={isLiked} onToggleLike={onToggleLike} />
));
SavePlaceItem.displayName = 'SavePlaceItem';
// 빈 상태 — 변하지 않으므로 memo로 완전히 고정
const WishSaveEmptyState = React.memo(() => (
  <View className="py-4 mr-[1px] items-center">
    <View className="mt-20">
      <EmptyLocation />
    </View>
    <View className="mt-4">
      <Text className="text-h2 font-pretendardSemiBold">저장한 장소가 없어요</Text>
    </View>
    <View className="mt-1">
      <Text className="text-p1 text-gray font-pretendardMedium">
        마음에 드는 장소를 저장해주세요.
      </Text>
    </View>
  </View>
));
WishSaveEmptyState.displayName = 'WishSaveEmptyState';

export const WishTabSave = React.memo<WishTabSaveProps>(({ places, isLiked, onToggleLike }) => {
  const renderItem = useCallback(
    ({ item }: { item: WishPlace }) => (
      <SavePlaceItem item={item} isLiked={isLiked(item.id)} onToggleLike={onToggleLike} />
    ),
    [isLiked, onToggleLike],
  );

  const keyExtractor = useCallback((item: WishPlace) => `saved-${item.id}`, []);

  if (places.length === 0) {
    return <WishSaveEmptyState />;
  }
  return (
    <FlatList
      data={places}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      scrollEnabled={false}
      removeClippedSubviews={true}
      className="py-4 mr-[1px]"
    />
  );
});

WishTabSave.displayName = 'WishTabSave';
