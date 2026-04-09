import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, TextInput, ScrollView } from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { SearchStackParamList } from '@/navigation/types';
import { InputSearchIcon } from '@/assets/icons';
import { COLORS } from '@/constants/colors';
import { getRecentSearches, deleteRecentSearch } from '@/services';
import { SearchList } from '@/screens/search/components/SearchList';
import { PopularList } from '@/screens/search/components/PopularList';
import { CategoryChip } from '@/screens/search/components/CategoryChip';
import type { GetRecentSearch } from '@/types/search';

// dummy data
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

// ============ Types ============
type NavigationProp = NativeStackNavigationProp<SearchStackParamList>;

// ============ Component ============
const SearchScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<GetRecentSearch[]>([]);

  const fetchRecentSearches = useCallback(async () => {
    try {
      const data = await getRecentSearches();
      setRecentSearches(data);
    } catch (error) {
      console.error('fetchRecentSearches Error:', error);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setQuery('');
      fetchRecentSearches();
    });
    return unsubscribe;
  }, [navigation, fetchRecentSearches]);

  const handleDelete = useCallback(async (recentSearchId: number) => {
    try {
      await deleteRecentSearch(recentSearchId);
      setRecentSearches(prev => prev.filter(s => s.recentSearchId !== recentSearchId));
    } catch (error) {
      console.error('handleDelete Error:', error);
    }
  }, []);

  const handleSearch = useCallback(() => {
    const trimmed = query.trim();
    if (!trimmed) return;
    navigation.navigate('SearchResult', { query: trimmed });
  }, [navigation, query]);

  const handleNavigate = useCallback(
    (keyword: string) => {
      navigation.navigate('SearchResult', { query: keyword });
    },
    [navigation],
  );

  // 렌더링
  return (
    <SafeAreaView className="flex-1 bg-screenBackground" edges={['top']}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <View className="flex-1 px-4">
          <View className="h-14 justify-center">
            <Text className="font-pretendardBold text-h">검색</Text>
          </View>
          <View className="gap-6">
            <View className="h-[46px] flex-row items-center rounded-xl border border-borderGray bg-white">
              <View className="ml-4 h-4 w-4">
                <InputSearchIcon />
              </View>
              <TextInput
                className="flex-1 pl-3 pr-4"
                placeholder="여행지, 맛집, 숙소를 검색해보세요"
                placeholderTextColor={COLORS.gray}
                value={query}
                onChangeText={setQuery}
                onSubmitEditing={handleSearch}
                returnKeyType="search"
              />
            </View>
            <View>
              <Text className="mb-3 font-pretendardSemiBold text-h3">카테고리</Text>

              <View className="flex-row flex-wrap justify-between">
                {category.flat().map((item) => (
                  <View key={item} className="mb-2 w-[32%]">
                    <CategoryChip category={item} onPress={handleNavigate} />
                  </View>
                ))}
              </View>
            </View>
            <View>
              <View className="mb-4 flex-row justify-between">
                <Text className="font-pretendardSemiBold text-h3">최근 검색</Text>
                <Text className="text-p text-gray">전체 삭제</Text>
              </View>
              <View>
                {recentSearches.length === 0 ? (
                  <Text className="py-4 text-center text-p text-gray">최근 검색어가 없습니다</Text>
                ) : (
                  recentSearches.map(({ recentSearchId, keyword }) => (
                    <SearchList
                      key={recentSearchId}
                      item={keyword}
                      onPress={handleNavigate}
                      onDelete={() => handleDelete(recentSearchId)}
                    />
                  ))
                )}
              </View>
            </View>
            <View>
              <Text className="mb-3 font-pretendardSemiBold text-h3">인기 검색어</Text>
              <Shadow
                distance={2}
                startColor="rgba(0,0,0,0.1)"
                style={{ borderRadius: 12 }}
                containerStyle={{ marginBottom: 24 }}
                stretch>
                <View className="rounded-xl bg-white">
                  {popularSearch.map((item, index) => (
                    <PopularList key={index} index={index} item={item} onPress={handleNavigate} />
                  ))}
                </View>
              </Shadow>
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
