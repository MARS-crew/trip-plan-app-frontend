import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { RootStackParamList } from '@/navigation/types';

// ============ Types ============
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// ============ Component ============
const SearchScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  // 1. Hooks
  const handleNavigateToDetail = useCallback(() => {
    navigation.navigate('DestinationDetail', { destinationId: '1' });
  }, [navigation]);

  // 2. 렌더링
  return (
    <SafeAreaView className="flex-1 bg-screenBackground" edges={['top']}>
      <View className="flex-1 items-center justify-center px-4">
        <Text className="text-h1 font-bold text-black mb-4">검색</Text>
        <TouchableOpacity
          onPress={handleNavigateToDetail}
          className="bg-main px-6 py-3 rounded-lg">
          <Text className="text-white font-semibold">여행지 상세 보기</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

SearchScreen.displayName = 'SearchScreen';

export default SearchScreen;
export { SearchScreen };