import { useNavigation } from '@react-navigation/native';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { HomeStackParamList } from '@/navigation';
import type { RootStackParamList } from '@/navigation';

// ============ Types ============
type NavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<HomeStackParamList>,
  NativeStackNavigationProp<RootStackParamList>
>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  const handleNavigateToDetail = useCallback(() => {
    navigation.navigate('Alert');
  }, [navigation]);

  return (
    <SafeAreaView className="flex-1 bg-screenBackground" edges={['top']}>
      <View className="flex-1 items-center justify-center">
        <Text className="text-h1 font-bold text-black">홈</Text>
        <TouchableOpacity
          onPress={handleNavigateToDetail}
          className="bg-main px-6 py-3 rounded-lg">
          <Text className="text-white font-semibold">알림 리스트</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

HomeScreen.displayName = 'HomeScreen';

export default HomeScreen;
export { HomeScreen };