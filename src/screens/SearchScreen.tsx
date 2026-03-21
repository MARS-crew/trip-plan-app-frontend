import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { SearchStackParamList } from '@/navigation/types';

import { InputSearchIcon } from '@/assets/icons';
import { SearchList } from './search/components/SearchList';
import { PopularList } from './search/components/PopularList';
import { CategoryChip } from './search/components/CategoryChip';
import { TravelItem } from './search/components/TravelItem';
import { TravelItemData } from './search/types';

// 예제값
const searchList = ['도쿄 맛집', '발리 숙소', '유럽 여행 코스', '제주도 카페'];
const popularSearch = [
  '오사카 벚꽃',
  '다낭 리조트',
  '방콕 야시장',
  '싱가포르 마리나',
  '후쿠오카 온천',
];

// ============ Constants ============
const category = [
  ['관광지', '맛집', '숙소'],
  ['해변', '자연', '문화'],
];

export const travelDummyData: TravelItemData[] = [
  {
    id: '1',
    name: '센소지 아사쿠사',
    location: '도쿄, 일본',
    rating: 4.6,
    reviewCount: 56789,
    categories: ['관광지', '문화', '역사'],
    image: require('@/assets/images/thumnail.png'),
  },
  {
    id: '2',
    name: '도톤보리',
    location: '오사카, 일본',
    rating: 4.5,
    reviewCount: 43210,
    categories: ['맛집', '관광지'],
    image: require('@/assets/images/thumnail2.png'),
  },
  {
    id: '3',
    name: '후쿠오카 야타이',
    location: '후쿠오카, 일본',
    rating: 4.3,
    reviewCount: 12034,
    categories: ['맛집', '문화'],
    image: require('@/assets/images/thumnail.png'),
  },
  {
    id: '4',
    name: '다낭 미케 비치',
    location: '다낭, 베트남',
    rating: 4.7,
    reviewCount: 31500,
    categories: ['해변', '자연'],
    image: require('@/assets/images/thumnail2.png'),
  },
  {
    id: '5',
    name: '방콕 왕궁',
    location: '방콕, 태국',
    rating: 4.4,
    reviewCount: 28900,
    categories: ['관광지', '역사', '문화'],
    image: require('@/assets/images/thumnail.png'),
  },
  {
    id: '6',
    name: '발리 우붓',
    location: '발리, 인도네시아',
    rating: 4.8,
    reviewCount: 67890,
    categories: ['자연', '문화', '숙소'],
    image: require('@/assets/images/thumnail2.png'),
  },
];

// ============ Types ============
type NavigationProp = NativeStackNavigationProp<SearchStackParamList>;

// ============ Component ============
const SearchScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [query, setQuery] = useState('');

  const handleSearch = useCallback(() => {
    const trimmed = query.trim();
    if (!trimmed) return;
    navigation.navigate('SearchResult', { query: trimmed });
  }, [navigation, query]);

  const handleNavigate = useCallback((keyword: string) => {
    navigation.navigate('SearchResult', { query: keyword });
  }, [navigation]);

  // 렌더링
  return (
    <SafeAreaView className="flex-1 bg-screenBackground" edges={['top']}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <View className="flex-1 px-4">
          <View className="h-14 justify-center">
            <Text className="text-h font-bold">검색</Text>
          </View>
          <View className="gap-6">
            <View className="h-[46px] bg-white border border-borderGray rounded-xl flex-row items-center">
              <View className="w-4 h-4 ml-4">
                <InputSearchIcon />
              </View>
              <TextInput
                className="flex-1 px-4"
                placeholder="여행지, 맛집, 숙소를 검색해보세요"
                value={query}
                onChangeText={setQuery}
                onSubmitEditing={handleSearch}
                returnKeyType="search"
              />
            </View>
            <View>
              <Text className="text-h3 font-semibold mb-3">카테고리</Text>

              <View className="flex-row flex-wrap justify-between">
                {category.flat().map((item) => (
                  <View key={item} className="w-[32%] mb-2">
                    <CategoryChip category={item} onPress={handleNavigate} />
                  </View>
                ))}
              </View>
            </View>
            <View className="">
              <View className="flex-row justify-between mb-4">
                <Text className="text-h3 font-semibold">최근 검색</Text>
                <Text className="text-p">전체 삭제</Text>
              </View>
              <View>
                {searchList.map((item, index) => (
                  <SearchList key={index} item={item} onPress={handleNavigate} />
                ))}
              </View>
            </View>
            <View className="">
              <Text className="text-h3 font-semibold mb-3">인기 검색어</Text>
              <View className="bg-white rounded-xl px-4 mb-6">
                {popularSearch.map((item, index) => (
                  <PopularList key={index} index={index} item={item} onPress={handleNavigate} />
                ))}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

SearchScreen.displayName = 'SearchScreen';

export default SearchScreen;
export { SearchScreen };
