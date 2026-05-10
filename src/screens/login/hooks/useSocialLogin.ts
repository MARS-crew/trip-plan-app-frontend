import { useCallback, type Dispatch, type SetStateAction } from 'react';
import NaverLogin from '@react-native-seoul/naver-login';

import type { LoginData, NaverLoginData } from '@/types/auth';
import type { LoginScreenNavigationProp } from '@/types/login';
import { postNaverLogin } from '@/services';
import { getNaverLoginWarningMessage, showToastMessage } from '@/utils';

interface UseSocialLoginParams {
  navigation: LoginScreenNavigationProp;
  isSubmitting: boolean;
  setIsSubmitting: Dispatch<SetStateAction<boolean>>;
  setLoginWarningMessage: Dispatch<SetStateAction<string>>;
  setAuthFromLoginData: (loginData: LoginData) => void;
}

export const useSocialLogin = ({
  navigation,
  isSubmitting,
  setIsSubmitting,
  setLoginWarningMessage,
  setAuthFromLoginData,
}: UseSocialLoginParams) => {
  const handleNaverLogin = useCallback(async (): Promise<void> => {
    if (isSubmitting) {
      return;
    }

    setLoginWarningMessage('');
    setIsSubmitting(true);

    try {
      const naverAuthResult = await NaverLogin.login();
      const accessToken = naverAuthResult.isSuccess
        ? naverAuthResult.successResponse?.accessToken?.trim()
        : undefined;

      if (!accessToken) {
        const failureMessage = naverAuthResult.isSuccess
          ? '네이버 인증 정보를 가져오지 못했습니다. 다시 시도해주세요.'
          : naverAuthResult.failureResponse?.message ||
            '네이버 로그인이 취소되었거나 실패했습니다.';

        setLoginWarningMessage(failureMessage);
        return;
      }

      const result = await postNaverLogin(accessToken);

      if (!result.ok) {
        setLoginWarningMessage(getNaverLoginWarningMessage(result));
        return;
      }

      if (result.data.nextAction === 'login' && result.data.login) {
        setAuthFromLoginData(result.data.login);
        navigation.replace('MainTabs', { screen: 'Home' });
        return;
      }

      if (result.data.nextAction === 'signup' && result.data.signupResponse) {
        navigation.navigate('SignUp', {
          socialSignUpData: result.data.signupResponse,
        });
        return;
      }

      setLoginWarningMessage('네이버 로그인 응답을 처리할 수 없습니다.');
    } catch (error) {
      console.error('[useSocialLogin] naver login failed', error);
      setLoginWarningMessage('네이버 로그인에 실패했습니다. 다시 시도해주세요.');
      showToastMessage('네이버 로그인에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, navigation, setAuthFromLoginData, setIsSubmitting, setLoginWarningMessage]);

  return {
    handleNaverLogin,
  };
};
