import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';

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
  return (
    <View className="mt-4">
      <Text className="text-h3 font-semibold text-black">
        이메일 <Text className="text-p1 text-statusError">*</Text>
      </Text>

      <View className="flex-row mt-2">
        <TextInput
          className={`flex-1 h-[46px] px-2 bg-inputBackground rounded-xl border text-p1 font-Regular text-black ${
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
          className={`w-[107px] h-[46px] ml-2 shrink-0 rounded-xl border border-borderGray items-center justify-center bg-white`}
          onPress={onSendVerification}
          disabled={!canSendCode}
          accessibilityRole="button"
          accessibilityLabel="인증번호 발송">
          <Text className="text-p font-Regular text-gray">{sendCodeButtonText}</Text>
        </TouchableOpacity>
      </View>

      {isCodeVerified ? (
        <Text className="mt-2 text-p font-Regular text-statusSuccess">
          이메일 인증이 완료되었습니다
        </Text>
      ) : isEmailSent ? (
        <Text className="mt-2 text-p font-Regular text-statusSuccess">
          인증번호가 발송되었습니다. 이메일을 확인해주세요.
        </Text>
      ) : null}

      {isEmailError ? (
        <Text className="mt-2 text-p font-Regular text-statusError">
          가입된 이메일이 없습니다.
        </Text>
      ) : null}
    </View>
  );
};

EmailSection.displayName = 'EmailSection';

export default EmailSection;
