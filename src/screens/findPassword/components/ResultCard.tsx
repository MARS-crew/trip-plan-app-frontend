import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

// ============ Types ============
export interface ResultCardProps {
  email: string;
  onPressLogin: () => void;
}

// ============ Component ============
export const ResultCard: React.FC<ResultCardProps> = ({
  email,
  onPressLogin,
}) => {
  return (
    <View className="mt-4 px-4 py-4 bg-main/10 rounded-lg">
      <Text className="text-p1 font-pretendardMedium text-black">
        임시 비밀번호가 <Text className="text-h3 font-pretendardSemiBold text-main">{email}</Text>로 전송되었습니다.
      </Text>
      <Text className="mt-1 text-p font-pretendardRegular text-gray">
        이메일이 도착하지 않으면 스팸 폴더를 확인해주세요.
      </Text>
      <TouchableOpacity
        className="mt-2"
        onPress={onPressLogin}
        accessibilityRole="button"
        accessibilityLabel="로그인하러 가기">
        <Text className="text-p font-pretendardRegular text-main">로그인하러 가기</Text>
      </TouchableOpacity>
    </View>
  );
};

ResultCard.displayName = 'ResultCard';

export default ResultCard;
