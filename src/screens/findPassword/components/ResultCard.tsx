import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import type { FindPasswordResultCardProps } from '@/types/findPasswordResultCard';

// ============ Component ============
export const ResultCard: React.FC<FindPasswordResultCardProps> = ({ email, onPressLogin }) => {
  return (
    <View className="mt-4 rounded-lg bg-main/10 px-4 py-4">
      <Text className="font-pretendardMedium text-p1 text-black">
        임시 비밀번호가 <Text className="font-pretendardSemiBold text-h3 text-main">{email}</Text>로
        전송되었습니다.
      </Text>
      <Text className="mt-1 font-pretendardRegular text-p text-gray">
        이메일이 도착하지 않으면 스팸 폴더를 확인해주세요.
      </Text>
      <TouchableOpacity
        className="mt-2"
        onPress={onPressLogin}
        accessibilityRole="button"
        accessibilityLabel="로그인하러 가기">
        <Text className="font-pretendardRegular text-p text-main">로그인하러 가기</Text>
      </TouchableOpacity>
    </View>
  );
};

ResultCard.displayName = 'ResultCard';

export default ResultCard;
