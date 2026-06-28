import React from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, Text, View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import PlaceCard from './PlaceCard';
import { getSearchResults } from '@/services/searchService';
import type { WishPlace, WishlistBottomSheetTabId } from '@/types/wishlist';
import type { SearchResultItem } from '@/types/search';
import { ScrollView } from 'react-native-gesture-handler';

interface WishlistSearchOverlayProps {
  isVisible: boolean;
  selectedCategory: WishlistBottomSheetTabId;
  searchQuery: string;
  isLiked: (id: string) => boolean;
  onToggleLike: (id: string, place: WishPlace) => void;
}

export const WishlistSearchOverlay = React.memo<WishlistSearchOverlayProps>(
  ({ isVisible, selectedCategory, searchQuery, isLiked, onToggleLike }) => {
    const animatedOpacity = useSharedValue(isVisible ? 1 : 0);
    const [keyboardHeight, setKeyboardHeight] = React.useState(0);
    const [searchResults, setSearchResults] = React.useState<WishPlace[]>([]);
    const [isLoading, setIsLoading] = React.useState(false);

    const normalizePlace = React.useCallback(
      (item: SearchResultItem, fallbackIndex: number): WishPlace => {
        return {
          id: String(item.placeId ?? `search-${fallbackIndex}`),
          title: item.name,
          location: `${item.cityName}, ${item.countryName}`,
          description: item.description,
          image: item.imageUrl ? { uri: item.imageUrl } : undefined,
          categories: item.tags,
        };
      },
      [],
    );

    React.useEffect(() => {
      animatedOpacity.value = withTiming(isVisible ? 1 : 0, { duration: 180 });
    }, [animatedOpacity, isVisible]);

    React.useEffect(() => {
      const keyword = searchQuery.trim();

      if (!keyword) {
        setSearchResults([]);
        setIsLoading(false);
        return;
      }

      let isActive = true;
      const timer = setTimeout(async () => {
        setIsLoading(true);
        try {
          const items = await getSearchResults(keyword);

          if (!isActive) return;

          setSearchResults(items.map((item, index) => normalizePlace(item, index)));
        } catch {
          if (isActive) {
            setSearchResults([]);
          }
        } finally {
          if (isActive) {
            setIsLoading(false);
          }
        }
      }, 250);

      return () => {
        isActive = false;
        clearTimeout(timer);
      };
    }, [normalizePlace, searchQuery]);

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
              {isLoading ? (
                <View className="items-center py-10">
                  <Text className="text-gray">검색 중...</Text>
                </View>
              ) : searchResults.length > 0 ? (
                searchResults.map((place) => (
                  <PlaceCard
                    key={`${selectedCategory}-${place.id}`}
                    place={place}
                    isLiked={isLiked(place.id)}
                    onToggleLike={() => onToggleLike(place.id, place)}
                  />
                ))
              ) : (
                <View className="items-center py-10">
                  <Text className="text-gray">검색 결과가 없습니다.</Text>
                </View>
              )}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Animated.View>
    );
  },
);

WishlistSearchOverlay.displayName = 'WishlistSearchOverlay';
