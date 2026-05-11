import React from 'react';
import { Modal, Pressable, Text, TextInput, TouchableOpacity, View } from 'react-native';

import type { EditTitleModalProps } from '@/types/tripDetail.types';

const EditTitleModal = ({
  visible,
  value,
  maxLength,
  isSubmitting = false,
  onChangeValue,
  onSubmit,
  onClose,
}: EditTitleModalProps) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable className="flex-1 items-center justify-center bg-black/25 px-4" onPress={onClose}>
        <Pressable className="w-full max-w-[380px] rounded-xl bg-white p-4" onPress={() => {}}>
          <Text className="mb-3 font-pretendardSemiBold text-h2 text-black">여행 제목 변경</Text>
          <TextInput
            value={value}
            onChangeText={onChangeValue}
            maxLength={maxLength}
            autoFocus
            returnKeyType="done"
            onSubmitEditing={onSubmit}
            placeholder="여행명을 입력하세요"
            className="rounded-lg border border-borderGray px-3 py-2 text-p1 text-black"
          />
          <View className="mt-4 flex-row justify-end">
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={onClose}
              className="mr-1 rounded-lg bg-chip px-4 py-2">
              <Text className="text-p1 text-gray">취소</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.85}
              disabled={isSubmitting}
              onPress={onSubmit}
              className="rounded-lg bg-main px-4 py-2">
              <Text className="text-p1 text-white">저장</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

EditTitleModal.displayName = 'EditTitleModal';

export default EditTitleModal;
export { EditTitleModal };
