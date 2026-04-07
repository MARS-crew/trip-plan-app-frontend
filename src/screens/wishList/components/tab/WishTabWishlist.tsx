import React, { useCallback } from 'react';
import { View, Text, FlatList } from 'react-native';
import { EmptyWish } from '@/assets/icons';
import { PlaceCard } from '@/screens/wishList/components';
import type { WishPlace, WishTabWishlistProps } from '@/screens/wishList/types';

// FlatList 아이템 → 반드시 별도 컴포넌트 + memo
const WishlistPlaceItem = React.memo<{
  item: WishPlace;
  isLiked: boolean;
  onToggleLike: (id: string) => void;
}>(({ item, isLiked, onToggleLike }) => (
  <PlaceCard place={item} isLiked={isLiked} onToggleLike={onToggleLike} />
));
WishlistPlaceItem.displayName = 'WishlistPlaceItem';

// 빈 상태 — 변하지 않으므로 memo로 완전히 고정
const WishlistEmptyState = React.memo(() => (
  <View className="py-4 mr-[1px] items-center">
    <View className="mt-20">
      <EmptyWish />
    </View>
    <Text className="text-h2 font-pretendardSemiBold mt-4">위시리스트에 장소가 없어요</Text>
    <Text className="text-p1 text-gray font-pretendardMedium mt-1">
      가고싶은 장소를 위시리스트에 추가해주세요.
    </Text>
  </View>
));
WishlistEmptyState.displayName = 'WishlistEmptyState';

export const WishTabWishlist = React.memo<WishTabWishlistProps>(
  ({ places, isLiked, onToggleLike }) => {
    const renderItem = useCallback(
      ({ item }: { item: WishPlace }) => (
        <WishlistPlaceItem item={item} isLiked={isLiked(item.id)} onToggleLike={onToggleLike} />
      ),
      [isLiked, onToggleLike],
    );

    const keyExtractor = useCallback((item: WishPlace) => `wishlist-${item.id}`, []);

    if (places.length === 0) {
      return <WishlistEmptyState />;
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
  },
);

WishTabWishlist.displayName = 'WishTabWishlist';
