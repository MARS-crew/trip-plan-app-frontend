import React from 'react';
import { View, Text } from 'react-native';
import { EmptyWish } from '@/assets/icons';
import { PlaceCard } from '@/screens/wishList/components';
import type { WishTabWishlistProps } from '@/screens/wishList/types';

// 빈 상태 — 변하지 않으므로 memo로 완전히 고정
const WishlistEmptyState = React.memo(() => (
  <View className="mx-[1px] items-center py-4">
    <View className="mt-20">
      <EmptyWish />
    </View>
    <Text className="mt-4 font-pretendardSemiBold text-h2">위시리스트에 장소가 없어요</Text>
    <Text className="mt-1 font-pretendardMedium text-p1 text-gray">
      가고싶은 장소를 위시리스트에 추가해주세요.
    </Text>
  </View>
));
WishlistEmptyState.displayName = 'WishlistEmptyState';

export const WishTabWishlist = React.memo<WishTabWishlistProps>(
  ({ places, isLiked, onToggleLike }) => {
    if (places.length === 0) {
      return <WishlistEmptyState />;
    }

    return (
      <View className="mx-[1px] py-4">
        {places.map((item) => (
          <PlaceCard
            key={`wishlist-${item.id}`}
            place={item}
            isLiked={isLiked(item.id)}
            onToggleLike={onToggleLike}
          />
        ))}
      </View>
    );
  },
);

WishTabWishlist.displayName = 'WishTabWishlist';
