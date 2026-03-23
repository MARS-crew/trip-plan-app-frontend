import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
const MyPageScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const handleNavigateToProfileEdit = useCallback(() => {
    navigation.navigate('ProfileEditScreen');
  }, [navigation]);
  const handleNavigateToPrivacy = useCallback(() => {
    navigation.navigate('PrivacyPolicyScreen');
  }, [navigation]);
  const handleNavigateToMarketing = useCallback(() => {
    navigation.navigate('MarketingConsentScreen');
  }, [navigation]);
  const handleNavigateToNightMarketing = useCallback(() => {
    navigation.navigate('NightMarketingScreen');
  }, [navigation]);
  return (
    <SafeAreaView className="flex-1 bg-screenBackground" edges={['top']}>
      <View className="flex-1 items-center justify-center gap-3 px-4">
        <Text className="text-h1 font-bold text-black">마이페이지</Text>
        <TouchableOpacity
          onPress={handleNavigateToProfileEdit}
          className="bg-main px-6 py-3 rounded-lg">
          <Text className="text-white font-semibold">프로필 편집</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleNavigateToPrivacy}
          className="bg-main px-6 py-3 rounded-lg">
          <Text className="text-white font-semibold">약관동의</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleNavigateToMarketing}
          className="bg-main px-6 py-3 rounded-lg">
          <Text className="text-white font-semibold">마케팅동의</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleNavigateToNightMarketing}
          className="bg-main px-6 py-3 rounded-lg">
          <Text className="text-white font-semibold">야간마케팅동의</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

MyPageScreen.displayName = 'MyPageScreen';

export default MyPageScreen;
export { MyPageScreen };