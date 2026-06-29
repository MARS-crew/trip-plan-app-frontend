import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import type {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import type { SearchStackParamList } from '@/navigation/types';
import { InputSearchIcon, X } from '@/assets/icons';
import { TravelItem } from './search/components/TravelItem';
import { getSearchResultsPaginated } from '@/services/searchService';
import type { GetTravelItemData, SearchResult } from '@/types/search';
import { COLORS } from '@/constants/colors';

// ============ Types ============
type Props = NativeStackScreenProps<SearchStackParamList, 'SearchResult'>;
type NavigationProp = NativeStackNavigationProp<SearchStackParamList>;

const PAGE_SIZE = 20;

// ============ Utils ============
const toGetTravelItemData = (item: SearchResult): GetTravelItemData => ({
  id: item.placeId.toString(),
  name: item.name,
  location: `${item.cityName}, ${item.countryName}`,
  categories: item.tags.length > 0 ? item.tags : [item.placeType],
  rating: item.ratingAvg,
  reviewCount: item.reviewCount,
  image: item.imageUrl ? { uri: item.imageUrl } : require('@/assets/images/place_default.png'),
});

// ============ Component ============
const SearchResultScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { params } = useRoute<Props['route']>();
  const { query } = params;

  const [results, setResults] = useState<GetTravelItemData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasReachedEnd, setHasReachedEnd] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchResults = async (): Promise<void> => {
      setIsLoading(true);
      setCurrentPage(0);
      setHasReachedEnd(false);
      try {
        const { results: data } = await getSearchResultsPaginated(query, 0, PAGE_SIZE);
        if (isMounted) {
          setResults(data.map(toGetTravelItemData));
        }
      } catch (error) {
        console.error('fetchResults Error:', error);
        if (isMounted) setResults([]);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchResults();

    return () => {
      isMounted = false;
    };
  }, [query]);

  const handleLoadMore = useCallback(async (): Promise<void> => {
    if (isLoadingMore) return;
    const nextPage = currentPage + 1;
    setIsLoadingMore(true);
    try {
      const { results: data } = await getSearchResultsPaginated(query, nextPage, PAGE_SIZE);
      if (data.length === 0) {
        setHasReachedEnd(true);
      } else {
        setResults((prev) => [...prev, ...data.map(toGetTravelItemData)]);
        setCurrentPage(nextPage);
      }
    } catch (error) {
      console.error('handleLoadMore Error:', error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, currentPage, query]);

  const handlePressItem = useCallback(
    (item: { id: string }): void => {
      navigation.navigate('DestinationDetail', { destinationId: item.id, origin: 'search' });
    },
    [navigation],
  );

  const renderItem = useCallback(
    ({ item }: { item: GetTravelItemData }) => <TravelItem item={item} onPress={handlePressItem} />,
    [handlePressItem],
  );

  const keyExtractor = useCallback((item: GetTravelItemData) => item.id, []);

  const hasMore = results.length > 0 && !hasReachedEnd;

  // 렌더링
  return (
    <SafeAreaView className="flex-1 bg-screenBackground" edges={['top']}>
      <View className="px-4">
        <View className="h-14 justify-center">
          <Text className="font-pretendardBold text-h">검색</Text>
        </View>
        <View className="mb-3 h-[46px] flex-row items-center rounded-xl border border-borderGray bg-white">
          <View className="ml-4 h-4 w-4">
            <InputSearchIcon />
          </View>
          <TextInput className="flex-1 px-4" value={query} editable={false} />
          <TouchableOpacity className="pr-4" onPress={() => navigation.goBack()}>
            <X width={16} height={16} />
          </TouchableOpacity>
        </View>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color={COLORS.main} className="py-20" />
      ) : (
        <FlatList
          data={results}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 8 }}
          ItemSeparatorComponent={() => <View className="mb-3" />}
          ListHeaderComponent={
            <Text className="mb-3 text-p text-gray">
              "{query}" 검색 결과 {results.length}건
            </Text>
          }
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center py-20">
              <Text className="text-gray">검색 결과가 없습니다.</Text>
            </View>
          }
          ListFooterComponent={
            hasMore ? (
              <TouchableOpacity
                className="mb-4 mt-2 items-center rounded-xl bg-chip py-3"
                activeOpacity={0.7}
                onPress={handleLoadMore}
                disabled={isLoadingMore}>
                {isLoadingMore ? (
                  <ActivityIndicator size="small" color={COLORS.main} />
                ) : (
                  <Text className="font-pretendardMedium text-p1 text-gray">더보기</Text>
                )}
              </TouchableOpacity>
            ) : null
          }
        />
      )}
    </SafeAreaView>
  );
};

SearchResultScreen.displayName = 'SearchResultScreen';

export default SearchResultScreen;
export { SearchResultScreen };
