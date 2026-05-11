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
import { getSearchResults } from '@/services';
import type { GetTravelItemData, SearchResult } from '@/types/search';
import { COLORS } from '@/constants/colors';

// ============ Types ============
type Props = NativeStackScreenProps<SearchStackParamList, 'SearchResult'>;
type NavigationProp = NativeStackNavigationProp<SearchStackParamList>;

// ============ Utils ============
const toGetTravelItemData = (item: SearchResult): GetTravelItemData => ({
  id: item.placeId.toString(),
  name: item.name,
  location: `${item.cityName}, ${item.countryName}`,
  categories: item.tags.length > 0 ? item.tags : [item.placeType],
  rating: item.ratingAvg,
  reviewCount: item.reviewCount,
  image: item.imageUrl ? { uri: item.imageUrl } : require('@/assets/images/thumnail.png'),
});

// ============ Component ============
const SearchResultScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { params } = useRoute<Props['route']>();
  const { query } = params;

  const [results, setResults] = useState<GetTravelItemData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchResults = async (): Promise<void> => {
      setIsLoading(true);
      try {
        const data = await getSearchResults(query);
        if (isMounted) setResults(data.map(toGetTravelItemData));
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
          contentContainerStyle={{ paddingHorizontal: 16 }}
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
        />
      )}
    </SafeAreaView>
  );
};

SearchResultScreen.displayName = 'SearchResultScreen';

export default SearchResultScreen;
export { SearchResultScreen };
