import React from 'react';
import { Modal, TouchableOpacity, View, Text } from 'react-native';
import SecessionIcon from '@/assets/icons/secession.svg';

interface WithdrawWarningModalProps {
  visible: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

const WithdrawWarningModal: React.FC<WithdrawWarningModalProps> = ({
  visible,
  onConfirm,
  onClose,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 items-center justify-center bg-black/25 px-4">
        <View className="w-full rounded-xl bg-white px-4 pb-4 pt-4" style={{ maxWidth: 380 }}>
          <View className="items-center">
            <SecessionIcon width={24} height={24} />
            <Text className="mt-4 text-center font-pretendardSemiBold text-base leading-6 text-black">
              탈퇴시 여행 일정 및 리뷰가 사라지게{'\n'}
              되며 복구가 불가합니다.{'\n'}
              탈퇴 하시겠습니까?
            </Text>
          </View>

          <View className="mt-8 flex-row justify-between">
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={onConfirm}
              className="h-11 w-[48%] justify-center rounded-lg bg-chip">
              <Text className="text-center font-pretendardSemiBold text-sm text-gray">
                회원 탈퇴
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={onClose}
              className="h-11 w-[48%] justify-center rounded-lg bg-main">
              <Text className="text-center font-pretendardSemiBold text-sm text-white">취소</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

WithdrawWarningModal.displayName = 'WithdrawWarningModal';

export default WithdrawWarningModal;
export { WithdrawWarningModal };
