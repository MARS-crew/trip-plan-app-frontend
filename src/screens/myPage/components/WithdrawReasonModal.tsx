import React from 'react';
import { Modal, TextInput, TouchableOpacity, View, Text } from 'react-native';
import SecessionIcon from '@/assets/icons/secession.svg';
import { COLORS } from '@/constants';

type WithdrawReason = 'access' | 'review' | 'recommend' | 'other';

interface WithdrawReasonItem {
  id: WithdrawReason;
  label: string;
}

const WITHDRAW_REASONS: WithdrawReasonItem[] = [
  { id: 'access', label: '앱에 잘 접속하지 않아요' },
  { id: 'review', label: '리뷰의 신뢰성이 떨어져요' },
  { id: 'recommend', label: '여행지 추천이 적당하지 않아요' },
  { id: 'other', label: '기타' },
];

interface WithdrawReasonModalProps {
  visible: boolean;
  onWithdraw: () => void;
  onBack: () => void;
  onClose: () => void;
}

const WithdrawReasonModal: React.FC<WithdrawReasonModalProps> = ({
  visible,
  onWithdraw,
  onBack,
  onClose,
}) => {
  const [selectedReason, setSelectedReason] = React.useState<WithdrawReason | null>(null);
  const [otherReason, setOtherReason] = React.useState<string>('');
  const isOtherReasonSelected = selectedReason === 'other';

  const handleSelectReason = React.useCallback((reason: WithdrawReason): void => {
    setSelectedReason(reason);
  }, []);

  const resetState = React.useCallback((): void => {
    setSelectedReason(null);
    setOtherReason('');
  }, []);

  const handleBack = React.useCallback((): void => {
    resetState();
    onBack();
  }, [resetState, onBack]);

  const handleClose = React.useCallback((): void => {
    resetState();
    onClose();
  }, [resetState, onClose]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <View className="flex-1 items-center justify-center bg-black/25 px-4">
        <View
          className="w-full rounded-xl bg-white px-6 pt-6 pb-5"
          style={{ maxWidth: 380 }}>
          <View>
            <SecessionIcon width={24} height={24} />
          </View>

          <Text className="mt-[15px] w-full font-pretendardSemiBold text-base text-black">
            회원 탈퇴를 원하시는 이유를 선택해주세요.
          </Text>
          <Text className="mt-1 w-full font-pretendardMedium text-sm leading-5 text-gray">
            서비스에 만족을 드리지 못해 죄송합니다.{'\n'}
            탈퇴 사유를 남겨주시면 서비스 개선에 더욱 힘쓰겠습니다.
          </Text>

          <View className="mt-4">
            {WITHDRAW_REASONS.map((reason) => {
              const isSelected = selectedReason === reason.id;
              return (
                <TouchableOpacity
                  key={reason.id}
                  activeOpacity={0.8}
                  onPress={() => handleSelectReason(reason.id)}
                  className="mb-2 flex-row items-center">
                  <View
                    className={`h-[17px] w-[17px] items-center justify-center rounded-full border ${
                      isSelected ? 'border-main' : 'border-chip'
                    }`}>
                    {isSelected ? (
                      <View className="h-[11px] w-[11px] rounded-full bg-main" />
                    ) : null}
                  </View>
                  <Text className="ml-3 font-pretendardMedium text-sm text-gray">
                    {reason.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {selectedReason === 'other' ? (
            <View className="mt-0.5 items-end">
              <TextInput
                value={otherReason}
                onChangeText={setOtherReason}
                placeholder="탈퇴 사유를 입력해주세요"
                placeholderTextColor={COLORS.gray}
                multiline
                textAlignVertical="top"
                className="h-32 w-[308px] rounded-xl border border-borderGray bg-inputBackground px-3 py-3 text-sm text-black"
              />
            </View>
          ) : null}

          <View
            className={`-mx-6 flex-row justify-between px-4 ${isOtherReasonSelected ? 'mt-6' : 'mt-4'}`}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={onWithdraw}
              className="w-[48%] rounded-lg bg-chip py-3">
              <Text className="text-center font-pretendardSemiBold text-sm text-gray">
                탈퇴 하기
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleBack}
              className="w-[48%] rounded-lg bg-main py-3">
              <Text className="text-center font-pretendardSemiBold text-sm text-white">이전</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

WithdrawReasonModal.displayName = 'WithdrawReasonModal';

export default WithdrawReasonModal;
export { WithdrawReasonModal };
