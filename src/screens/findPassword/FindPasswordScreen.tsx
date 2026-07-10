import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import { TopBar, LabeledInput } from '@/components/ui';
import {
  postFindPasswordEmailRequest,
  postFindPasswordEmailVerify,
  postFindPasswordReset,
} from '@/services';
import type {
  CodeStatus,
  EmailStatus,
  FindPasswordScreenNavigationProp,
  TempPasswordStatus,
} from '@/types/findPassword';
import { EmailSection, CodeSection, ResultCard } from '@/screens/findPassword/components';
import { showToastMessage, EMAIL_REGEX } from '@/utils';

// ============ Constants ============
const FindPasswordScreen: React.FC = () => {
  const navigation = useNavigation<FindPasswordScreenNavigationProp>();
  const [userId, setUserId] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const [emailStatus, setEmailStatus] = useState<EmailStatus>('none');
  const [codeStatus, setCodeStatus] = useState<CodeStatus>('none');
  const [tempPwStatus, setTempPwStatus] = useState<TempPasswordStatus>('none');
  const [isCodeFieldVisible, setIsCodeFieldVisible] = useState<boolean>(false);
  const [isSendingVerification, setIsSendingVerification] = useState<boolean>(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState<boolean>(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState<string>('');

  const canSendCode = useMemo(
    () => userId.trim().length > 0 && email.trim().length > 0 && !isSendingVerification,
    [userId, email, isSendingVerification],
  );
  const isEmailSent = useMemo(() => emailStatus === 'sent', [emailStatus]);
  const isEmailError = useMemo(() => emailStatus === 'error', [emailStatus]);
  const isCodeError = useMemo(() => codeStatus === 'error', [codeStatus]);
  const isCodeVerified = useMemo(() => codeStatus === 'success', [codeStatus]);
  const isTempPwSent = useMemo(() => tempPwStatus === 'sent', [tempPwStatus]);
  const sendCodeButtonText = useMemo(
    () =>
      isSendingVerification
        ? '발송 중...'
        : isCodeFieldVisible || isCodeVerified || isEmailError
          ? '재전송'
          : '인증번호 발송',
    [isSendingVerification, isCodeFieldVisible, isCodeVerified, isEmailError],
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
    setEmailErrorMessage('');
    setCodeStatus('none');
    setTempPwStatus('none');
  }, []);

  const handleChangeUserId = useCallback((value: string) => {
    setUserId(value);
    setEmailStatus('none');
    setEmailErrorMessage('');
    setCodeStatus('none');
    setTempPwStatus('none');
  }, []);

  const handleSendVerification = useCallback(async () => {
    if (isSendingVerification) {
      return;
    }

    const trimmedUserId = userId.trim();
    const trimmedEmail = email.trim();
    if (!trimmedUserId) {
      setEmailStatus('error');
      setEmailErrorMessage('아이디를 입력해주세요.');
      setIsCodeFieldVisible(false);
      setCodeStatus('none');
      return;
    }

    const isEmailFormatValid = EMAIL_REGEX.test(trimmedEmail);

    if (!isEmailFormatValid) {
      setEmailStatus('error');
      setEmailErrorMessage('유효한 이메일 형식이 아닙니다.');
      setIsCodeFieldVisible(false);
      setCodeStatus('none');
      return;
    }

    setIsSendingVerification(true);

    const result = await postFindPasswordEmailRequest({
      usersId: trimmedUserId,
      email: trimmedEmail,
    });

    if (result.ok) {
      setEmailStatus('sent');
      setEmailErrorMessage('');
      setIsCodeFieldVisible(true);
      setCodeStatus('none');
      setCode('');
      setTempPwStatus('none');
    } else {
      const errorMessage =
        result.code === 'USER_NOT_FOUND'
          ? '아이디 또는 이메일을 확인해주세요.'
          : result.code === 'INVALID_INPUT'
            ? '소셜 로그인 계정은 비밀번호 찾기를 이용하실 수 없습니다.'
            : result.message || '인증번호 발송에 실패했습니다.';
      setEmailStatus('error');
      setEmailErrorMessage(errorMessage);
      setIsCodeFieldVisible(false);
      setCodeStatus('none');
      showToastMessage(errorMessage);
    }

    setIsSendingVerification(false);
  }, [email, isSendingVerification, userId]);

  const handleChangeCode = useCallback((value: string) => {
    setCode(value);
    setCodeStatus('none');
    setTempPwStatus('none');
  }, []);

  const handleVerifyCode = useCallback(async () => {
    if (isVerifyingCode) {
      return;
    }

    const trimmedUserId = userId.trim();
    const trimmedEmail = email.trim();
    const trimmedCode = code.trim();

    if (!trimmedUserId || !trimmedEmail) {
      setCodeStatus('error');
      showToastMessage('아이디와 이메일을 먼저 입력해주세요.');
      return;
    }

    if (trimmedCode.length !== 6) {
      setCodeStatus('error');
      showToastMessage('6자리 인증번호를 입력해주세요.');
      return;
    }

    setIsVerifyingCode(true);

    const result = await postFindPasswordEmailVerify({
      usersId: trimmedUserId,
      email: trimmedEmail,
      code: trimmedCode,
    });

    if (result.ok) {
      setCodeStatus('success');
      setIsCodeFieldVisible(false);
    } else {
      setCodeStatus('error');
      showToastMessage(result.message || '인증번호 확인에 실패했습니다.');
    }

    setIsVerifyingCode(false);
  }, [code, email, isVerifyingCode, userId]);

  const handleSendTemporaryPassword = useCallback(async () => {
    const trimmedUserId = userId.trim();
    const trimmedEmail = email.trim();

    if (!trimmedUserId || !trimmedEmail) {
      showToastMessage('아이디와 이메일을 확인해주세요.');
      return;
    }

    const result = await postFindPasswordReset({
      usersId: trimmedUserId,
      email: trimmedEmail,
    });

    if (result.ok) {
      setTempPwStatus('sent');
    } else {
      showToastMessage(result.message || '임시 비밀번호 전송에 실패했습니다.');
    }
  }, [email, userId]);

  const handleNavigateToLogin = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <SafeAreaView className="flex-1 bg-screenBackground" edges={['top']}>
      <KeyboardAvoidingView className="flex-1">
        <View className="flex-1">
          <TopBar title="비밀번호 찾기" onPress={handleGoBack} />
          <View className="flex-1 px-4">
            <View className="mt-6 rounded-lg border border-borderGray bg-white px-6 py-6">
              <Text className="mb-4 font-pretendardRegular text-p text-gray">
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
                emailErrorMessage={emailErrorMessage}
                isCodeVerified={isCodeVerified}
                onChangeEmail={handleChangeEmail}
                onSendVerification={handleSendVerification}
              />

              {isCodeFieldVisible ? (
                <CodeSection
                  code={code}
                  isCodeError={isCodeError}
                  isVerifyingCode={isVerifyingCode}
                  onChangeCode={handleChangeCode}
                  onVerifyCode={handleVerifyCode}
                />
              ) : null}

              <TouchableOpacity
                className={`mt-4 h-11 w-full items-center justify-center rounded-lg ${
                  isSubmitEnabled ? 'bg-main' : 'bg-main/50'
                }`}
                onPress={handleSendTemporaryPassword}
                disabled={!isSubmitEnabled}
                accessibilityRole="button"
                accessibilityLabel="임시 비밀번호 전송">
                <Text className="font-pretendardSemiBold text-h3 text-white">
                  임시 비밀번호 전송
                </Text>
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
