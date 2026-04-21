import React from 'react';
import { View, Text, Pressable, type LayoutChangeEvent } from 'react-native';

import { ContentContainer, LabeledInput } from '@/components/ui';
import type { EmailSectionProps } from '@/types/signupEmail';

export const EmailSection: React.FC<EmailSectionProps> = ({
  formData,
  isEmailVerified,
  emailErrorMessage,
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
        <Text className="mb-4 font-pretendardSemiBold text-h3 text-black">이메일 인증</Text>

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
                (showFieldErrors && formData.email.trim().length === 0) ||
                emailErrorMessage.length > 0
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
          <Text className="mb-4 mt-2 text-p text-statusSuccess">이메일 인증이 완료되었습니다</Text>
        ) : isEmailSent ? (
          <Text className="mb-4 mt-2 text-p text-statusSuccess">
            인증번호가 발송되었습니다. 이메일을 확인해주세요.
          </Text>
        ) : null}

        {emailErrorMessage ? (
          <Text className="mb-4 mt-2 text-p text-statusError">{emailErrorMessage}</Text>
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
                className="h-[46px] items-center justify-center rounded-xl border border-borderGray bg-white px-11">
                <Text className="text-p text-gray">확인</Text>
              </Pressable>
            </View>

            {isCodeError ? (
              <Text className="mb-4 mt-2 text-p text-statusError">
                인증번호가 올바르지 않습니다.
              </Text>
            ) : null}
          </View>
        ) : null}
      </ContentContainer>
    </View>
  );
};
