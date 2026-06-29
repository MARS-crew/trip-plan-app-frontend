import React from 'react';
import { ActivityIndicator, Keyboard, KeyboardAvoidingView, Platform, Text, TouchableOpacity, View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import PlaceCard from './PlaceCard';
import { getSearchResultsPaginated } from '@/services/searchService';
import type { WishPlace, WishlistBottomSheetTabId } from '@/types/wishlist';
import type { SearchResult } from '@/types/search';
import { ScrollView } from 'react-native-gesture-handler';

export type SearchWishPlace = WishPlace & { latitude: number; longitude: number };

interface WishlistSearchOverlayProps {
  isVisible: boolean;
  selectedCategory: WishlistBottomSheetTabId;
  searchQuery: string;
  searchTrigger: number;
  isLiked: (id: string) => boolean;
  onToggleLike: (id: string, place: WishPlace) => void;
  onPressPlace: (place: SearchWishPlace) => void;
}

const PAGE_SIZE = 20;

export const WishlistSearchOverlay = React.memo<WishlistSearchOverlayProps>(
  ({ isVisible, selectedCategory, searchQuery, searchTrigger, isLiked, onToggleLike, onPressPlace }) => {
    const animatedOpacity = useSharedValue(isVisible ? 1 : 0);
    const [keyboardHeight, setKeyboardHeight] = React.useState(0);
    const [searchResults, setSearchResults] = React.useState<SearchWishPlace[]>([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const [isLoadingMore, setIsLoadingMore] = React.useState(false);
    const [hasSearched, setHasSearched] = React.useState(false);
    const [currentPage, setCurrentPage] = React.useState(0);
    const [hasReachedEnd, setHasReachedEnd] = React.useState(false);

    const normalizePlace = React.useCallback(
      (item: SearchResult, fallbackIndex: number): SearchWishPlace => ({
        id: String(item.placeId ?? `search-${fallbackIndex}`),
        title: item.name,
        location: `${item.cityName}, ${item.countryName}`,
        description: item.description,
        image: item.imageUrl ? { uri: item.imageUrl } : undefined,
        categories: item.tags,
        latitude: item.latitude,
        longitude: item.longitude,
      }),
      [],
    );

    const resetSearchState = React.useCallback(() => {
      setSearchResults([]);
      setHasSearched(false);
      setCurrentPage(0);
      setHasReachedEnd(false);
    }, []);

    React.useEffect(() => {
      animatedOpacity.value = withTiming(isVisible ? 1 : 0, { duration: 180 });
      if (!isVisible) resetSearchState();
    }, [animatedOpacity, isVisible, resetSearchState]);

    React.useEffect(() => {
      if (!searchQuery.trim()) resetSearchState();
    }, [searchQuery, resetSearchState]);

    // 돋보기 버튼 클릭 시에만 검색 실행 (1페이지)
    React.useEffect(() => {
      if (searchTrigger === 0) return;

      const keyword = searchQuery.trim();
      if (!keyword) {
        resetSearchState();
        return;
      }

      let isActive = true;
      setHasSearched(true);
      setIsLoading(true);
      setCurrentPage(0);
      setSearchResults([]);
      setHasReachedEnd(false);

      (async () => {
        try {
          const { results } = await getSearchResultsPaginated(keyword, 0, PAGE_SIZE);
          if (!isActive) return;
          setSearchResults(results.map((item, index) => normalizePlace(item, index)));
        } catch {
          if (isActive) setSearchResults([]);
        } finally {
          if (isActive) setIsLoading(false);
        }
      })();

      return () => { isActive = false; };
      // searchTrigger 변화 시에만 실행 — searchQuery·normalizePlace는 클로저에서 최신값 참조
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchTrigger]);

    const handleLoadMore = React.useCallback(async () => {
      if (isLoadingMore) return;
      const keyword = searchQuery.trim();
      if (!keyword) return;

      const nextPage = currentPage + 1;
      setIsLoadingMore(true);
      try {
        const { results } = await getSearchResultsPaginated(keyword, nextPage, PAGE_SIZE);
        if (results.length === 0) {
          setHasReachedEnd(true);
        } else {
          setSearchResults((prev) => [
            ...prev,
            ...results.map((item, index) => normalizePlace(item, prev.length + index)),
          ]);
          setCurrentPage(nextPage);
        }
      } catch {
        // 더보기 실패 시 현재 목록 유지
      } finally {
        setIsLoadingMore(false);
      }
    }, [isLoadingMore, searchQuery, currentPage, normalizePlace]);

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

    const hasMore = searchResults.length > 0 && !hasReachedEnd;

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
                <>
                  {searchResults.map((place) => (
                    <TouchableOpacity
                      key={`${selectedCategory}-${place.id}`}
                      activeOpacity={0.85}
                      onPress={() => onPressPlace(place)}>
                      <PlaceCard
                        place={place}
                        isLiked={isLiked(place.id)}
                        onToggleLike={() => onToggleLike(place.id, place)}
                      />
                    </TouchableOpacity>
                  ))}
                  {hasMore && (
                    <TouchableOpacity
                      className="mt-2 items-center rounded-xl bg-chip py-3"
                      activeOpacity={0.7}
                      onPress={handleLoadMore}
                      disabled={isLoadingMore}>
                      {isLoadingMore ? (
                        <ActivityIndicator size="small" />
                      ) : (
                        <Text className="font-pretendardMedium text-p1 text-gray">더보기</Text>
                      )}
                    </TouchableOpacity>
                  )}
                </>
              ) : hasSearched ? (
                <View className="items-center py-10">
                  <Text className="text-gray">검색 결과가 없습니다.</Text>
                </View>
              ) : null}
            </View>
          </ScrollView>

        </KeyboardAvoidingView>
      </Animated.View>
    );
  },
);

WishlistSearchOverlay.displayName = 'WishlistSearchOverlay';
