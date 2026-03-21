import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { ContentContainer, TopBar } from '@/components';
import type { RootStackParamList } from '@/navigation/types';

// ============ Types ============
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// ============ Component ============
const FindIdScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  // Hooks
  const [nickname, setNickname] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [foundId, setFoundId] = useState<string | null>(null);
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const isSubmitDisabled = nickname.trim().length === 0 || !isEmailValid;

  // Handlers
  const handleSubmit = (): void => {
    // TODO: API 연결 후 응답값으로 setFoundId 호출
    setFoundId('trav****');
  };

  const handleChangeNickname = (value: string): void => {
    setNickname(value);
    if (foundId !== null) {
      setFoundId(null);
    }
  };

  const handleChangeEmail = (value: string): void => {
    setEmail(value);
    if (foundId !== null) {
      setFoundId(null);
    }
  };

  const handleNavigateToLogin = (): void => {
    // TODO: 로그인 화면으로 이동
  };

  return (
    <SafeAreaView className="flex-1 bg-screenBackground">
      <TopBar title="아이디 찾기" onPress={() => navigation.goBack()} />
      <View className="flex-1 px-4 pt-6">
        <ContentContainer className="px-6 py-6">
          <Text className="text-p text-gray mb-4">
            {'가입 시 등록한 이메일과 닉네임을 입력하면\n아이디를 찾을 수 있습니다.'}
          </Text>

          <View className="mb-4">
            <View className="flex-row mb-2">
              <Text className="text-h3 font-semibold text-black">닉네임</Text>
              <Text className="text-p1 text-errormessage">*</Text>
            </View>
            <TextInput
              className="w-full h-[46px] bg-inputBackground rounded-xl px-3 text-p1 textstyle-Regular border border-borderGray"
              placeholder="닉네임을 입력해주세요" 
              placeholderTextColor="#8C7B73"
              value={nickname}
              onChangeText={handleChangeNickname}
            />
          </View>

          <View className="mb-4">
            <View className="flex-row mb-2">
              <Text className="text-h3 font-semibold text-black">이메일</Text>
              <Text className="text-p1 text-errormessage">*</Text>
            </View>
            <TextInput
              className="w-full h-[46px] bg-inputBackground rounded-xl px-3 text-p1 textstyle-Regular border border-borderGray"
              placeholder="이메일을 입력해주세요"
              placeholderTextColor="#8C7B73"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={handleChangeEmail}
            />
          </View>

          <TouchableOpacity
            className={`w-full h-11 rounded-lg items-center justify-center ${isSubmitDisabled ? 'bg-main/50' : 'bg-main'}`}
            onPress={handleSubmit}
            disabled={isSubmitDisabled}
            accessibilityRole="button"
            accessibilityLabel="아이디 찾기">
            <Text className="text-h3 font-semibold text-white">아이디 찾기</Text>
          </TouchableOpacity>

          {foundId !== null && (
            <View className="mt-4 rounded-lg bg-main/10 px-4 py-4">
              <Text className="mb-2 text-p1 text-black">
                {'등록된 아이디: '}
                <Text className="font-bold text-main">{foundId}</Text>
              </Text>
              <TouchableOpacity
                onPress={handleNavigateToLogin}
                accessibilityRole="link"
                accessibilityLabel="로그인하러 가기">
                <Text className="text-p text-main">로그인하러 가기</Text>
              </TouchableOpacity>
            </View>
          )}
        </ContentContainer>
      </View>
    </SafeAreaView>
  );
};

FindIdScreen.displayName = 'FindIdScreen';

export default FindIdScreen;
export { FindIdScreen };
