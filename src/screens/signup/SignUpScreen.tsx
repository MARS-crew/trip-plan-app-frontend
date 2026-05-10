import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';

import { TopBar } from '@/components';
import { ContentContainer, LabeledInput } from '@/components/ui';
import { DownDropdownIcon, UpDropdownIcon } from '@/assets';
import {
  AccountSection,
  EmailSection,
  TermsSection,
  BirthDatePickerModal,
  CountryPickerModal,
} from './components';
import type { RootStackParamList } from '@/navigation/types';
import type { SignUpScreenNavigationProp } from '@/types/signup';
import { showToastMessage } from '@/utils';
import { getSignUpIdCheckMessage } from '@/utils/error';
import {
  useSignUpForm,
  useIdVerification,
  useEmailVerification,
  useBirthDatePicker,
  useCountryPicker,
  useFormValidation,
  useSignUpSubmit,
} from './hooks';
import { getDaysInMonth } from './constants';

const normalizeSocialGender = (gender?: string): 'male' | 'female' | 'other' | '' => {
  const normalized = gender?.trim().toUpperCase();

  if (normalized === 'MALE') return 'male';
  if (normalized === 'FEMALE') return 'female';
  if (normalized === 'OTHER') return 'other';

  return '';
};

// ============ Component ============
const SignUpScreen: React.FC = () => {
  const navigation = useNavigation<SignUpScreenNavigationProp>();
  const route = useRoute<RouteProp<RootStackParamList, 'SignUp'>>();

  // ========== Custom Hooks ==========
  const signUpForm = useSignUpForm();
  const idVerification = useIdVerification();
  const emailVerification = useEmailVerification();
  const birthDatePicker = useBirthDatePicker();
  const countryPicker = useCountryPicker();
  const formValidation = useFormValidation();
  const socialSignUpData = route.params?.socialSignUpData;
  const signUpSubmit = useSignUpSubmit(socialSignUpData);

  // ========== Refs ==========
  const scrollViewRef = useRef<ScrollView | null>(null);

  // ========== Derived Values ==========
  const isIdVerified = idVerification.idCheckStatus === 'available';
  const isPasswordValid = formValidation.isPasswordValid(signUpForm.formData.password);
  const isPasswordMatched = formValidation.isPasswordMatched(
    signUpForm.formData.password,
    signUpForm.formData.passwordConfirm,
  );
  const isEmailSent = emailVerification.emailStatus === 'sent';
  const isCodeError = emailVerification.codeStatus === 'error';
  const canSendCode = signUpForm.formData.email.trim().length > 0;
  const sendCodeButtonText =
    emailVerification.isCodeFieldVisible || emailVerification.isEmailVerified
      ? '재전송'
      : '인증번호 발송';

  const days = useMemo(
    () =>
      Array.from(
        { length: getDaysInMonth(birthDatePicker.tempYear, birthDatePicker.tempMonth) },
        (_, i) => i + 1,
      ),
    [birthDatePicker.tempYear, birthDatePicker.tempMonth],
  );

  const hasPasswordError = signUpForm.formData.password.length > 0 && !isPasswordValid;
  const passwordInputClassName = hasPasswordError ? 'border-main bg-white' : '';
  const { idMessage, idMessageClass, idInputClass } = getSignUpIdCheckMessage(
    idVerification.idCheckStatus,
  );

  useEffect(() => {
    if (!socialSignUpData) {
      return;
    }

    signUpForm.setFormData((prev) => ({
      ...prev,
      name: socialSignUpData.name || prev.name,
      email: socialSignUpData.email || prev.email,
      nickname: socialSignUpData.nickname || prev.nickname,
      birthDate: socialSignUpData.birth || prev.birthDate,
      gender: normalizeSocialGender(socialSignUpData.gender) || prev.gender,
    }));
    emailVerification.setIsEmailVerified(true);
    emailVerification.setIsCodeFieldVisible(false);
    emailVerification.setEmailStatus('sent');
    emailVerification.setCodeStatus('success');
  }, [socialSignUpData]);

  // ========== Callbacks ==========
  const handleCheckId = useCallback(async () => {
    await idVerification.handleCheckId(signUpForm.formData.accountId);
  }, [idVerification, signUpForm.formData.accountId]);

  const handleSendVerification = useCallback(async () => {
    await emailVerification.handleSendVerification(signUpForm.formData.email);
  }, [emailVerification, signUpForm.formData.email]);

  const handleVerifyEmailCode = useCallback(async () => {
    await emailVerification.handleVerifyEmailCode(
      signUpForm.formData.email,
      signUpForm.formData.verificationCode,
    );
  }, [emailVerification, signUpForm.formData.email, signUpForm.formData.verificationCode]);

  const handleChangeEmail = useCallback(
    (email: string) => {
      signUpForm.setFormData((prev) => ({
        ...prev,
        email,
        verificationCode: '',
      }));
      emailVerification.handleChangeEmail();
    },
    [signUpForm, emailVerification],
  );

  const handleChangeCode = useCallback(
    (text: string) => {
      signUpForm.handleFormChange('verificationCode', text);
    },
    [signUpForm],
  );

  const handleOpenBirthDatePicker = useCallback(() => {
    birthDatePicker.openBirthDatePicker(signUpForm.formData.birthDate);
  }, [birthDatePicker, signUpForm.formData.birthDate]);

  const handleConfirmBirthDate = useCallback(() => {
    const nextBirthDate = birthDatePicker.handleConfirmBirthDate();
    signUpForm.setFormData((prev) => ({
      ...prev,
      birthDate: nextBirthDate,
    }));
  }, [birthDatePicker, signUpForm]);

  const handleGenderSelect = useCallback(
    (gender: 'male' | 'female' | 'other') => {
      signUpForm.setFormData((prev) => ({
        ...prev,
        gender,
      }));
    },
    [signUpForm],
  );

  const handleCountrySelect = useCallback(
    (country: string) => {
      signUpForm.setFormData((prev) => ({
        ...prev,
        country,
      }));
      countryPicker.setShowCountryPicker(false);
    },
    [signUpForm, countryPicker],
  );

  const handleSignUp = useCallback(async () => {
    const firstInvalidField = formValidation.getFirstInvalidField(
      signUpForm.formData,
      isIdVerified,
      isPasswordValid,
      isPasswordMatched,
      emailVerification.isEmailVerified,
      Boolean(socialSignUpData),
    );
    const isTermsAccepted = signUpForm.termsAgreement.serviceTerms;

    if (!isTermsAccepted) {
      formValidation.setShowFieldErrors(false);
      showToastMessage('이용약관에 동의해주세요');
      return;
    }

    if (firstInvalidField) {
      formValidation.setShowFieldErrors(true);
      signUpForm.setDismissedAccountFieldErrors({});
      const y = formValidation.fieldPositionsRef.current[firstInvalidField];
      if (typeof y === 'number') {
        scrollViewRef.current?.scrollTo({ y: Math.max(0, y - 24), animated: true });
      }
      return;
    }

    formValidation.setShowFieldErrors(false);
    await signUpSubmit.handleSignUp(
      signUpForm.formData,
      signUpForm.termsAgreement,
      isTermsAccepted,
    );
  }, [
    formValidation,
    signUpForm,
    isIdVerified,
    isPasswordValid,
    isPasswordMatched,
    emailVerification.isEmailVerified,
    signUpSubmit,
  ]);

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

  const handleNavigateLogin = useCallback(() => {
    navigation.navigate('Login');
  }, [navigation]);

  // ========== Render ==========
  return (
    <SafeAreaView className="flex-1 bg-screenBackground" edges={['top']}>
      <KeyboardAvoidingView className="flex-1" behavior="padding">
        <TopBar title="회원가입" onPress={handleGoBack} />

        <ScrollView
          ref={scrollViewRef}
          scrollEnabled={!countryPicker.showCountryPicker}
          showsVerticalScrollIndicator={false}>
          <View className="px-4 pb-10">
            <View onLayout={formValidation.registerSectionY('account')}>
              <AccountSection
                formData={signUpForm.formData}
                hidePasswordFields={Boolean(socialSignUpData)}
                idCheckStatus={idVerification.idCheckStatus}
                idMessage={idMessage}
                idMessageClass={idMessageClass}
                idInputClass={idInputClass}
                showFieldErrors={formValidation.showFieldErrors}
                isIdVerified={isIdVerified}
                isPasswordValid={isPasswordValid}
                isPasswordMatched={isPasswordMatched}
                hasPasswordError={hasPasswordError}
                passwordInputClassName={passwordInputClassName}
                onCheckId={handleCheckId}
                onChangeId={signUpForm.handleChangeId}
                onChangeNickname={signUpForm.handleChangeNickname}
                onChangePassword={signUpForm.handleChangePassword}
                onChangePasswordConfirm={signUpForm.handleChangePasswordConfirm}
                onIdLayout={formValidation.registerFieldPosition('accountId', 'account')}
                onNicknameLayout={formValidation.registerFieldPosition('nickname', 'account')}
                onPasswordLayout={formValidation.registerFieldPosition('password', 'account')}
                onPasswordConfirmLayout={formValidation.registerFieldPosition(
                  'passwordConfirm',
                  'account',
                )}
              />
            </View>

            <View onLayout={formValidation.registerSectionY('profile')} className="mt-5">
              <ContentContainer className="px-6 py-6">
                <Text className="mb-4 font-pretendardSemiBold text-h3 text-black">개인 정보</Text>

                <View onLayout={formValidation.registerFieldPosition('name', 'profile')}>
                  <LabeledInput
                    label="이름"
                    required={true}
                    placeholder="이름을 입력하세요"
                    value={signUpForm.formData.name}
                    onChangeText={signUpForm.handleChangeName}
                    inputClassName={
                      formValidation.showFieldErrors && signUpForm.formData.name.trim().length === 0
                        ? 'border-statusError'
                        : ''
                    }
                    containerClassName="mb-4"
                  />
                </View>

                <View onLayout={formValidation.registerFieldPosition('birthDate', 'profile')}>
                  <View className="mb-4">
                    <View className="mb-2 flex-row">
                      <Text className="font-pretendardSemiBold text-h3 text-black">생년월일 </Text>
                      <Text className="text-p1 text-statusError">*</Text>
                    </View>
                    <Pressable
                      onPress={handleOpenBirthDatePicker}
                      className={`h-[46px] w-full flex-row items-center rounded-xl border bg-inputBackground px-3 ${
                        formValidation.showFieldErrors &&
                        signUpForm.formData.birthDate.trim().length === 0
                          ? 'border-statusError'
                          : 'border-borderGray'
                      }`}>
                      <Text
                        className={`flex-1 text-p1 ${
                          signUpForm.formData.birthDate ? 'text-black' : 'text-gray'
                        }`}>
                        {signUpForm.formData.birthDate || '생년월일을 선택해주세요'}
                      </Text>
                      <DownDropdownIcon width={16} height={16} />
                    </Pressable>
                  </View>
                </View>

                <View
                  className="mb-4"
                  onLayout={formValidation.registerFieldPosition('gender', 'profile')}>
                  <View className="mb-2 flex-row">
                    <Text className="text-h3 text-black">성별 </Text>
                    <Text className="text-p1 text-statusError">*</Text>
                  </View>
                  <View className="flex-row gap-2">
                    {(['male', 'female', 'other'] as const).map((gender) => (
                      <Pressable
                        key={gender}
                        onPress={() => handleGenderSelect(gender)}
                        className={`h-[46px] flex-1 items-center justify-center rounded-xl border ${
                          signUpForm.formData.gender === gender
                            ? 'border-main bg-serve'
                            : formValidation.showFieldErrors &&
                                signUpForm.formData.gender.length === 0
                              ? 'border-statusError bg-white'
                              : 'border-borderGray bg-white'
                        }`}>
                        <Text
                          className={`text-p1 ${
                            signUpForm.formData.gender === gender ? 'text-main' : 'text-gray'
                          }`}>
                          {gender === 'male' ? '남성' : gender === 'female' ? '여성' : '기타'}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>

                <View
                  className="mb-4"
                  onLayout={formValidation.registerFieldPosition('country', 'profile')}>
                  <View className="mb-2 flex-row">
                    <Text className="font-pretendardSemiBold text-h3 text-black">국가 </Text>
                    <Text className="text-p1 text-statusError">*</Text>
                  </View>
                  <Pressable
                    ref={countryPicker.countryTriggerRef}
                    onPress={countryPicker.handleToggleCountryPicker}
                    className={`h-[46px] w-full flex-row items-center rounded-xl border bg-inputBackground px-3 ${
                      formValidation.showFieldErrors && signUpForm.formData.country.length === 0
                        ? 'border-statusError'
                        : 'border-borderGray'
                    }`}>
                    <Text
                      className={`flex-1 text-p1 ${
                        signUpForm.formData.country ? 'text-black' : 'text-gray'
                      }`}>
                      {signUpForm.formData.country || '국가 / 지역'}
                    </Text>
                    {countryPicker.showCountryPicker ? (
                      <UpDropdownIcon width={16} height={16} />
                    ) : (
                      <DownDropdownIcon width={16} height={16} />
                    )}
                  </Pressable>
                </View>
              </ContentContainer>
            </View>

            <View onLayout={formValidation.registerSectionY('email')}>
              <EmailSection
                formData={signUpForm.formData}
                isEmailVerified={emailVerification.isEmailVerified}
                emailErrorMessage={emailVerification.emailErrorMessage}
                isEmailSent={isEmailSent}
                isCodeError={isCodeError}
                isVerifyingCode={emailVerification.isVerifyingCode}
                isCodeFieldVisible={emailVerification.isCodeFieldVisible}
                canSendCode={canSendCode}
                sendCodeButtonText={sendCodeButtonText}
                showFieldErrors={formValidation.showFieldErrors}
                onChangeEmail={handleChangeEmail}
                onSendVerification={handleSendVerification}
                onVerifyCode={handleVerifyEmailCode}
                onChangeVerificationCode={handleChangeCode}
                onEmailLayout={formValidation.registerFieldPosition('email', 'email')}
              />
            </View>

            <TermsSection
              termsAgreement={signUpForm.termsAgreement}
              onTermsChange={signUpForm.handleTermsChange}
              onNavigatePrivacyPolicy={handleNavigatePrivacyPolicy}
              onNavigateMarketingConsent={handleNavigateMarketingConsent}
              onNavigateNightMarketing={handleNavigateNightMarketing}
            />

            {formValidation.showFieldErrors && !signUpForm.termsAgreement.serviceTerms ? (
              <Text className="mb-4 ml-1 mt-2 text-left text-p text-statusError">
                이용약관에 동의해주세요
              </Text>
            ) : null}

            <TouchableOpacity
              onPress={handleSignUp}
              className="mt-5 h-11 items-center justify-center rounded-lg bg-main">
              <Text className="font-pretendardSemiBold text-h3 text-white">가입하기</Text>
            </TouchableOpacity>
          </View>
          <Pressable onPress={handleNavigateLogin} className="mt-5">
            <Text className="text-center text-p text-gray">
              이미 계정이 있으신가요? <Text className="text-main">로그인</Text>
            </Text>
          </Pressable>
        </ScrollView>

        <CountryPickerModal
          visible={countryPicker.showCountryPicker}
          selectedCountry={signUpForm.formData.country}
          layout={countryPicker.countryDropdownLayout}
          onSelectCountry={handleCountrySelect}
          onDismiss={() => countryPicker.setShowCountryPicker(false)}
        />

        <BirthDatePickerModal
          visible={birthDatePicker.isBirthDatePickerVisible}
          tempYear={birthDatePicker.tempYear}
          tempMonth={birthDatePicker.tempMonth}
          tempDay={birthDatePicker.tempDay}
          onChangeYear={birthDatePicker.setTempYear}
          onChangeMonth={birthDatePicker.setTempMonth}
          onChangeDay={birthDatePicker.setTempDay}
          onConfirm={handleConfirmBirthDate}
          onCancel={birthDatePicker.closeBirthDatePicker}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

SignUpScreen.displayName = 'SignUpScreen';

export default SignUpScreen;
