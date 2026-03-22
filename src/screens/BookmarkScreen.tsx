import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Chip } from '@/components/ui';
// ============ SVG Imports ============
const THUMBNAIL_IMAGE = require('@/assets/images/thumnail.png');
const SaveIcon = require('@/assets/icons/activebookmark.svg').default;
const StarIcon = require('@/assets/icons/star.svg').default;
const Location = require('@/assets/icons/location.svg').default;

// ============ Constants ============
const CATEGORIES = [
  { id: 'all', label: '전체' },
  { id: 'landmark', label: '관광지' },
  { id: 'restaurant', label: '맛집' },
  { id: 'accommodation', label: '숙소' },
  { id: 'beach', label: '해변' },
  { id: 'nature', label: '자연' },
] as const;

interface BookmarkedPlace {
  id: string;
  title: string;
  category: string;
  region: string;
  rating: number;
}

const DUMMY_PLACES: BookmarkedPlace[] = [
  {
    id: '1',
    title: '센소지 아사쿠사',
    category: '관광지',
    region: '도쿄, 일본',
    rating: 4.6,
  },
  {
    id: '2',
    title: '센소지 아사쿠사',
    category: '관광지',
    region: '도쿄, 일본',
    rating: 4.6,
  },
  {
    id: '3',
    title: '센소지 아사쿠사',
    category: '관광지',
    region: '도쿄, 일본',
    rating: 4.6,
  },
  {
    id: '4',
    title: '센소지 아사쿠사',
    category: '관광지',
    region: '도쿄, 일본',
    rating: 4.6,
  },
];

interface PlaceCardProps {
  place: BookmarkedPlace;
}

const PlaceCard: React.FC<PlaceCardProps> = ({ place }) => {
  return (
    <View
      className="overflow-hidden rounded-lg bg-white"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
        elevation: 1,
      }}>
      {/* 이미지 컨테이너 */}
      <View className="relative aspect-[181/128] w-full bg-black">
        <Image
          source={THUMBNAIL_IMAGE}
          className="w-full h-full"
          resizeMode="cover"
        />

        {/* 북마크 아이콘 */}
        <TouchableOpacity
          className="absolute top-2 right-2 w-7 h-7 rounded-full justify-center items-center"
          style={{ backgroundColor: 'rgba(79, 79, 79, 0.8)' }}
          onPress={() => console.log('북마크 버튼 클릭:', place.id)}
          activeOpacity={0.7}>
          <SaveIcon width={14} height={14} />
        </TouchableOpacity>

        {/* 제목 + 위치 오버레이 */}
        <View className="absolute bottom-0 left-0 right-0 px-2.5 pb-2">
          <Text className="mb-0.5 font-Pretendard text-sm font-semibold text-white">
            {place.title}
          </Text>
          <View className="flex-row items-center">
            <Location width={10} height={10} className="mr-1" />
            <Text className="font-Pretendard text-xs text-white">
              {place.region}
            </Text>
          </View>
        </View>
      </View>

      {/* 정보 섹션 */}
      <View className="flex-row items-center justify-between bg-white px-2.5 py-1.5">
        <Chip
          label={place.category}
          className="h-5 rounded-full bg-chip px-2.5 py-0.5"
        />
        <View className="flex-row items-center">
          <StarIcon width={12} height={12} className="mr-0.5" />
          <Text className="font-Pretendard text-xs text-black">{place.rating}</Text>
        </View>
      </View>
    </View>
  );
};

const BookmarkScreen: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<(typeof CATEGORIES)[number]['id']>('all');

  const handleCategoryPress = (categoryId: (typeof CATEGORIES)[number]['id']) => {
    setSelectedCategory(categoryId);
  };

  return (
    <SafeAreaView className="flex-1 bg-screenBackground" edges={['top']}>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}>
        <View className="pb-5 pt-1">
        {/* 헤더 */}
        <View className="px-4 pb-3 pt-4">
          <Text className="mb-1 font-Pretendard text-h font-bold text-black">저장된 장소</Text>
          <Text className="font-Pretendard text-sm font-medium text-gray">4개의 장소를 저장했어요</Text>
        </View>

        {/* 필터 탭 */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}>
          <View className="flex-row gap-2 px-4 pb-4 pr-6">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;

              return (
                <TouchableOpacity
                  key={cat.id}
                  onPress={() => handleCategoryPress(cat.id)}
                  activeOpacity={0.8}
                  className={`h-8 rounded-2xl px-4 py-2 ${isSelected ? 'bg-main' : 'bg-chip'}`}>
                  <Text className={`font-Pretendard text-xs ${isSelected ? 'text-white' : 'text-gray'}`}>
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        {/* 카드 그리드 */}
        <View className="px-4">
          <View className="flex-row flex-wrap justify-between">
            {DUMMY_PLACES.map((place) => (
              <View key={place.id} className="mb-2 w-[48.8%]">
                <PlaceCard place={place} />
              </View>
            ))}
          </View>
        </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

BookmarkScreen.displayName = 'BookmarkScreen';

export default BookmarkScreen;
export { BookmarkScreen };