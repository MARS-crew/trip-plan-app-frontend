import React from 'react';
import { View } from 'react-native';
import PlaceCard from './PlaceCard';
import type { PlaceCardProps, WishlistBottomSheetTabId } from '@/screens/wishList/components';
import { ScrollView } from 'react-native-gesture-handler';

interface WishlistSearchOverlayProps {
  isVisible: boolean;
  selectedCategory: WishlistBottomSheetTabId;
  places: PlaceCardProps['place'][];
  isLiked: (id: string) => boolean;
  onToggleLike: (id: string) => void;
}

export const WishlistSearchOverlay = React.memo<WishlistSearchOverlayProps>(
  ({ isVisible, selectedCategory, places, isLiked, onToggleLike }) => {
    if (!isVisible) {
      return null;
    }

    return (
      <ScrollView
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 40,
          backgroundColor: 'white',
        }}>
        <View className="px-4">
          <View className="h-14 mb-3" />
          {places.map((place) => (
            <PlaceCard
              key={`${selectedCategory}-${place.id}`}
              place={place}
              isLiked={isLiked(place.id)}
              onToggleLike={onToggleLike}
            />
          ))}
        </View>
      </ScrollView>
    );
  },
);

WishlistSearchOverlay.displayName = 'WishlistSearchOverlay';
