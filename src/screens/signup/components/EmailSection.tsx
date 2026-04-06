import React from 'react';
import { View, Text, Pressable, type LayoutChangeEvent } from 'react-native';

import { ContentContainer, LabeledInput } from '@/components/ui';
import type { SignUpFormData } from './signup.types';

interface EmailSectionProps {
  formData: SignUpFormData;
  isEmailVerified: boolean;
  isEmailError: boolean;
  isEmailSent: boolean;
  isCodeError: boolean;
  isCodeFieldVisible: boolean;
  canSendCode: boolean;
  sendCodeButtonText: string;
  showFieldErrors: boolean;
  onChangeEmail: (text: string) => void;
  onSendVerification: () => void;
  onVerifyCode: () => void;
  onChangeVerificationCode: (text: string) => void;
  onEmailLayout: (event: LayoutChangeEvent) => void;
}

export const EmailSection: React.FC<EmailSectionProps> = ({
  formData,
  isEmailVerified,
  isEmailError,
  isEmailSent,
  isCodeError,
  isCodeFieldVisible,
  canSendCode,
  sendCodeButtonText,
  showFieldErrors,
  onChangeEmail,
  onSendVerification,
  onVerifyCode,
  onChangeVerificationCode,
  onEmailLayout,
}) => {
  const isResend = sendCodeButtonText === '재전송';

  return (
    <View className="mt-5">
      <ContentContainer className="px-6 py-6">
        <Text className="mb-4 text-h3 font-pretendardSemiBold text-black">이메일 인증</Text>

        <View className="mb-2 flex-row items-end gap-2" onLayout={onEmailLayout}>
          <View className={`flex-1 ${isEmailVerified ? 'opacity-50' : ''}`}>
            <LabeledInput
              label="이메일"
              required={true}
              placeholder="example@gmail.com"
              value={formData.email}
              onChangeText={onChangeEmail}
              editable={!isEmailVerified}
              inputClassName={
                (showFieldErrors && formData.email.trim().length === 0) || isEmailError
                  ? 'border-statusError'
                  : isEmailSent || isEmailVerified
                  ? 'bg-emailBackground'
                  : ''
              }
              autoCapitalize="none"
              keyboardType="email-address"
              containerClassName=""
            />
          </View>
          <Pressable
            onPress={onSendVerification}
            disabled={!canSendCode || isEmailVerified}
            className={`h-[46px] items-center justify-center rounded-xl border border-borderGray bg-white ${
              isResend ? 'px-[38px]' : 'px-5'
            } ${isEmailVerified ? 'opacity-50' : ''}`}>
            <Text className="text-p text-gray">{sendCodeButtonText}</Text>
          </Pressable>
        </View>

        {isEmailVerified ? (
          <Text className="mt-2 mb-4 text-p text-statusSuccess">이메일 인증이 완료되었습니다</Text>
        ) : isEmailSent ? (
          <Text className="mt-2 mb-4 text-p text-statusSuccess">
            인증번호가 발송되었습니다. 이메일을 확인해주세요.
          </Text>
        ) : null}

        {isEmailError ? (
          <Text className="mt-2 mb-4 text-p text-statusError">올바른 이메일 형식을 입력해주세요.</Text>
        ) : null}

        {isCodeFieldVisible ? (
          <View>
            <View className="mb-2 flex-row items-end gap-2">
              <View className="flex-1">
                <LabeledInput
                  label="인증번호"
                  required={true}
                  placeholder="6자리 인증번호"
                  value={formData.verificationCode}
                  onChangeText={onChangeVerificationCode}
                  inputClassName={isCodeError ? 'border-statusError' : ''}
                  keyboardType="number-pad"
                  maxLength={6}
                  containerClassName=""
                />
              </View>

              <Pressable
                onPress={onVerifyCode}
                className="h-[46px] px-11 items-center justify-center rounded-xl border border-borderGray bg-white">
                <Text className="text-p text-gray">확인</Text>
              </Pressable>
            </View>

            {isCodeError ? (
              <Text className="mt-2 mb-4 text-p text-statusError">인증번호가 올바르지 않습니다.</Text>
            ) : null}
          </View>
        ) : null}
      </ContentContainer>
    </View>
  );
};
