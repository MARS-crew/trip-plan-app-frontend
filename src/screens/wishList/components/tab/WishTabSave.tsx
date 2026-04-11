import React from 'react';
import { View, Text } from 'react-native';
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
  <View className="mx-[1px] items-center py-4">
    <View className="mt-20">
      <EmptyLocation />
    </View>
    <View className="mt-4">
      <Text className="font-pretendardSemiBold text-h2">저장한 장소가 없어요</Text>
    </View>
    <View className="mt-1">
      <Text className="font-pretendardMedium text-p1 text-gray">
        마음에 드는 장소를 저장해주세요.
      </Text>
    </View>
  </View>
));
WishSaveEmptyState.displayName = 'WishSaveEmptyState';

export const WishTabSave = React.memo<WishTabSaveProps>(({ places, isLiked, onToggleLike }) => {
  if (places.length === 0) {
    return <WishSaveEmptyState />;
  }

  return (
    <View className="mx-[1px] py-4">
      {places.map((item) => (
        <SavePlaceItem
          key={`saved-${item.id}`}
          item={item}
          isLiked={isLiked(item.id)}
          onToggleLike={onToggleLike}
        />
      ))}
    </View>
  );
});

WishTabSave.displayName = 'WishTabSave';
