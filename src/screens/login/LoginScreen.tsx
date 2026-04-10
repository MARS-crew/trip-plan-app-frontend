import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import { AppLogoIcon, GoogleIcon, KakaoIcon, NaverIcon } from '@/assets';
import { LabeledInput } from '@/components';
import { COLORS } from '@/constants';
import { postLogin } from '@/services';
import { useAuthStore } from '@/store';
import type { LoginFailureResult } from '@/types/auth';

import SocialLoginButton from './SocialLoginButton';
import type { LoginScreenNavigationProp } from './types';

const getLoginWarningMessage = (failure: LoginFailureResult): string => {
  if (failure.warningType === 'EMPTY_FIELDS') {
    return '아이디와 비밀번호를 입력해주세요.';
  }

  if (failure.warningType === 'INVALID_INPUT') {
    return '잘못된 요청입니다.';
  }

  if (failure.warningType === 'PASSWORD_MISMATCH') {
    return '비밀번호가 일치하지 않습니다.';
  }

  if (failure.warningType === 'USER_NOT_FOUND') {
    return '사용자를 찾을 수 없습니다.';
  }

  if (failure.warningType === 'SERVER_ERROR') {
    return '서버가 불안정합니다. 잠시 후 다시 시도해주세요.';
  }

  if (failure.warningType === 'NETWORK_ERROR') {
    return '네트워크 연결을 확인해주세요.';
  }

  return failure.message?.trim() || '로그인에 실패했습니다. 다시 시도해주세요.';
};

const LoginScreen: React.FC = () => {
  // Hooks
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const setAuthFromLoginData = useAuthStore((state) => state.setAuthFromLoginData);
  const [userId, setUserId] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loginWarningMessage, setLoginWarningMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Derived values
  const hasLoginWarning = loginWarningMessage.length > 0;
  const isLoginDisabled = isSubmitting;

  // Handlers
  const handleChangeUserId = (value: string): void => {
    setUserId(value);
    if (hasLoginWarning) {
      setLoginWarningMessage('');
    }
  };

  const handleChangePassword = (value: string): void => {
    setPassword(value);
    if (hasLoginWarning) {
      setLoginWarningMessage('');
    }
  };

  const handleLogin = async (): Promise<void> => {
    const trimmedUserId = userId.trim();
    const trimmedPassword = password.trim();

    if (trimmedUserId.length === 0 || trimmedPassword.length === 0) {
      setLoginWarningMessage('아이디와 비밀번호를 입력해주세요.');
      return;
    }

    if (isSubmitting) {
      return;
    }

    setLoginWarningMessage('');

    setIsSubmitting(true);

    try {
      const result = await postLogin({ usersId: trimmedUserId, password: trimmedPassword });

      if (!result.ok) {
        setLoginWarningMessage(getLoginWarningMessage(result));
        return;
      }

      setAuthFromLoginData(result.data);
      navigation.replace('MainTabs', { screen: 'Home' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePressLogin = (): void => {
    void handleLogin();
  };

  const handleFindId = (): void => {
    navigation.navigate('FindId');
  };

  const handleFindPassword = (): void => {
    navigation.navigate('FindPassword');
  };

  const handleSignUp = (): void => {
    navigation.navigate('SignUp');
  };

  // Rendering
  return (
    <SafeAreaView className="flex-1 bg-screenBackground" edges={['top']}>
      <KeyboardAvoidingView className="flex-1">
        <ScrollView>
          <View className="items-center px-5 pt-5 pb-8">
            <View className="mt-8 items-center">
              <AppLogoIcon width={64} height={96} />
              <Text className="mt-4 font-pretendardMedium text-p1 text-gray">
                똑똑한 여행의 시작 여행추천 AI
              </Text>
            </View>

            <View
              className="mt-8 w-full rounded-lg bg-white px-6 py-6"
              style={{
                shadowColor: COLORS.black,
                shadowOpacity: 0.25,
                shadowRadius: 5,
                shadowOffset: { width: 0, height: 0 },
                elevation: 5,
              }}>
              <LabeledInput
                label="아이디"
                required={false}
                containerClassName=""
                value={userId}
                onChangeText={handleChangeUserId}
                placeholder="아이디를 입력하세요"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
              />

              <LabeledInput
                label="비밀번호"
                required={false}
                containerClassName="mt-4"
                value={password}
                onChangeText={handleChangePassword}
                placeholder="비밀번호를 입력하세요"
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="done"
                onSubmitEditing={handlePressLogin}
              />

              {hasLoginWarning && (
                <Text className="mt-3 text-p text-errmassage">{loginWarningMessage}</Text>
              )}

              <TouchableOpacity
                onPress={handlePressLogin}
                disabled={isLoginDisabled}
                className={`mt-4 h-11 w-full items-center justify-center rounded-lg ${isLoginDisabled ? 'bg-main/50' : 'bg-main'}`}
                accessibilityRole="button"
                accessibilityLabel="로그인"
                accessibilityState={{ disabled: isLoginDisabled, busy: isSubmitting }}>
                <Text className="text-h3 text-white">로그인</Text>
              </TouchableOpacity>

              <View className="mt-4 flex-row items-center justify-center">
                <Pressable
                  onPress={handleFindId}
                  accessibilityRole="button"
                  accessibilityLabel="아이디 찾기">
                  <Text className="text-p text-gray">아이디 찾기</Text>
                </Pressable>
                <View className="mx-3 h-3 w-px bg-borderGray" />
                <Pressable
                  onPress={handleFindPassword}
                  accessibilityRole="button"
                  accessibilityLabel="비밀번호 찾기">
                  <Text className="text-p text-gray">비밀번호 찾기</Text>
                </Pressable>
                <View className="mx-3 h-3 w-px bg-borderGray" />
                <Pressable
                  onPress={handleSignUp}
                  accessibilityRole="button"
                  accessibilityLabel="회원가입">
                  <Text className="text-p text-main">회원가입</Text>
                </Pressable>
              </View>

              <View className="mt-6 flex-row items-center">
                <View className="h-px flex-1 bg-borderGray" />
                <Text className="mx-3 text-p text-gray">소셜 로그인</Text>
                <View className="h-px flex-1 bg-borderGray" />
              </View>
              <View className="mt-3">
                <SocialLoginButton
                  label="카카오로 시작하기"
                  bgClassName="bg-kakaoYellow"
                  textClassName="text-black"
                  icon={<KakaoIcon width={18} height={18} />}
                />
                <SocialLoginButton
                  label="네이버로 시작하기"
                  bgClassName="bg-naverGreen"
                  textClassName="text-white"
                  icon={<NaverIcon width={18} height={18} />}
                />
                <SocialLoginButton
                  label="Google로 시작하기"
                  bgClassName="bg-white"
                  textClassName="text-black"
                  icon={<GoogleIcon width={18} height={18} />}
                  outlined
                />
              </View>
            </View>

            <Text className="mt-6 text-p text-gray">
              로그인 시 이용약관 및 개인정보처리방침에 동의합니다.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

LoginScreen.displayName = 'LoginScreen';

export default LoginScreen;
export { LoginScreen };
