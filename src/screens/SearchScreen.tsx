import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { InputSearchIcon } from '@/assets/icons';
import type { SearchStackParamList } from '@/navigation/SearchStackNavigator';
import { SearchList } from './search/components/SearchList';
import { PopularList } from './search/components/PopularList';
import { CategoryChip } from './search/components/CategoryChip';

// 예제값
const searchList = ['도쿄 맛집', '발리 숙소', '유럽 여행 코스', '제주도 카페'];
const popularSearch = [
  '오사카 벚꽃',
  '다낭 리조트',
  '방콕 야시장',
  '싱가포르 마리나',
  '후쿠오카 온천',
];
=======

import type { SearchStackParamList } from '@/navigation/types';

// ============ Constants ============
const category = [
  ['관광지', '맛집', '숙소'],
  ['해변', '자연', '문화'],
];
// ============ Types ============
type NavigationProp = NativeStackNavigationProp<SearchStackParamList>;

// ============ Component ============
const SearchScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  // Hooks
  const handleNavigateToDetail = useCallback(() => {
    navigation.navigate('DestinationDetail', { destinationId: '1' });
  }, [navigation]);

  // 렌더링
  return (
    <SafeAreaView className="flex-1 bg-screenBackground" edges={['top']}>
      <ScrollView>
        <View className="flex-1 px-4">
          <View className="h-14 justify-center">
            <Text className="text-h font-bold">검색</Text>
          </View>
          <View className="gap-6">
            <View className="h-[46px] bg-white border border-borderGray rounded-xl flex-row items-center">
              <View className="w-4 h-4 ml-4">
                <InputSearchIcon />
              </View>
              <TextInput className="flex-1 px-4" placeholder="여행지, 맛집, 숙소를 검색해보세요" />
            </View>
            <View className="">
              <Text className="text-h3 font-semibold mb-3">카테고리</Text>
              <View className="gap-2">
                {category.map((row, rowIdx) => (
                  <View key={rowIdx} className="flex-row gap-2">
                    {row.map((category) => (
                      <CategoryChip category={category} />
                    ))}
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
                  <SearchList key={index} item={item} />
                ))}
              </View>
            </View>
            <View className="">
              <Text className="text-h3 font-semibold mb-3">인기 검색어</Text>
              <View className="bg-white rounded-xl px-4 mb-6">
                {popularSearch.map((item, index) => (
                  <PopularList index={index} item={item} />
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
