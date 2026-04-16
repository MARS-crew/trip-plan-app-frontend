import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootTabParamList } from '@/navigation/types';
import { getSavedPlaceCategories, getSavedPlaces } from '@/services';
import type {
  SavedPlace,
  SavedPlaceCategory,
  SavedPlaceFilterType,
} from '@/types/savedPlace';
import { PlaceCard } from './bookmark/components';

type BookmarkNavigationProp = BottomTabNavigationProp<RootTabParamList, 'Bookmark'>;

const BookmarkScreen: React.FC = () => {
  const navigation = useNavigation<BookmarkNavigationProp>();
  const [selectedFilter, setSelectedFilter] = useState<SavedPlaceFilterType>('ALL');
  const [categories, setCategories] = useState<SavedPlaceCategory[]>([]);
  const [savedPlaces, setSavedPlaces] = useState<SavedPlace[]>([]);
  const [filteredCount, setFilteredCount] = useState<number>(0);

  const fetchCategories = useCallback(async (): Promise<void> => {
    try {
      const data = await getSavedPlaceCategories();
      setCategories(data.categories);
    } catch (error) {
      console.error('fetchCategories Error:', error);
    }
  }, []);

  const fetchSavedPlaces = useCallback(async (filter: SavedPlaceFilterType): Promise<void> => {
    try {
      const data = await getSavedPlaces(filter);
      setSavedPlaces(data.savedPlaces);
      setFilteredCount(data.filteredSavedPlaceCount);
    } catch (error) {
      console.error('fetchSavedPlaces Error:', error);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchSavedPlaces(selectedFilter);
  }, [fetchSavedPlaces, selectedFilter]);

  const categoryLabelMap = useMemo(
    () => new Map(categories.map((cat) => [cat.filterType, cat.filterDisplayName])),
    [categories],
  );

  const getCategoryLabel = useCallback(
    (filterType: SavedPlaceFilterType): string => {
      return categoryLabelMap.get(filterType) ?? '기타';
    },
    [categoryLabelMap],
  );

  const handleCategoryPress = useCallback((filterType: SavedPlaceFilterType): void => {
    setSelectedFilter(filterType);
  }, []);

  const handlePlacePress = useCallback(
    (placeId: number): void => {
      navigation.navigate('Search', {
        screen: 'DestinationDetail',
        params: { destinationId: String(placeId), origin: 'bookmark' },
      });
    },
    [navigation],
  );

  const handleBookmarkPress = useCallback((_savedPlaceId: number): void => {
    // TODO: 북마크 해제 로직
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-screenBackground" edges={['top']}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="pb-5 pt-1">
          <View className="px-4 pb-4 pt-4">
            <Text className="mb-1 font-pretendardBold text-h text-black">저장된 장소</Text>
            <Text className="font-pretendardMedium text-sm text-gray">
              {filteredCount}개의 장소를 표시 중이에요
            </Text>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-2 px-4 pb-4 pr-6">
              {categories.map((cat) => {
                const isSelected = selectedFilter === cat.filterType;

                return (
                  <TouchableOpacity
                    key={cat.filterType}
                    onPress={() => handleCategoryPress(cat.filterType)}
                    activeOpacity={0.8}
                    className={`h-8 rounded-2xl px-4 py-2 ${isSelected ? 'bg-main' : 'bg-chip'}`}>
                    <Text
                      className={`font-pretendardRegular text-xs ${isSelected ? 'text-white' : 'text-gray'}`}>
                      {cat.filterDisplayName}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          <View className="px-4">
            {savedPlaces.length > 0 ? (
              <View className="flex-row flex-wrap justify-between">
                {savedPlaces.map((place) => (
                  <View key={place.savedPlaceId} className="mb-2 w-[48.8%]">
                    <PlaceCard
                      title={place.name}
                      region={place.location}
                      rating={place.ratingAvg}
                      categoryLabel={getCategoryLabel(place.placeType)}
                      imageUrl={place.imageUrl}
                      isSaved={place.saved}
                      onPress={() => handlePlacePress(place.placeId)}
                      onBookmarkPress={() => handleBookmarkPress(place.savedPlaceId)}
                    />
                  </View>
                ))}
              </View>
            ) : (
              <View className="items-center rounded-xl bg-chip px-4 py-10">
                <Text className="font-pretendardRegular text-sm text-gray">
                  선택한 카테고리에 저장된 장소가 없어요.
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

BookmarkScreen.displayName = 'BookmarkScreen';

export default BookmarkScreen;
export { BookmarkScreen };
