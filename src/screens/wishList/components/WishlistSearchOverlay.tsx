import React from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import PlaceCard from './PlaceCard';
import type { PlaceCardProps, WishlistBottomSheetTabId } from '@/types/wishlist';
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
    const animatedOpacity = useSharedValue(isVisible ? 1 : 0);
    const [keyboardHeight, setKeyboardHeight] = React.useState(0);

    React.useEffect(() => {
      animatedOpacity.value = withTiming(isVisible ? 1 : 0, { duration: 180 });
    }, [animatedOpacity, isVisible]);

    React.useEffect(() => {
      const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
      const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

      const showSub = Keyboard.addListener(showEvent, (event) => {
        setKeyboardHeight(event.endCoordinates.height);
      });
      const hideSub = Keyboard.addListener(hideEvent, () => {
        setKeyboardHeight(0);
      });

      return () => {
        showSub.remove();
        hideSub.remove();
      };
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
      opacity: animatedOpacity.value,
    }));

    return (
      <Animated.View
        pointerEvents={isVisible ? 'auto' : 'none'}
        style={[
          {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 40,
            backgroundColor: 'white',
          },
          animatedStyle,
        ]}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingBottom: keyboardHeight + 12 }}>
            <View className="px-4">
              <View className="mb-3 h-14" />
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
        </KeyboardAvoidingView>
      </Animated.View>
    );
  },
);

WishlistSearchOverlay.displayName = 'WishlistSearchOverlay';
