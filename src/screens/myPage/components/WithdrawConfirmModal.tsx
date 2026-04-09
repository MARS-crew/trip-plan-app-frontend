import React from 'react';
import { Modal, TouchableOpacity, View, Text } from 'react-native';
import SecessionIcon from '@/assets/icons/secession.svg';

interface WithdrawConfirmModalProps {
  visible: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

const WithdrawConfirmModal: React.FC<WithdrawConfirmModalProps> = ({
  visible,
  onConfirm,
  onClose,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 items-center justify-center bg-black/25 px-4">
        <View className="w-full rounded-xl bg-white px-4 pb-4 pt-5" style={{ maxWidth: 380 }}>
          <View className="items-center">
            <SecessionIcon width={24} height={24} />
            <Text className="mt-4 text-left font-pretendardSemiBold text-h2 text-black">
              서비스에서 탈퇴하시겠습니까?
            </Text>
          </View>

          <View className="mt-9 flex-row justify-between">
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={onConfirm}
              className="w-[48%] rounded-lg bg-chip py-3">
              <Text className="text-center font-pretendardSemiBold text-h3 text-sm text-gray">
                예
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={onClose}
              className="w-[48%] rounded-lg bg-main py-3">
              <Text className="text-center font-pretendardSemiBold text-h3 text-sm text-white">
                취소
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

WithdrawConfirmModal.displayName = 'WithdrawConfirmModal';

export default WithdrawConfirmModal;
export { WithdrawConfirmModal };
