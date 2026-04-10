import React, { useCallback, useMemo, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RootTabParamList } from '@/navigation/types';
import { PlaceCard } from './bookmark/components';

// ============ Constants ============
const CATEGORIES = [
  { id: 'all', label: '전체' },
  { id: 'landmark', label: '관광지' },
  { id: 'restaurant', label: '맛집' },
  { id: 'accommodation', label: '숙소' },
  { id: 'beach', label: '해변' },
  { id: 'nature', label: '자연' },
] as const;

type CategoryId = (typeof CATEGORIES)[number]['id'];
type PlaceCategoryId = Exclude<CategoryId, 'all'>;

const CATEGORY_LABEL_MAP = new Map<string, string>(CATEGORIES.map((cat) => [cat.id, cat.label]));

interface BookmarkedPlace {
  id: string;
  title: string;
  categoryId: PlaceCategoryId;
  region: string;
  rating: number;
}

const DUMMY_PLACES: BookmarkedPlace[] = [
  {
    id: '1',
    title: '센소지 아사쿠사',
    categoryId: 'landmark',
    region: '도쿄, 일본',
    rating: 4.6,
  },
  {
    id: '2',
    title: '스시 사토',
    categoryId: 'restaurant',
    region: '오사카, 일본',
    rating: 4.7,
  },
  {
    id: '3',
    title: '오션뷰 리조트',
    categoryId: 'accommodation',
    region: '제주, 한국',
    rating: 4.8,
  },
  {
    id: '4',
    title: '에메랄드 비치',
    categoryId: 'beach',
    region: '세부, 필리핀',
    rating: 4.5,
  },
];

type BookmarkNavigationProp = BottomTabNavigationProp<RootTabParamList, 'Bookmark'>;

const BookmarkScreen: React.FC = () => {
  const navigation = useNavigation<BookmarkNavigationProp>();
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');

  const filteredPlaces = useMemo(() => {
    if (selectedCategory === 'all') {
      return DUMMY_PLACES;
    }

    return DUMMY_PLACES.filter((place) => place.categoryId === selectedCategory);
  }, [selectedCategory]);

  const getCategoryLabel = useCallback((categoryId: PlaceCategoryId): string => {
    return CATEGORY_LABEL_MAP.get(categoryId) ?? '기타';
  }, []);

  const handleCategoryPress = useCallback((categoryId: CategoryId): void => {
    setSelectedCategory(categoryId);
  }, []);

  const handlePlacePress = useCallback(
    (destinationId: string): void => {
      navigation.navigate('Search', {
        screen: 'DestinationDetail',
        params: { destinationId, origin: 'bookmark' },
      });
    },
    [navigation],
  );

  const handleBookmarkPress = useCallback((placeId: string): void => {
    // TODO: 북마크 해제 로직
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-screenBackground" edges={['top']}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="pb-5 pt-1">
          {/* 헤더 */}
          <View className="px-4 pb-4 pt-4">
            <Text className="mb-1 font-pretendardBold text-h text-black">저장된 장소</Text>
            <Text className="font-pretendardMedium text-sm text-gray">
              {filteredPlaces.length}개의 장소를 표시 중이에요
            </Text>
          </View>

          {/* 필터 탭 */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-2 px-4 pb-4 pr-6">
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.id;

                return (
                  <TouchableOpacity
                    key={cat.id}
                    onPress={() => handleCategoryPress(cat.id)}
                    activeOpacity={0.8}
                    className={`h-8 rounded-2xl px-4 py-2 ${isSelected ? 'bg-main' : 'bg-chip'}`}>
                    <Text
                      className={`font-pretendardRegular text-xs ${isSelected ? 'text-white' : 'text-gray'}`}>
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          {/* 카드 그리드 */}
          <View className="px-4">
            {filteredPlaces.length > 0 ? (
              <View className="flex-row flex-wrap justify-between">
                {filteredPlaces.map((place) => (
                  <View key={place.id} className="mb-2 w-[48.8%]">
                    <PlaceCard
                      title={place.title}
                      region={place.region}
                      rating={place.rating}
                      categoryLabel={getCategoryLabel(place.categoryId)}
                      onPress={() => handlePlacePress(place.id)}
                      onBookmarkPress={() => handleBookmarkPress(place.id)}
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
