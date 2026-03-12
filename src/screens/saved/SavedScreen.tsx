import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Chip } from '@/components/ui';

<<<<<<< HEAD:src/screens/saved/SavedScreen.tsx
const SavedScreen: React.FC = () => {
=======
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
];

const DUMMY_PLACES = [
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

// ============ Types ============
interface BookmarkedPlace {
  id: string;
  title: string;
  category: string;
  region: string;
  rating: number;
}

interface PlaceCardProps {
  place: BookmarkedPlace;
}

// ============ Components ============
const PlaceCard: React.FC<PlaceCardProps> = ({ place }) => {
  return (
    <View
      className="bg-white rounded-lg"
      style={{
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 1.5,
      }}>
      <View className="bg-white rounded-lg overflow-hidden">
      {/* 이미지 컨테이너 */}
      <View className="relative w-full bg-black aspect-[4/3]">
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
        <View className="absolute bottom-0 left-0 right-0 px-3 py-2">
          <Text className="text-h3 font-semibold text-white mb-0.5 font-Pretendard">
            {place.title}
          </Text>
          <View className="flex-row items-center">
            <Location width={10} height={10} className="mr-1" />
            <Text className="text-p text-white font-Pretendard">
              {place.region}
            </Text>
          </View>
        </View>
      </View>

      {/* 정보 섹션 */}
      <View className="px-1.5 py-1.5 bg-white flex-row items-center justify-between">
        <Chip
          label={place.category}
          className="bg-chip px-2.5 py-1 rounded-xl"
        />
        <View className="flex-row items-center">
          <StarIcon width={12} height={12} className="mr-0.5" />
          <Text className="text-p font-semibold text-black font-Pretendard">{place.rating}</Text>
        </View>
      </View>
      </View>
    </View>
  );
};

// ============ Main Screen ============
const BookmarkScreen: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const handleCategoryPress = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

>>>>>>> 23ed92c (저장된 장소 페이지):src/screens/BookmarkScreen.tsx
  return (
    <SafeAreaView className="flex-1 bg-screenBackground" edges={['top']}>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}>
        <View className="pb-5">
        {/* 헤더 */}
        <View className="px-4 py-4">
          <Text className="text-h text-black font-bold mb-1 font-Pretendard">저장된 장소</Text>
          <Text className="text-p1 text-gray font-Pretendard">4개의 장소를 저장했어요</Text>
        </View>

        {/* 필터 탭 */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}>
          <View className="flex-row px-4 pb-4 gap-2">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;

              return (
                <TouchableOpacity
                  key={cat.id}
                  onPress={() => handleCategoryPress(cat.id)}
                  activeOpacity={0.8}
                  className={`px-4 py-2 rounded-2xl ${isSelected ? 'bg-main' : 'bg-chip'}`}>
                  <Text className={`text-p font-Pretendard ${isSelected ? 'text-white' : 'text-gray'}`}>
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
              <View key={place.id} className="w-[49%] mb-2">
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

SavedScreen.displayName = 'SavedScreen';

export default SavedScreen;
export { SavedScreen };