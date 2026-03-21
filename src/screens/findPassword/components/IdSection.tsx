import React from 'react';
import { View, Text, TextInput } from 'react-native';

import { COLORS } from '@/constants';

// ============ Types ============
export interface IdSectionProps {
  userId: string;
  onChangeUserId: (value: string) => void;
}

// ============ Component ============
export const IdSection: React.FC<IdSectionProps> = ({ userId, onChangeUserId }) => {
  return (
    <View className="mt-4">
      <Text className="text-h3 font-semibold text-black">
        아이디 <Text className="text-p1 text-statusError">*</Text>
      </Text>
      <TextInput
        className="w-full h-[46px] mt-2 px-3 bg-inputBackground rounded-xl border border-borderGray text-p1 font-Regular text-black"
        placeholder="아이디를 입력해주세요"
        placeholderTextColor={COLORS.gray}
        value={userId}
        onChangeText={onChangeUserId}
        autoCorrect={false}
        returnKeyType="next"
      />
    </View>
  );
};

IdSection.displayName = 'IdSection';

export default IdSection;
