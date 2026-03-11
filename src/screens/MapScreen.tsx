import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { RootStackParamList } from '@/navigation/types';
// ============ Types ============
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// ============ Component ============
const MapScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  // 1. Hooks
  const handleNavigateToWish = useCallback(() => {
    navigation.navigate('WishlistScreen', { WishlistScreen: '1' });
  }, [navigation]);


  return (
    <SafeAreaView className="flex-1 bg-screenBackground" edges={['top']}>
      <View className="flex-1 items-center justify-center">
        <Text className="text-h1 font-bold text-black">내여행</Text>
        <TouchableOpacity
                  onPress={handleNavigateToWish}
                  className="bg-main px-6 py-3 rounded-lg">
                  <Text className="text-white font-semibold">여행지 상세 보기</Text>
                </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

MapScreen.displayName = 'MapScreen';

export default MapScreen;
export { MapScreen };