import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import SecessionIcon from '@/assets/icons/secession.svg';
import type { WithdrawSectionProps } from '@/screens/myPage/types/myPage.types';

const WithdrawSection: React.FC<WithdrawSectionProps> = ({ onPressWithdraw }) => {
  return (
    <View className="mt-6 rounded-lg border border-withdrawDanger bg-withdrawBg px-4 py-4">
      <View className="flex-row items-center">
        <SecessionIcon width={20} height={20} />
        <Text className="ml-2 font-pretendardSemiBold text-h2 text-statusError">회원 탈퇴</Text>
      </View>

      <Text className="mt-4 font-pretendardMedium text-p1 text-gray">
        계정을 삭제하면 모든 여행 기록, 저장된 장소, 개인 설정이 영구적으로 삭제됩니다. 이 작업은
        되돌릴 수 없습니다
      </Text>

      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onPressWithdraw}
        className="mt-4 rounded-lg bg-statusError py-3">
        <Text className="text-center font-pretendardSemiBold text-h3 text-white">회원 탈퇴</Text>
      </TouchableOpacity>
    </View>
  );
};

WithdrawSection.displayName = 'WithdrawSection';

export default WithdrawSection;
