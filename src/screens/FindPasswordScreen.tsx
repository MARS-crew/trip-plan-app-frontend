import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { TopBar, LabeledInput } from '@/components/ui';
import type { RootStackParamList } from '@/navigation';
import {
  EmailSection,
  CodeSection,
  ResultCard,
} from '@/screens/findPassword/components';
import type { EmailStatus, CodeStatus, TempPasswordStatus } from '@/screens/findPassword/types';

// ============ Types ============
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// ============ Constants ============
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TEMP_VERIFICATION_CODE = '123456';

// ============ Component ============
const FindPasswordScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [userId, setUserId] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const [emailStatus, setEmailStatus] = useState<EmailStatus>('none');
  const [codeStatus, setCodeStatus] = useState<CodeStatus>('none');
  const [tempPwStatus, setTempPwStatus] = useState<TempPasswordStatus>('none');
  const [isCodeFieldVisible, setIsCodeFieldVisible] = useState<boolean>(false);

  const canSendCode = useMemo(() => email.trim().length > 0, [email]);
  const isEmailSent = useMemo(() => emailStatus === 'sent', [emailStatus]);
  const isEmailError = useMemo(() => emailStatus === 'error', [emailStatus]);
  const isCodeError = useMemo(() => codeStatus === 'error', [codeStatus]);
  const isCodeVerified = useMemo(() => codeStatus === 'success', [codeStatus]);
  const isTempPwSent = useMemo(() => tempPwStatus === 'sent', [tempPwStatus]);
  const sendCodeButtonText = useMemo(
    () => (isCodeFieldVisible || isCodeVerified ? '재전송' : '인증번호 발송'),
    [isCodeFieldVisible, isCodeVerified],
  );
  const isSubmitEnabled = useMemo(
    () => userId.trim().length > 0 && email.trim().length > 0 && isCodeVerified,
    [userId, email, isCodeVerified],
  );

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleChangeEmail = useCallback((value: string) => {
    setEmail(value);
    setEmailStatus('none');
    setCodeStatus('none');
    setTempPwStatus('none');
  }, []);

  const handleChangeUserId = useCallback((value: string) => {
    setUserId(value);
    setTempPwStatus('none');
  }, []);

  const handleSendVerification = useCallback(() => {
    const trimmedEmail = email.trim();
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
    setCode('');
    setTempPwStatus('none');
  }, [email]);

  const handleChangeCode = useCallback((value: string) => {
    setCode(value);
    setCodeStatus('none');
    setTempPwStatus('none');
  }, []);

  const handleVerifyCode = useCallback(() => {
    // 임시 인증번호(TEMP_VERIFICATION_CODE)만 성공 처리
    const isVerified = code.trim().length === 6 && code.trim() === TEMP_VERIFICATION_CODE;
    setCodeStatus(isVerified ? 'success' : 'error');
    if (isVerified) {
      setIsCodeFieldVisible(false);
    }
  }, [code]);

  const handleSendTemporaryPassword = useCallback(() => {
    setTempPwStatus('sent');
  }, []);

  const handleNavigateToLogin = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <SafeAreaView className="flex-1 bg-screenBackground" edges={['top']}>
      <KeyboardAvoidingView className="flex-1">
        <View className="flex-1"> 
            <TopBar title="비밀번호 찾기" onPress={handleGoBack} />
            <View className="flex-1 px-4">
            <View className="mt-6 px-6 py-6 bg-white rounded-lg border border-borderGray">
              <Text className="mb-4 text-p font-Regular text-gray ">
                아이디와 가입 시 등록한 이메일을 입력하면 이메일로 임시 비밀번호를 전송해드립니다.
              </Text>

              <LabeledInput
                label="아이디"
                value={userId}
                onChangeText={handleChangeUserId}
                placeholder="아이디를 입력해주세요"
                autoCorrect={false}
                returnKeyType="next"
              />

              <EmailSection
                email={email}
                canSendCode={canSendCode}
                sendCodeButtonText={sendCodeButtonText}
                isEmailSent={isEmailSent}
                isEmailError={isEmailError}
                isCodeVerified={isCodeVerified}
                onChangeEmail={handleChangeEmail}
                onSendVerification={handleSendVerification}
              />

              {isCodeFieldVisible ? (
                <CodeSection
                  code={code}
                  isCodeError={isCodeError}
                  onChangeCode={handleChangeCode}
                  onVerifyCode={handleVerifyCode}
                />
              ) : null}

              <TouchableOpacity
                className={`w-full h-11 mt-4 rounded-lg items-center justify-center ${
                  isSubmitEnabled ? 'bg-main' : 'bg-main/50'
                }`}
                onPress={handleSendTemporaryPassword}
                disabled={!isSubmitEnabled}
                accessibilityRole="button"
                accessibilityLabel="임시 비밀번호 전송">
                <Text className="text-h3 font-semibold text-white">임시 비밀번호 전송</Text>
              </TouchableOpacity>

              {isTempPwSent ? (
                <ResultCard email={email} onPressLogin={handleNavigateToLogin} />
              ) : null}
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

FindPasswordScreen.displayName = 'FindPasswordScreen';

export default FindPasswordScreen;
export { FindPasswordScreen };
