import React, { useState, useCallback, useMemo, useRef } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  useWindowDimensions,
  View,
  Text,
  TouchableOpacity,
  type LayoutChangeEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { TopBar } from '@/components';
import { COLORS } from '@/constants/colors';
import { ContentContainer, LabeledInput } from '@/components/ui';
import { DownDropdownIcon, UpDropdownIcon } from '@/assets';
import { AccountSection, EmailSection, TermsSection } from './components';
import type {
  CodeStatus,
  CountryDropdownLayout,
  EmailStatus,
  IdCheckStatus,
  RequiredFieldKey,
  SectionKey,
  SignUpFormData,
  SignUpScreenNavigationProp,
  SpinnerColumnProps,
  TermsAgreement,
  AccountFieldKey,
} from '@/types/signup';
import {
  checkDuplicateUserId,
  requestEmailVerification,
  verifyEmailCode,
  postSignUp,
} from '@/services';
import { showToastMessage } from '@/utils';
import { handleError } from '@/utils/error';

const COUNTRIES = [
  '대한민국',
  '미국',
  '일본',
  '중국',
  '영국',
  '프랑스',
  '독일',
  '캐나다',
  '호주',
] as const;

const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

// DatePicker Constants
const ITEM_HEIGHT = 44;
const VISIBLE_ITEMS = 5;
const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 100 }, (_, i) => CURRENT_YEAR - i);
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);
const COUNTRY_PICKER_MAX_HEIGHT = 274;

const pad = (n: number) => String(n).padStart(2, '0');
const getDaysInMonth = (year: number, month: number) => new Date(year, month, 0).getDate();

