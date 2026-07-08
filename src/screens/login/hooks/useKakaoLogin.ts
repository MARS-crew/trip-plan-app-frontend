import { useCallback, useEffect, type Dispatch, type SetStateAction } from 'react';
import { initializeKakaoSDK } from '@react-native-kakao/core';
import { login } from '@react-native-kakao/user';
import Config from 'react-native-config';

import type { LoginData } from '@/types/auth';
import type { LoginScreenNavigationProp } from '@/types/login';
import { postKakaoLogin } from '@/services';
import { getKakaoLoginWarningMessage, showToastMessage } from '@/utils';

interface UseKakaoLoginParams {
  navigation: LoginScreenNavigationProp;
  isSubmitting: boolean;
  setIsSubmitting: Dispatch<SetStateAction<boolean>>;
  setLoginWarningMessage: Dispatch<SetStateAction<string>>;
  setAuthFromLoginData: (loginData: LoginData) => void;
}

export const useKakaoLogin = ({
  navigation,
  isSubmitting,
  setIsSubmitting,
  setLoginWarningMessage,
  setAuthFromLoginData,
}: UseKakaoLoginParams) => {
  useEffect(() => {
    initializeKakaoSDK(Config.KAKAO_APP_KEY);
  }, []);

  const handleKakaoLogin = useCallback(async (): Promise<void> => {
    if (isSubmitting) {
      return;
    }

    setLoginWarningMessage('');
    setIsSubmitting(true);

    try {
      const kakaoAuthResult = await login();
      const accessToken = kakaoAuthResult.accessToken?.trim();

      if (!accessToken) {
        setLoginWarningMessage('카카오 인증 정보를 가져오지 못했습니다. 다시 시도해주세요.');
        return;
      }

      const result = await postKakaoLogin(accessToken);

      if (!result.ok) {
        setLoginWarningMessage(getKakaoLoginWarningMessage(result));
        return;
      }

      if (result.data.nextAction === 'login' && result.data.login) {
        setAuthFromLoginData(result.data.login);
        navigation.reset({ index: 0, routes: [{ name: 'MainTabs', params: { screen: 'Home' } }] });
        return;
      }

      if (result.data.nextAction === 'signup' && result.data.signupResponse) {
        navigation.navigate('SignUp', {
          socialSignUpData: result.data.signupResponse,
        });
        return;
      }

      setLoginWarningMessage('카카오 로그인 응답을 처리할 수 없습니다.');
    } catch (error) {
      console.error('[useKakaoLogin] kakao login failed', error);
      setLoginWarningMessage('카카오 로그인에 실패했습니다. 다시 시도해주세요.');
      showToastMessage('카카오 로그인에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, navigation, setAuthFromLoginData, setIsSubmitting, setLoginWarningMessage]);

  return {
    handleKakaoLogin,
  };
};
