import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';

import { COLORS } from '@/constants';

// ============ Types ============
export interface CodeSectionProps {
  code: string;
  isCodeError: boolean;
  onChangeCode: (value: string) => void;
  onVerifyCode: () => void;
}

// ============ Component ============
export const CodeSection: React.FC<CodeSectionProps> = ({
  code,
  isCodeError,
  onChangeCode,
  onVerifyCode,
}) => {
  return (
    <View className="mt-4">
      <Text className="text-h3 font-semibold text-black">
        인증번호 <Text className="text-p1 text-statusError">*</Text>
      </Text>

      <View className="flex-row mt-2">
        <TextInput
          className={`flex-1 h-[46px] px-2 bg-inputBackground rounded-xl border text-p1 font-Regular text-black ${
            isCodeError ? 'border-statusError' : 'border-borderGray'
          }`}
          placeholder="6자리 인증번호"
          placeholderTextColor={COLORS.gray}
          value={code}
          onChangeText={onChangeCode}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="number-pad"
          maxLength={6}
          returnKeyType="done"
        />

        <TouchableOpacity
          className="w-[107px] h-[46px] ml-2 bg-white rounded-xl border border-borderGray items-center justify-center"
          onPress={onVerifyCode}
          accessibilityRole="button"
          accessibilityLabel="인증번호 확인">
          <Text className="text-p text-gray">확인</Text>
        </TouchableOpacity>
      </View>

      {isCodeError ? (
        <Text className="mt-2 text-p font-Regular text-statusError">
          인증번호가 올바르지 않습니다.
        </Text>
      ) : null}
    </View>
  );
};

CodeSection.displayName = 'CodeSection';

export default CodeSection;
