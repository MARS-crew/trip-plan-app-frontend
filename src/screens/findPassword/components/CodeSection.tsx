import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import { LabeledInput } from '@/components/ui';
import { COLORS } from '@/constants';
import type { FindPasswordCodeSectionProps } from '@/types/findPasswordCodeSection';

// ============ Component ============
export const CodeSection: React.FC<FindPasswordCodeSectionProps> = ({
  code,
  isCodeError,
  onChangeCode,
  onVerifyCode,
}) => {
  return (
    <View className="mt-4">
      <View className="flex-row items-end">
        <LabeledInput
          label="인증번호"
          containerClassName="flex-1 mb-0"
          className={`h-[46px] rounded-xl border px-2 font-pretendardRegular text-p1 text-black ${
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
          className="ml-2 h-[46px] items-center justify-center rounded-xl border border-borderGray bg-white px-11"
          onPress={onVerifyCode}
          accessibilityRole="button"
          accessibilityLabel="인증번호 확인">
          <Text className="text-p text-gray">확인</Text>
        </TouchableOpacity>
      </View>

      {isCodeError ? (
        <Text className="mt-2 font-pretendardRegular text-p text-statusError">
          인증번호가 올바르지 않습니다.
        </Text>
      ) : null}
    </View>
  );
};

CodeSection.displayName = 'CodeSection';

export default CodeSection;
