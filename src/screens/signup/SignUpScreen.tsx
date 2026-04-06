import React, { useState, useCallback, useMemo, useRef } from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  View,
  Text,
  Pressable,
  TouchableOpacity,
  type LayoutChangeEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { TopBar } from '@/components';
import {
  AccountSection,
  ProfileSection,
  EmailSection,
  TermsSection,
  type SignUpFormData,
  type TermsAgreement,
} from './components';
import type { RootStackParamList } from '@/navigation/types';

// ============ Types ============
type EmailStatus = 'none' | 'sent' | 'error';
type CodeStatus = 'none' | 'success' | 'error';

type IdCheckStatus = 'idle' | 'available' | 'duplicate';
type RequiredFieldKey =
  | 'accountId'
  | 'nickname'
  | 'password'
  | 'passwordConfirm'
  | 'name'
  | 'birthDate'
  | 'gender'
  | 'country'
  | 'email';
type SectionKey = 'account' | 'profile' | 'email';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const COUNTRIES = ['대한민국', '미국', '일본', '중국', '영국', '프랑스', '독일'] as const;

const DUPLICATE_ACCOUNT_IDS = ['admin', 'test1234', 'tripplan'];
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TEMP_VERIFICATION_CODE = '123456';

// ============ Component ============
const SignUpScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  // 1. Hooks
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
  });

  const [showCountryPicker, setShowCountryPicker] = useState<boolean>(false);
  const [idCheckStatus, setIdCheckStatus] = useState<IdCheckStatus>('idle');
  const [emailStatus, setEmailStatus] = useState<EmailStatus>('none');
  const [codeStatus, setCodeStatus] = useState<CodeStatus>('none');
  const [isCodeFieldVisible, setIsCodeFieldVisible] = useState<boolean>(false);
  const [showFieldErrors, setShowFieldErrors] = useState<boolean>(false);
  const [showTermsError, setShowTermsError] = useState<boolean>(false);
  const scrollViewRef = useRef<ScrollView | null>(null);
  const fieldPositionsRef = useRef<Partial<Record<RequiredFieldKey, number>>>({});
  const sectionYRef = useRef<Record<SectionKey, number>>({
    account: 0,
    profile: 0,
    email: 0,
  });

  // 2. 파생 값

  const isPasswordMatched = useMemo(() => {
    if (!formData.password || !formData.passwordConfirm) return true;
    return formData.password === formData.passwordConfirm;
  }, [formData.password, formData.passwordConfirm]);

  const isPasswordValid = useMemo(() => {
    if (formData.password.length === 0) return true;
    return PASSWORD_REGEX.test(formData.password);
  }, [formData.password]);

  const isIdVerified = idCheckStatus === 'available';
  const isEmailSent = emailStatus === 'sent';
  const isEmailError = emailStatus === 'error';
  const isCodeError = codeStatus === 'error';
  const isCodeVerified = codeStatus === 'success';
  const canSendCode = formData.email.trim().length > 0;
  const sendCodeButtonText = isCodeFieldVisible || isCodeVerified ? '재전송' : '인증번호 발송';

  let idMessage = '';
  let idMessageClass = 'text-transparent';
  let idInputClass = '';
  const hasPasswordError = formData.password.length > 0 && !isPasswordValid;
  const passwordInputClassName = hasPasswordError ? 'border-main bg-white' : '';

  if (idCheckStatus === 'available') {
    idMessage = '사용 가능한 아이디입니다.';
    idMessageClass = 'text-statusSuccess';
    idInputClass = 'bg-emailBackground';
  } else if (idCheckStatus === 'duplicate') {
    idMessage = '중복된 아이디입니다.';
    idMessageClass = 'text-statusError';
  }

  const registerSectionY = useCallback(
    (section: SectionKey) => (event: LayoutChangeEvent) => {
      sectionYRef.current[section] = event.nativeEvent.layout.y;
    },
    [],
  );

  const registerFieldPosition = useCallback(
    (field: RequiredFieldKey, section: SectionKey) => (event: LayoutChangeEvent) => {
      const sectionY = sectionYRef.current[section] ?? 0;
      fieldPositionsRef.current[field] = sectionY + event.nativeEvent.layout.y;
    },
    [],
  );

  const getFirstInvalidField = useCallback((): RequiredFieldKey | null => {
    if (formData.accountId.trim().length === 0 || !isIdVerified) return 'accountId';
    if (formData.nickname.trim().length === 0) return 'nickname';
    if (formData.password.trim().length === 0 || !isPasswordValid) return 'password';
    if (formData.passwordConfirm.trim().length === 0 || !isPasswordMatched)
      return 'passwordConfirm';
    if (formData.name.trim().length === 0) return 'name';
    if (formData.birthDate.trim().length === 0) return 'birthDate';
    if (formData.gender.length === 0) return 'gender';
    if (formData.country.length === 0) return 'country';
    if (formData.email.trim().length === 0 || !isCodeVerified) return 'email';
    return null;
  }, [
    formData.accountId,
    formData.nickname,
    formData.password,
    formData.passwordConfirm,
    formData.name,
    formData.birthDate,
    formData.gender,
    formData.country,
    formData.email,
    isIdVerified,
    isPasswordValid,
    isPasswordMatched,
    isCodeVerified,
  ]);

  // 콜백 functions
  const handleFormChange = useCallback((field: keyof SignUpFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (field === 'accountId') {
      setIdCheckStatus('idle');
    }

    if (field === 'verificationCode') {
      setCodeStatus('none');
    }
  }, []);

  const handleChangeEmail = useCallback((value: string) => {
    setFormData((prev) => ({
      ...prev,
      email: value,
      verificationCode: '',
    }));

    setEmailStatus('none');
    setCodeStatus('none');
    setIsCodeFieldVisible(false);
  }, []);

  const handleSendVerification = useCallback(() => {
    const trimmedEmail = formData.email.trim();
    const isEmailFormatValid = EMAIL_REGEX.test(trimmedEmail);

    if (!isEmailFormatValid) {
      setEmailStatus('error');
      setIsCodeFieldVisible(false);
      setCodeStatus('none');
      return;
    }

    setEmailStatus('sent');
    setIsCodeFieldVisible(true);
    setCodeStatus('none');
    setFormData((prev) => ({
      ...prev,
      verificationCode: '',
    }));
  }, [formData.email]);

  const handleVerifyEmailCode = useCallback(() => {
    const isVerified =
      formData.verificationCode.trim().length === 6 &&
      formData.verificationCode.trim() === TEMP_VERIFICATION_CODE;

    setCodeStatus(isVerified ? 'success' : 'error');

    if (isVerified) {
      setIsCodeFieldVisible(false);
    }
  }, [formData.verificationCode]);

  const handleCheckId = useCallback(() => {
    const normalizedAccountId = formData.accountId.trim();

    if (normalizedAccountId.length === 0) {
      setIdCheckStatus('idle');
      return;
    }

    const isDuplicate = DUPLICATE_ACCOUNT_IDS.includes(normalizedAccountId.toLowerCase());
    setIdCheckStatus(isDuplicate ? 'duplicate' : 'available');
  }, [formData.accountId]);

  const handleGenderSelect = useCallback((gender: 'male' | 'female' | 'other') => {
    setFormData((prev) => ({
      ...prev,
      gender,
    }));
  }, []);

  const handleCountrySelect = useCallback((country: string) => {
    setFormData((prev) => ({
      ...prev,
      country,
    }));
    setShowCountryPicker(false);
  }, []);

  const handleTermsChange = useCallback((field: keyof TermsAgreement, value: boolean) => {
    let nextServiceTerms = termsAgreement.serviceTerms;

    if (field === 'allTerms') {
      nextServiceTerms = value;
      setTermsAgreement({
        allTerms: value,
        serviceTerms: value,
        privacyPolicy: value,
        marketingConsent: value,
      });
    } else {
      setTermsAgreement((prev) => {
        const updatedTerms = { ...prev, [field]: value };
        nextServiceTerms = updatedTerms.serviceTerms;
        const allTermsChecked =
          updatedTerms.serviceTerms && updatedTerms.privacyPolicy && updatedTerms.marketingConsent;
        return {
          ...updatedTerms,
          allTerms: allTermsChecked,
        };
      });
    }

    if (nextServiceTerms) {
      setShowTermsError(false);
    }
  }, [termsAgreement.serviceTerms]);

  const handleChangeId = useCallback(
    (text: string) => handleFormChange('accountId', text),
    [handleFormChange],
  );

  const handleChangeNickname = useCallback(
    (text: string) => handleFormChange('nickname', text),
    [handleFormChange],
  );

  const handleChangePassword = useCallback(
    (text: string) => handleFormChange('password', text),
    [handleFormChange],
  );

  const handleChangePasswordConfirm = useCallback(
    (text: string) => handleFormChange('passwordConfirm', text),
    [handleFormChange],
  );

  const handleChangeName = useCallback(
    (text: string) => handleFormChange('name', text),
    [handleFormChange],
  );

  const handleChangeBirthDate = useCallback(
    (text: string) => handleFormChange('birthDate', text),
    [handleFormChange],
  );

  const handleChangeCode = useCallback(
    (text: string) => handleFormChange('verificationCode', text),
    [handleFormChange],
  );

  const handleToggleCountryPicker = useCallback(() => {
    setShowCountryPicker((prev) => !prev);
  }, []);

  const handleSignUp = useCallback(() => {
    const firstInvalidField = getFirstInvalidField();
    const isTermsAccepted = termsAgreement.serviceTerms;

    setShowTermsError(!isTermsAccepted);

    if (firstInvalidField) {
      setShowFieldErrors(true);
      const y = fieldPositionsRef.current[firstInvalidField];
      if (typeof y === 'number') {
        scrollViewRef.current?.scrollTo({ y: Math.max(0, y - 24), animated: true });
      }
      return;
    }

    if (!isTermsAccepted) {
      return;
    }

    setShowFieldErrors(false);
    // TODO: API 연동
    navigation.replace('MainTabs', { screen: 'Home' });
  }, [getFirstInvalidField, navigation, termsAgreement.serviceTerms]);

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleNavigatePrivacyPolicy = useCallback(() => {
    navigation.navigate('PrivacyPolicyScreen');
  }, [navigation]);

  const handleNavigateMarketingConsent = useCallback(() => {
    navigation.navigate('MarketingConsentScreen');
  }, [navigation]);

  const handleNavigateNightMarketing = useCallback(() => {
    navigation.navigate('NightMarketingScreen');
  }, [navigation]);

  // 3. 렌더링
  return (
    <SafeAreaView className="flex-1 bg-screenBackground" edges={['top']}>
      <KeyboardAvoidingView className="flex-1" behavior="padding">
        <TopBar title="회원가입" onPress={handleGoBack} />

        <ScrollView
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}>
          <View onLayout={registerSectionY('account')}>
            <AccountSection
              formData={formData}
              idCheckStatus={idCheckStatus}
              idMessage={idMessage}
              idMessageClass={idMessageClass}
              idInputClass={idInputClass}
              showFieldErrors={showFieldErrors}
              isIdVerified={isIdVerified}
              isPasswordValid={isPasswordValid}
              isPasswordMatched={isPasswordMatched}
              hasPasswordError={hasPasswordError}
              passwordInputClassName={passwordInputClassName}
              onCheckId={handleCheckId}
              onChangeId={handleChangeId}
              onChangeNickname={handleChangeNickname}
              onChangePassword={handleChangePassword}
              onChangePasswordConfirm={handleChangePasswordConfirm}
              onIdLayout={registerFieldPosition('accountId', 'account')}
              onNicknameLayout={registerFieldPosition('nickname', 'account')}
              onPasswordLayout={registerFieldPosition('password', 'account')}
              onPasswordConfirmLayout={registerFieldPosition('passwordConfirm', 'account')}
            />
          </View>

          <View onLayout={registerSectionY('profile')}>
            <ProfileSection
              formData={formData}
              countries={COUNTRIES}
              showCountryPicker={showCountryPicker}
              showFieldErrors={showFieldErrors}
              onChangeName={handleChangeName}
              onChangeBirthDate={handleChangeBirthDate}
              onSelectGender={handleGenderSelect}
              onToggleCountryPicker={handleToggleCountryPicker}
              onSelectCountry={handleCountrySelect}
              onNameLayout={registerFieldPosition('name', 'profile')}
              onBirthDateLayout={registerFieldPosition('birthDate', 'profile')}
              onGenderLayout={registerFieldPosition('gender', 'profile')}
              onCountryLayout={registerFieldPosition('country', 'profile')}
            />
          </View>

          <View onLayout={registerSectionY('email')}>
            <EmailSection
              formData={formData}
              isCodeVerified={isCodeVerified}
              isEmailError={isEmailError}
              isEmailSent={isEmailSent}
              isCodeError={isCodeError}
              isCodeFieldVisible={isCodeFieldVisible}
              canSendCode={canSendCode}
              sendCodeButtonText={sendCodeButtonText}
              showFieldErrors={showFieldErrors}
              onChangeEmail={handleChangeEmail}
              onSendVerification={handleSendVerification}
              onVerifyCode={handleVerifyEmailCode}
              onChangeVerificationCode={handleChangeCode}
              onEmailLayout={registerFieldPosition('email', 'email')}
            />
          </View>

          <TermsSection
            termsAgreement={termsAgreement}
            onTermsChange={handleTermsChange}
            onNavigatePrivacyPolicy={handleNavigatePrivacyPolicy}
            onNavigateMarketingConsent={handleNavigateMarketingConsent}
            onNavigateNightMarketing={handleNavigateNightMarketing}
          />

          {showTermsError && !termsAgreement.serviceTerms ? (
            <Text className="mt-2 mb-4 ml-1 text-left text-p text-statusError">이용약관에 동의해주세요</Text>
          ) : null}

          {/* 회원가입 버튼 */}
          <TouchableOpacity
            onPress={handleSignUp}
            className="mt-5 h-11 items-center justify-center rounded-lg bg-main">
            <Text className="text-h3 font-pretendardSemiBold text-white">가입하기</Text>
          </TouchableOpacity>

          <Pressable onPress={() => navigation.navigate('Login')} className="mt-5">
            <Text className="text-center text-p text-gray">
              이미 계정이 있으신가요? <Text className="text-main">로그인</Text>
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

SignUpScreen.displayName = 'SignUpScreen';

export default SignUpScreen;
