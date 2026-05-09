import { useState, useCallback } from 'react';
import type {
  SignUpFormData,
  TermsAgreement,
  AccountFieldKey,
} from '@/types/signup';

export const useSignUpForm = () => {
  const [formData, setFormData] = useState<SignUpFormData>({
    accountId: '',
    nickname: '',
    password: '',
    passwordConfirm: '',
    name: '',
    birthDate: '',
    gender: '',
    country: '',
    email: '',
    verificationCode: '',
  });

  const [termsAgreement, setTermsAgreement] = useState<TermsAgreement>({
    allTerms: false,
    serviceTerms: false,
    privacyPolicy: false,
    marketingConsent: false,
    nightMarketingConsent: false,
  });

  const [dismissedAccountFieldErrors, setDismissedAccountFieldErrors] = useState<
    Partial<Record<AccountFieldKey, boolean>>
  >({});

  const handleFormChange = useCallback((field: keyof SignUpFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const handleChangeId = useCallback(
    (text: string) => {
      setDismissedAccountFieldErrors((prev) => ({ ...prev, accountId: true }));
      handleFormChange('accountId', text);
    },
    [handleFormChange],
  );

  const handleChangeNickname = useCallback(
    (text: string) => {
      setDismissedAccountFieldErrors((prev) => ({ ...prev, nickname: true }));
      handleFormChange('nickname', text);
    },
    [handleFormChange],
  );

  const handleChangePassword = useCallback(
    (text: string) => {
      setDismissedAccountFieldErrors((prev) => ({ ...prev, password: true }));
      handleFormChange('password', text);
    },
    [handleFormChange],
  );

  const handleChangePasswordConfirm = useCallback(
    (text: string) => {
      setDismissedAccountFieldErrors((prev) => ({ ...prev, passwordConfirm: true }));
      handleFormChange('passwordConfirm', text);
    },
    [handleFormChange],
  );

  const handleChangeName = useCallback(
    (text: string) => handleFormChange('name', text),
    [handleFormChange],
  );

  const handleTermsChange = useCallback(
    (field: keyof TermsAgreement, value: boolean) => {
      if (field === 'allTerms') {
        setTermsAgreement({
          allTerms: value,
          serviceTerms: value,
          privacyPolicy: value,
          marketingConsent: value,
          nightMarketingConsent: value,
        });
      } else {
        setTermsAgreement((prev) => {
          const updatedTerms = { ...prev, [field]: value };

          // 일부 항목 네이밍 불일치 보정: 서비스 약관 체크는 개인정보 동의 항목과 동일 동작으로 취급
          if (field === 'serviceTerms') {
            updatedTerms.privacyPolicy = value;
          }

          // allTerms는 개별 필드(서비스, 마케팅, 야간마케팅)가 모두 체크되면 true
          const allTermsChecked =
            updatedTerms.serviceTerms &&
            updatedTerms.marketingConsent &&
            updatedTerms.nightMarketingConsent;

          return {
            ...updatedTerms,
            allTerms: allTermsChecked,
          };
        });
      }
    },
    [],
  );

  return {
    formData,
    setFormData,
    termsAgreement,
    setTermsAgreement,
    dismissedAccountFieldErrors,
    setDismissedAccountFieldErrors,
    handleFormChange,
    handleChangeId,
    handleChangeNickname,
    handleChangePassword,
    handleChangePasswordConfirm,
    handleChangeName,
    handleTermsChange,
  };
};
