import React, { useCallback } from 'react';
import { View, Text, FlatList } from 'react-native';
import { PlaceCard, PlaceCardProps } from '@/screens/wishList/components';

export interface WishTabTrendingProps {
    places: PlaceCardProps['place'][];
}

// FlatList renderItem → 반드시 별도 컴포넌트 + memo (스크롤 성능)
const TrendingPlaceItem = React.memo<{ item: PlaceCardProps['place'] }>(({ item }) => (
    <PlaceCard
        place={item}
        isLiked={false}
        onToggleLike={() => { }}
        isTrending={true}
    />
));
TrendingPlaceItem.displayName = 'TrendingPlaceItem';

export const WishTabTrending = React.memo<WishTabTrendingProps>(({ places }) => {

    const renderItem = useCallback(
        ({ item }: { item: PlaceCardProps['place'] }) => <TrendingPlaceItem item={item} />,
        [],
    );

    const keyExtractor = useCallback(
        (item: PlaceCardProps['place']) => `trending-${item.id}`,
        [],
    );

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
