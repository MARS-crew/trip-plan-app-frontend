import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import { LabeledInput } from '@/components/ui';
import { COLORS } from '@/constants';

// ============ Types ============
export interface EmailSectionProps {
  email: string;
  canSendCode: boolean;
  sendCodeButtonText: string;
  isEmailSent: boolean;
  isEmailError: boolean;
  isCodeVerified: boolean;
  onChangeEmail: (value: string) => void;
  onSendVerification: () => void;
}

// ============ Component ============
export const EmailSection: React.FC<EmailSectionProps> = ({
  email,
  canSendCode,
  sendCodeButtonText,
  isEmailSent,
  isEmailError,
  isCodeVerified,
  onChangeEmail,
  onSendVerification,
}) => {
  const isResend = sendCodeButtonText === '재전송';

  return (
    <View>
      <View className="flex-row items-end">
        <LabeledInput
          label="이메일"
          containerClassName="flex-1 mb-0"
          className={`h-[46px] px-2 rounded-xl border text-p1 font-pretendardRegular text-black ${
            isEmailError
              ? 'bg-inputBackground border-statusError'
              : isEmailSent
                ? 'bg-emailBackground border-borderGray'
                : 'bg-screenBackground border-borderGray'
          }`}
          placeholder="example@gmail.com"
          placeholderTextColor={COLORS.gray}
          value={email}
          onChangeText={onChangeEmail}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          returnKeyType="done"
        />

        <TouchableOpacity
          className={`h-[46px] ml-2 shrink-0 items-center justify-center rounded-xl border border-borderGray bg-white ${
            isResend ? 'px-[38px]' : 'px-5'
          }`}
          onPress={onSendVerification}
          disabled={!canSendCode}
          accessibilityRole="button"
          accessibilityLabel="인증번호 발송">
          <Text className="text-p font-pretendardRegular text-gray">{sendCodeButtonText}</Text>
        </TouchableOpacity>
      </View>

      {isCodeVerified ? (
        <Text className="mt-2 text-p font-pretendardRegular text-statusSuccess">
          이메일 인증이 완료되었습니다
        </Text>
      ) : isEmailSent ? (
        <Text className="mt-2 text-p font-pretendardRegular text-statusSuccess">
          인증번호가 발송되었습니다. 이메일을 확인해주세요.
        </Text>
      ) : null}

      {isEmailError ? (
        <Text className="mt-2 text-p font-pretendardRegular text-statusError">
          가입된 이메일이 없습니다.
        </Text>
      ) : null}
    </View>
  );
};

EmailSection.displayName = 'EmailSection';

export default EmailSection;