const SpinnerColumn: React.FC<SpinnerColumnProps> = ({
  items,
  selectedIndex,
  onSelect,
  format = (n) => String(n),
}) => {
  const scrollRef = useRef<ScrollView>(null);

  const handleScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetY = e.nativeEvent.contentOffset.y;
      const index = Math.round(offsetY / ITEM_HEIGHT);
      const clamped = Math.max(0, Math.min(index, items.length - 1));
      onSelect(clamped);
      scrollRef.current?.scrollTo({ y: clamped * ITEM_HEIGHT, animated: true });
    },
    [items.length, onSelect],
  );

  return (
    <View style={{ flex: 1, height: ITEM_HEIGHT * VISIBLE_ITEMS }}>
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: ITEM_HEIGHT * 2,
          left: 8,
          right: 8,
          height: 1,
          backgroundColor: COLORS.main,
          zIndex: 1,
        }}
      />
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: ITEM_HEIGHT * 3,
          left: 8,
          right: 8,
          height: 1,
          backgroundColor: COLORS.inputBackground,
          zIndex: 1,
        }}
      />
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        contentOffset={{ x: 0, y: selectedIndex * ITEM_HEIGHT }}
        contentContainerStyle={{
          paddingTop: ITEM_HEIGHT * 2,
          paddingBottom: ITEM_HEIGHT * 2,
        }}
        onMomentumScrollEnd={handleScrollEnd}
        onScrollEndDrag={handleScrollEnd}>
        {items.map((item, idx) => {
          const isSelected = idx === selectedIndex;

          return (
            <View
              key={item}
              style={{
                height: ITEM_HEIGHT,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: isSelected ? '600' : '400',
                  color: isSelected ? COLORS.black : COLORS.gray,
                }}>
                {format(item)}
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

// ============ Component ============
const SignUpScreen: React.FC = () => {
  const navigation = useNavigation<SignUpScreenNavigationProp>();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

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
    nightMarketingConsent: false,
  });

  const [showCountryPicker, setShowCountryPicker] = useState<boolean>(false);
  const [idCheckStatus, setIdCheckStatus] = useState<IdCheckStatus>('idle');
  const [emailStatus, setEmailStatus] = useState<EmailStatus>('none');
  const [emailErrorMessage, setEmailErrorMessage] = useState<string>('');
  const [codeStatus, setCodeStatus] = useState<CodeStatus>('none');
  const [isCodeFieldVisible, setIsCodeFieldVisible] = useState<boolean>(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState<boolean>(false);
  const [isEmailVerified, setIsEmailVerified] = useState<boolean>(false);
  const [showFieldErrors, setShowFieldErrors] = useState<boolean>(false);
  const [dismissedAccountFieldErrors, setDismissedAccountFieldErrors] = useState<
    Partial<Record<AccountFieldKey, boolean>>
  >({});
  const [showTermsError, setShowTermsError] = useState<boolean>(false);
  const [isBirthDatePickerVisible, setIsBirthDatePickerVisible] = useState<boolean>(false);
  const [tempYear, setTempYear] = useState<number>(new Date().getFullYear());
  const [tempMonth, setTempMonth] = useState<number>(new Date().getMonth() + 1);
  const [tempDay, setTempDay] = useState<number>(new Date().getDate());
  const [countryDropdownLayout, setCountryDropdownLayout] = useState<CountryDropdownLayout>({
    left: 16,
    top: 0,
    width: 0,
    maxHeight: COUNTRY_PICKER_MAX_HEIGHT,
  });
  const scrollViewRef = useRef<ScrollView | null>(null);
  const countryTriggerRef = useRef<View | null>(null);
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
  const isEmailError = emailErrorMessage.length > 0;
  const isCodeError = codeStatus === 'error';
  const canSendCode = formData.email.trim().length > 0;
  const sendCodeButtonText = isCodeFieldVisible || isEmailVerified ? '재전송' : '인증번호 발송';

  const days = useMemo(
    () => Array.from({ length: getDaysInMonth(tempYear, tempMonth) }, (_, i) => i + 1),
    [tempYear, tempMonth],
  );

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
  } else if (idCheckStatus === 'error') {
    idMessage = '아이디 중복 확인 중 오류가 발생했습니다. 다시 시도해주세요.';
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
    if (formData.email.trim().length === 0 || !isEmailVerified) return 'email';
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
    isEmailVerified,
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
    setEmailErrorMessage('');
    setCodeStatus('none');
    setIsCodeFieldVisible(false);
    setIsEmailVerified(false);
  }, []);

  const handleSendVerification = useCallback(async () => {
    const trimmedEmail = formData.email.trim();

    try {
      await requestEmailVerification(trimmedEmail);
      setEmailErrorMessage('');
      setEmailStatus('sent');
      setIsCodeFieldVisible(true);
      setCodeStatus('none');
      setIsEmailVerified(false);
      setFormData((prev) => ({
        ...prev,
        verificationCode: '',
      }));
    } catch (error) {
      setEmailStatus('none');
      const errMessage = handleError(error);
      setEmailErrorMessage(errMessage);
      setIsCodeFieldVisible(false);
      setCodeStatus('none');
      setIsEmailVerified(false);
      showToastMessage(errMessage);
    }
  }, [formData.email]);

  const handleVerifyEmailCode = useCallback(async () => {
    if (isVerifyingCode) {
      return;
    }

    const trimmedEmail = formData.email.trim();
    const trimmedCode = formData.verificationCode.trim();

    if (trimmedCode.length !== 6) {
      setCodeStatus('error');
      setIsEmailVerified(false);
      return;
    }

    setIsVerifyingCode(true);

    try {
      const data = await verifyEmailCode(trimmedEmail, trimmedCode);
      const isVerified = data.email_verified === 'Y';

      if (isVerified) {
        setCodeStatus('success');
        setIsEmailVerified(true);
        setIsCodeFieldVisible(false);
      } else {
        setCodeStatus('error');
        setIsEmailVerified(false);
      }
    } catch (error) {
      setCodeStatus('error');
      setIsEmailVerified(false);
      const errMessage = handleError(error);
      showToastMessage(errMessage);
    } finally {
      setIsVerifyingCode(false);
    }
  }, [formData.email, formData.verificationCode, isVerifyingCode]);

  const handleCheckId = useCallback(async () => {
    const normalizedAccountId = formData.accountId.trim();
    setDismissedAccountFieldErrors((prev) => ({ ...prev, accountId: false }));

    if (normalizedAccountId.length === 0) {
      setIdCheckStatus('idle');
      return;
    }

    try {
      const isDuplicate = await checkDuplicateUserId(normalizedAccountId);
      setIdCheckStatus(isDuplicate ? 'duplicate' : 'available');
    } catch (error) {
      setIdCheckStatus('error');
      const errMessage = handleError(error);
      showToastMessage(errMessage);
    }
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

  const handleTermsChange = useCallback(
    (field: keyof TermsAgreement, value: boolean) => {
      let nextServiceTerms = termsAgreement.serviceTerms;

      if (field === 'allTerms') {
        nextServiceTerms = value;
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
          nextServiceTerms = updatedTerms.serviceTerms;
          const allTermsChecked =
            updatedTerms.serviceTerms &&
            updatedTerms.privacyPolicy &&
            updatedTerms.marketingConsent &&
            updatedTerms.nightMarketingConsent;
          return {
            ...updatedTerms,
            allTerms: allTermsChecked,
          };
        });
      }

      if (nextServiceTerms) {
        setShowTermsError(false);
      }
    },
    [termsAgreement.serviceTerms],
  );

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

  const openBirthDatePicker = useCallback(() => {
    const parsed = /^(\d{4})-(\d{2})-(\d{2})$/.exec(formData.birthDate.trim());
    const now = new Date();

    if (parsed) {
      const parsedYear = Math.min(Number(parsed[1]), CURRENT_YEAR);
      const parsedMonth = Number(parsed[2]);
      const parsedDay = Number(parsed[3]);

      setTempYear(parsedYear);
      setTempMonth(parsedMonth);
      setTempDay(Math.min(parsedDay, getDaysInMonth(parsedYear, parsedMonth)));
    } else {
      setTempYear(now.getFullYear());
      setTempMonth(now.getMonth() + 1);
      setTempDay(now.getDate());
    }

    setIsBirthDatePickerVisible(true);
  }, [formData.birthDate]);

  const handleConfirmBirthDate = useCallback(() => {
    const clampedDay = Math.min(tempDay, getDaysInMonth(tempYear, tempMonth));
    const nextBirthDate = `${tempYear}-${pad(tempMonth)}-${pad(clampedDay)}`;

    setFormData((prev) => ({
      ...prev,
      birthDate: nextBirthDate,
    }));
    setIsBirthDatePickerVisible(false);
  }, [tempDay, tempMonth, tempYear]);

  const handleChangeCode = useCallback(
    (text: string) => handleFormChange('verificationCode', text),
    [handleFormChange],
  );

  const openCountryPicker = useCallback(() => {
    countryTriggerRef.current?.measureInWindow((x, y, width, height) => {
      const horizontalMargin = 16;
      const left = Math.max(horizontalMargin, Math.min(x, windowWidth - horizontalMargin - width));
      const top = y + height + 7;
      const availableHeight = Math.max(140, windowHeight - top - 16);

      setCountryDropdownLayout({
        left,
        top,
        width,
        maxHeight: Math.min(COUNTRY_PICKER_MAX_HEIGHT, availableHeight),
      });
      setShowCountryPicker(true);
    });
  }, [windowHeight, windowWidth]);

  const handleToggleCountryPicker = useCallback(() => {
    if (showCountryPicker) {
      setShowCountryPicker(false);
      return;
    }

    requestAnimationFrame(() => {
      openCountryPicker();
    });
  }, [openCountryPicker, showCountryPicker]);

  const handleSignUp = useCallback(async () => {
    const firstInvalidField = getFirstInvalidField();
    const isTermsAccepted = termsAgreement.serviceTerms;

    setShowTermsError(!isTermsAccepted);

    if (firstInvalidField) {
      setShowFieldErrors(true);
      setDismissedAccountFieldErrors({});
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
    } else {
      const errorMessage = result.message || '회원가입 실패';
      showToastMessage(errorMessage);
    }
  }, [getFirstInvalidField, navigation, termsAgreement, formData]);

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
          scrollEnabled={!showCountryPicker}
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

          <View onLayout={registerSectionY('profile')} className="mt-5">
            <ContentContainer className="px-6 py-6">
              <Text className="mb-4 font-pretendardSemiBold text-h3 text-black">개인 정보</Text>

              <View onLayout={registerFieldPosition('name', 'profile')}>
                <LabeledInput
                  label="이름"
                  required={true}
                  placeholder="이름을 입력하세요"
                  value={formData.name}
                  onChangeText={handleChangeName}
                  inputClassName={
                    showFieldErrors && formData.name.trim().length === 0 ? 'border-statusError' : ''
                  }
                  containerClassName="mb-4"
                />
              </View>

              <View onLayout={registerFieldPosition('birthDate', 'profile')}>
                <View className="mb-4">
                  <View className="mb-2 flex-row">
                    <Text className="font-pretendardSemiBold text-h3 text-black">생년월일 </Text>
                    <Text className="text-p1 text-statusError">*</Text>
                  </View>
                  <Pressable
                    onPress={openBirthDatePicker}
                    className={`h-[46px] w-full flex-row items-center rounded-xl border bg-inputBackground px-3 ${
                      showFieldErrors && formData.birthDate.trim().length === 0
                        ? 'border-statusError'
                        : 'border-borderGray'
                    }`}>
                    <Text
                      className={`flex-1 text-p1 ${formData.birthDate ? 'text-black' : 'text-gray'}`}>
                      {formData.birthDate || '생년월일을 선택해주세요'}
                    </Text>
                    <DownDropdownIcon width={16} height={16} />
                  </Pressable>
                </View>
              </View>

              <View className="mb-4" onLayout={registerFieldPosition('gender', 'profile')}>
                <View className="mb-2 flex-row">
                  <Text className="text-h3 text-black">성별 </Text>
                  <Text className="text-p1 text-statusError">*</Text>
                </View>
                <View className="flex-row gap-2">
                  <Pressable
                    onPress={() => handleGenderSelect('male')}
                    className={`h-[46px] flex-1 items-center justify-center rounded-xl border ${
                      formData.gender === 'male'
                        ? 'border-main bg-serve'
                        : showFieldErrors && formData.gender.length === 0
                          ? 'border-statusError bg-white'
                          : 'border-borderGray bg-white'
                    }`}>
                    <Text
                      className={`text-p1 ${formData.gender === 'male' ? 'text-main' : 'text-gray'}`}>
                      남성
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => handleGenderSelect('female')}
                    className={`h-[46px] flex-1 items-center justify-center rounded-xl border ${
                      formData.gender === 'female'
                        ? 'border-main bg-serve'
                        : showFieldErrors && formData.gender.length === 0
                          ? 'border-statusError bg-white'
                          : 'border-borderGray bg-white'
                    }`}>
                    <Text
                      className={`text-p1 ${formData.gender === 'female' ? 'text-main' : 'text-gray'}`}>
                      여성
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => handleGenderSelect('other')}
                    className={`h-[46px] flex-1 items-center justify-center rounded-xl border ${
                      formData.gender === 'other'
                        ? 'border-main bg-serve'
                        : showFieldErrors && formData.gender.length === 0
                          ? 'border-statusError bg-white'
                          : 'border-borderGray bg-white'
                    }`}>
                    <Text
                      className={`text-p1 ${formData.gender === 'other' ? 'text-main' : 'text-gray'}`}>
                      기타
                    </Text>
                  </Pressable>
                </View>
              </View>

              <View className="mb-4" onLayout={registerFieldPosition('country', 'profile')}>
                <View className="mb-2 flex-row">
                  <Text className="font-pretendardSemiBold text-h3 text-black">국가 </Text>
                  <Text className="text-p1 text-statusError">*</Text>
                </View>
                <View ref={countryTriggerRef} collapsable={false}>
                  <Pressable
                    onPress={handleToggleCountryPicker}
                    className={`h-[46px] w-full flex-row items-center rounded-xl border bg-inputBackground px-3 ${
                      showFieldErrors && formData.country.length === 0
                        ? 'border-statusError'
                        : 'border-borderGray'
                    }`}>
                    <Text
                      className={`flex-1 text-p1 ${formData.country ? 'text-black' : 'text-gray'}`}>
                      {formData.country || '국가 / 지역'}
                    </Text>
                    {showCountryPicker ? (
                      <UpDropdownIcon width={16} height={16} />
                    ) : (
                      <DownDropdownIcon width={16} height={16} />
                    )}
                  </Pressable>
                </View>
              </View>
            </ContentContainer>
          </View>

          <View onLayout={registerSectionY('email')}>
            <EmailSection
              formData={formData}
              isEmailVerified={isEmailVerified}
              emailErrorMessage={emailErrorMessage}
              isEmailSent={isEmailSent}
              isCodeError={isCodeError}
              isVerifyingCode={isVerifyingCode}
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
            <Text className="mb-4 ml-1 mt-2 text-left text-p text-statusError">
              이용약관에 동의해주세요
            </Text>
          ) : null}

          {/* 회원가입 버튼 */}
          <TouchableOpacity
            onPress={handleSignUp}
            className="mt-5 h-11 items-center justify-center rounded-lg bg-main">
            <Text className="font-pretendardSemiBold text-h3 text-white">가입하기</Text>
          </TouchableOpacity>

          <Pressable onPress={() => navigation.navigate('Login')} className="mt-5">
            <Text className="text-center text-p text-gray">
              이미 계정이 있으신가요? <Text className="text-main">로그인</Text>
            </Text>
          </Pressable>
        </ScrollView>

        <Modal
          visible={showCountryPicker}
          transparent
          animationType="fade"
          onRequestClose={() => setShowCountryPicker(false)}>
          <View style={{ flex: 1 }}>
            <Pressable
              style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}
              onPress={() => setShowCountryPicker(false)}
            />

            <View
              pointerEvents="box-none"
              style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}>
              <View
                className="rounded-xl border border-borderGray bg-white"
                style={{
                  position: 'absolute',
                  left: countryDropdownLayout.left,
                  top: countryDropdownLayout.top,
                  width: countryDropdownLayout.width,
                  maxHeight: countryDropdownLayout.maxHeight,
                }}>
                <ScrollView
                  showsVerticalScrollIndicator
                  scrollEnabled={true}
                  contentContainerStyle={{ paddingVertical: 6 }}>
                  {COUNTRIES.map((country, index) => {
                    const isSelectedCountry = formData.country === country;
                    const isLastItem = index === COUNTRIES.length - 1;
                    const countryItemClassName = [
                      'mx-[6px] rounded-lg px-3 py-[9px]',
                      isLastItem ? '' : 'mb-1',
                      isSelectedCountry ? 'bg-statusSuccess' : 'bg-white',
                    ]
                      .filter(Boolean)
                      .join(' ');

                    return (
                      <Pressable
                        key={country}
                        onPress={() => handleCountrySelect(country)}
                        accessibilityRole="button"
                        accessibilityState={{ selected: isSelectedCountry }}
                        className={countryItemClassName}>
                        <Text
                          className={`text-p ${isSelectedCountry ? 'text-white' : 'text-black'}`}>
                          {country}
                        </Text>
                      </Pressable>
                    );
                  })}
                </ScrollView>
              </View>
            </View>
          </View>
        </Modal>

        <Modal
          visible={isBirthDatePickerVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setIsBirthDatePickerVisible(false)}
          statusBarTranslucent>
          <View style={{ flex: 1, justifyContent: 'flex-end' }}>
            <Pressable
              style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' }}
              onPress={() => setIsBirthDatePickerVisible(false)}
            />

            <View className="rounded-t-[16px] bg-white px-6 pb-10 pt-4">
              <View className="mb-4 flex-row items-center justify-between">
                <TouchableOpacity onPress={() => setIsBirthDatePickerVisible(false)}>
                  <Text className="text-p1 text-gray">취소</Text>
                </TouchableOpacity>

                <Text className="font-pretendardSemiBold text-h3 text-black">생년월일 선택</Text>

                <TouchableOpacity onPress={handleConfirmBirthDate}>
                  <Text className="font-pretendardSemiBold text-p1 text-main">완료</Text>
                </TouchableOpacity>
              </View>

              <View style={{ flexDirection: 'row', height: ITEM_HEIGHT * VISIBLE_ITEMS }}>
                <SpinnerColumn
                  items={YEARS}
                  selectedIndex={Math.max(0, YEARS.indexOf(tempYear))}
                  onSelect={(index) => setTempYear(YEARS[index])}
                  format={(n) => `${n}년`}
                />
                <SpinnerColumn
                  items={MONTHS}
                  selectedIndex={Math.max(0, MONTHS.indexOf(tempMonth))}
                  onSelect={(index) => setTempMonth(MONTHS[index])}
                  format={(n) => `${pad(n)}월`}
                />
                <SpinnerColumn
                  items={days}
                  selectedIndex={Math.min(
                    days.indexOf(tempDay) >= 0 ? days.indexOf(tempDay) : 0,
                    days.length - 1,
                  )}
                  onSelect={(index) => setTempDay(days[index])}
                  format={(n) => `${pad(n)}일`}
                />
              </View>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

SignUpScreen.displayName = 'SignUpScreen';

export default SignUpScreen;
