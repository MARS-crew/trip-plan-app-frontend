import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { SignUpFormData, SignUpScreenNavigationProp, TermsAgreement } from '@/types/signup';
import { postSignUp } from '@/services';
import { showToastMessage } from '@/utils';

export const useSignUpSubmit = () => {
  const navigation = useNavigation<SignUpScreenNavigationProp>();

  const handleSignUp = useCallback(
    async (
      formData: SignUpFormData,
      termsAgreement: TermsAgreement,
      isTermsAccepted: boolean,
    ): Promise<boolean> => {
      const payloadForSignUp = {
        usersId: formData.accountId,
        name: formData.name,
        email: formData.email,
        nickname: formData.nickname,
        password: formData.password,
        passwordConfirm: formData.passwordConfirm,
        gender: formData.gender.toUpperCase(),
        birth: formData.birthDate,
        countryCode: formData.country,
        privacyAgreed: termsAgreement.privacyPolicy ? 'Y' : 'N',
        marketingAgreed: termsAgreement.marketingConsent ? 'Y' : 'N',
        nightMarketingAgreed: termsAgreement.nightMarketingConsent ? 'Y' : 'N',
        loginType: 'LOCAL',
      };

      const result = await postSignUp(payloadForSignUp);

      if (result.ok) {
        showToastMessage('회원가입에 성공했습니다.');
        navigation.replace('Login');
        return true;
      } else {
        const errorMessage = result.message || '회원가입 실패';
        showToastMessage(errorMessage);
        return false;
      }
    },
    [navigation],
  );

  return {
    handleSignUp,
  };
};
