import React, { useCallback, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import type {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import type { SearchStackParamList } from '@/navigation/types';
import { InputSearchIcon, X } from '@/assets/icons';
import { TravelItem } from './search/components/TravelItem';
import { travelDummyData } from './SearchScreen';

// ============ Types ============
type Props = NativeStackScreenProps<SearchStackParamList, 'SearchResult'>;
type NavigationProp = NativeStackNavigationProp<SearchStackParamList>;

// ============ Component ============
const SearchResultScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { params } = useRoute<Props['route']>();
  const { query } = params;

  const handlePressItem = useCallback((item: { id: string }) => {
    navigation.navigate('DestinationDetail', { destinationId: item.id, origin: 'search' });
  }, [navigation]);

  const results = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    return travelDummyData.filter(
      (item) =>
        item.name.toLowerCase().includes(trimmed) ||
        item.location.toLowerCase().includes(trimmed) ||
        item.categories.some((c) => c.includes(trimmed)),
    );
  }, [query]);

  // 렌더링
  return (
    <SafeAreaView className="flex-1 bg-screenBackground" edges={['top']}>
      <View className="px-4">
        <View className="h-14 justify-center">
          <Text className="text-h font-pretendardBold">검색</Text>
        </View>
        <View className="h-[46px] bg-white border border-borderGray rounded-xl flex-row items-center mb-3">
          <View className="w-4 h-4 ml-4">
            <InputSearchIcon />
          </View>
          <TextInput className="flex-1 px-4" value={query} editable={false} />
          <TouchableOpacity className="pr-4" onPress={() => navigation.goBack()}>
            <X width={16} height={16} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView>
        <View className="px-4">
          <Text className="text-p text-gray mb-3">
            "{query}" 검색 결과 {results.length}건
          </Text>
          {results.length > 0 ? (
            <View className="gap-3">
              {results.map((item) => (
                <View>
                  <TravelItem key={item.id} item={item} onPress={handlePressItem} />
                </View>
              ))}
            </View>
          ) : (
            <View className="flex-1 items-center justify-center py-20">
              <Text className="text-gray">검색 결과가 없습니다.</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

SearchResultScreen.displayName = 'SearchResultScreen';

export default SearchResultScreen;
export { SearchResultScreen };
