import { useState, useCallback } from 'react';
import type { EmailStatus, CodeStatus } from '@/types/signup';
import { requestEmailVerification, verifyEmailCode } from '@/services';
import { showToastMessage, isValidEmail } from '@/utils';
import { handleError } from '@/utils/error';

export const useEmailVerification = () => {
  const [emailStatus, setEmailStatus] = useState<EmailStatus>('none');
  const [emailErrorMessage, setEmailErrorMessage] = useState<string>('');
  const [codeStatus, setCodeStatus] = useState<CodeStatus>('none');
  const [isCodeFieldVisible, setIsCodeFieldVisible] = useState<boolean>(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState<boolean>(false);
  const [isEmailVerified, setIsEmailVerified] = useState<boolean>(false);

  const handleChangeEmail = useCallback(() => {
    setEmailStatus('none');
    setEmailErrorMessage('');
    setCodeStatus('none');
    setIsCodeFieldVisible(false);
    setIsEmailVerified(false);
  }, []);

  const handleSendVerification = useCallback(async (email: string) => {
    const trimmedEmail = email.trim();

    // 이메일 유효성 검사
    if (!isValidEmail(trimmedEmail)) {
      setEmailStatus('none');
      setEmailErrorMessage('유효한 이메일을 입력해주세요');
      setIsCodeFieldVisible(false);
      setCodeStatus('none');
      setIsEmailVerified(false);
      showToastMessage('유효한 이메일을 입력해주세요');
      return;
    }

    try {
      await requestEmailVerification(trimmedEmail);
      setEmailErrorMessage('');
      setEmailStatus('sent');
      setIsCodeFieldVisible(true);
      setCodeStatus('none');
      setIsEmailVerified(false);
    } catch (error) {
      setEmailStatus('none');
      const rawMessage = handleError(error);
      const errMessage =
        rawMessage === '이미 존재하는 이메일입니다.'
          ? '이미 가입되어있는 이메일입니다.'
          : rawMessage;
      setEmailErrorMessage(errMessage);
      setIsCodeFieldVisible(false);
      setCodeStatus('none');
      setIsEmailVerified(false);
      showToastMessage(errMessage);
    }
  }, []);

  const handleVerifyEmailCode = useCallback(
    async (email: string, code: string): Promise<boolean> => {
      if (isVerifyingCode) {
        return false;
      }

      const trimmedEmail = email.trim();
      const trimmedCode = code.trim();

      if (trimmedCode.length !== 6) {
        setCodeStatus('error');
        setIsEmailVerified(false);
        return false;
      }

      setIsVerifyingCode(true);

      try {
        const data = await verifyEmailCode(trimmedEmail, trimmedCode);
        const isVerified = data.email_verified === 'Y';

        if (isVerified) {
          setCodeStatus('success');
          setIsEmailVerified(true);
          setIsCodeFieldVisible(false);
          return true;
        } else {
          setCodeStatus('error');
          setIsEmailVerified(false);
          return false;
        }
      } catch (error) {
        setCodeStatus('error');
        setIsEmailVerified(false);
        const errMessage = handleError(error);
        showToastMessage(errMessage);
        return false;
      } finally {
        setIsVerifyingCode(false);
      }
    },
    [isVerifyingCode],
  );

  return {
    emailStatus,
    emailErrorMessage,
    codeStatus,
    isCodeFieldVisible,
    isVerifyingCode,
    isEmailVerified,
    handleChangeEmail,
    handleSendVerification,
    handleVerifyEmailCode,
    setEmailStatus,
    setEmailErrorMessage,
    setCodeStatus,
    setIsCodeFieldVisible,
    setIsEmailVerified,
  };
};
