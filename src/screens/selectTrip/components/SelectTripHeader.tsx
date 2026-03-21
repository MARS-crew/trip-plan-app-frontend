import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { BackArrow } from '@/assets/icons';

export interface SelectTripHeaderProps {
  onPress: () => void;
}

export const SelectTripHeader: React.FC<SelectTripHeaderProps> = ({ onPress }) => {
  return (
    <View className="flex-row items-center px-6 pt-3 pb-2">
      <Pressable
        onPress={onPress}
        className="items-center justify-center"
        accessibilityRole="button"
        accessibilityLabel="뒤로가기"
      >
        <BackArrow accessibilityLabel="뒤로가기" />
      </Pressable>
      <View className="ml-5">
        <Text className="text-h font-bold text-black">추가할 여행 선택</Text>
        <Text className="text-p text-gray font-regular">2개의 여행이 있어요</Text>
      </View>
    </View>
  );
};
