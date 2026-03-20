import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Chip } from '@/components/ui';
import { ActiveBookmarkIcon, LocationIcon, StarIcon } from '@/assets';

const THUMBNAIL_IMAGE = require('@/assets/images/thumnail.png');

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
  categoryId: (typeof CATEGORIES)[number]['id'];
  category: string;
  region: string;
  rating: number;
}

const DUMMY_PLACES: BookmarkedPlace[] = [
  {
    id: '1',
    title: '센소지 아사쿠사',
    categoryId: 'landmark',
    category: '관광지',
    region: '도쿄, 일본',
    rating: 4.6,
  },
  {
    id: '2',
    title: '센소지 아사쿠사',
    categoryId: 'landmark',
    category: '관광지',
    region: '도쿄, 일본',
    rating: 4.6,
  },
  {
    id: '3',
    title: '센소지 아사쿠사',
    categoryId: 'landmark',
    category: '관광지',
    region: '도쿄, 일본',
    rating: 4.6,
  },
  {
    id: '4',
    title: '센소지 아사쿠사',
    categoryId: 'landmark',
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
      className="rounded-lg bg-white"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 1.5,
      }}>
      <View className="overflow-hidden rounded-lg bg-white">
        <View className="relative aspect-[4/3] w-full bg-black">
          <Image source={THUMBNAIL_IMAGE} className="h-full w-full" resizeMode="cover" />

          <TouchableOpacity
            className="absolute right-[10] top-[10] h-7 w-7 items-center justify-center rounded-full"
            style={{ backgroundColor: 'rgba(79, 79, 79, 0.8)' }}
            onPress={() => {
              return;
            }}
            activeOpacity={0.7}>
            <ActiveBookmarkIcon width={14} height={14} />
          </TouchableOpacity>

          <View className="absolute bottom-0 left-0 right-0 px-3 py-2">
            <Text className="mb-0.5 font-Pretendard text-h3 font-semibold text-white">
              {place.title}
            </Text>
            <View className="flex-row items-center">
              <LocationIcon width={10} height={10} />
              <Text className="ml-1 font-Pretendard text-p text-white">{place.region}</Text>
            </View>
          </View>
        </View>

        <View className="flex-row items-center justify-between bg-white px-1.5 py-1.5">
          <Chip label={place.category} className="rounded-xl bg-chip px-2.5 py-1" />
          <View className="flex-row items-center">
            <StarIcon width={12} height={12} />
            <Text className="ml-0.5 font-Pretendard text-p text-black">
              {place.rating}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const BookmarkScreen: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<(typeof CATEGORIES)[number]['id']>('all');

  const filteredPlaces =
    selectedCategory === 'all'
      ? DUMMY_PLACES
      : DUMMY_PLACES.filter((place) => place.categoryId === selectedCategory);

  return (
    <SafeAreaView className="flex-1 bg-screenBackground" edges={['top']}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="pb-5">
          <View className="px-4 py-4">
            <Text className="mb-1 font-Pretendard text-h font-bold text-black">저장된 장소</Text>
            <Text className="font-Pretendard text-p1 text-gray">
              {filteredPlaces.length}개의 장소를 저장했어요
            </Text>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-2 px-4 pb-4">
              {CATEGORIES.map((category) => {
                const isSelected = selectedCategory === category.id;

                return (
                  <TouchableOpacity
                    key={category.id}
                    onPress={() => setSelectedCategory(category.id)}
                    activeOpacity={0.8}
                    className={`rounded-2xl px-4 py-2 ${isSelected ? 'bg-main' : 'bg-chip'}`}>
                    <Text
                      className={`font-Pretendard text-p ${isSelected ? 'text-white' : 'text-gray'}`}>
                      {category.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          <View className="px-4">
            <View className="flex-row flex-wrap justify-between">
              {filteredPlaces.map((place) => (
                <View key={place.id} className="mb-2 w-[49%]">
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