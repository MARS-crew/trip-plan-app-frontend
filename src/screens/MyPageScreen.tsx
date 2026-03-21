import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { RootStackParamList } from '@/navigation';

// ============ Types ============
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const MyPageScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  // Hooks
  const handleNavigateToFindPassword = useCallback(() => {
    navigation.navigate('FindPassword');
  }, [navigation]);

  return (
    <SafeAreaView className="flex-1 bg-screenBackground" edges={['top']}>
      <View className="flex-1 items-center justify-center px-4">
        <Text className="text-h1 font-bold text-black mb-4">마이페이지</Text>
        <TouchableOpacity
          onPress={handleNavigateToFindPassword}
          className="bg-main px-6 py-3 rounded-lg">
          <Text className="text-white font-semibold">비밀번호 찾기</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

MyPageScreen.displayName = 'MyPageScreen';

export default MyPageScreen;
export { MyPageScreen };