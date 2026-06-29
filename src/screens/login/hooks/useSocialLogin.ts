import { useCallback, type Dispatch, type SetStateAction } from 'react';
import NaverLogin from '@react-native-seoul/naver-login';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';

import type { LoginData } from '@/types/auth';
import type { LoginScreenNavigationProp } from '@/types/login';
import { postNaverLogin, postGoogleLogin } from '@/services';
import { getNaverLoginWarningMessage, getGoogleLoginWarningMessage, showToastMessage } from '@/utils';

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

  const handleGoogleLogin = useCallback(async (): Promise<void> => {
    if (isSubmitting) {
      return;
    }

    setLoginWarningMessage('');
    setIsSubmitting(true);

    try {
      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signOut().catch(() => {});
      const signInResult = await GoogleSignin.signIn();
      if (signInResult.type === 'cancelled') {
        return;
      }
      const tokens = await GoogleSignin.getTokens();
      const accessToken = tokens.accessToken?.trim();

      if (!accessToken) {
        setLoginWarningMessage('구글 인증 정보를 가져오지 못했습니다. 다시 시도해주세요.');
        return;
      }

      const result = await postGoogleLogin(accessToken);

      if (!result.ok) {
        setLoginWarningMessage(getGoogleLoginWarningMessage(result));
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

      setLoginWarningMessage('구글 로그인 응답을 처리할 수 없습니다.');
    } catch (error: unknown) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error
      ) {
        const code = (error as { code: string }).code;
        if (code === statusCodes.SIGN_IN_CANCELLED) {
          return;
        }
        if (code === statusCodes.IN_PROGRESS) {
          return;
        }
        if (code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
          setLoginWarningMessage('Google Play 서비스를 사용할 수 없습니다.');
          return;
        }
      }

      console.error('[useSocialLogin] google login failed', error);
      setLoginWarningMessage('구글 로그인에 실패했습니다. 다시 시도해주세요.');
      showToastMessage('구글 로그인에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, navigation, setAuthFromLoginData, setIsSubmitting, setLoginWarningMessage]);

  return {
    handleNaverLogin,
    handleGoogleLogin,
  };
};
