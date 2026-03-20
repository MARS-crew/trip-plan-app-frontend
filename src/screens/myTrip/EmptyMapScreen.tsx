import React from 'react';
import { Text, View } from 'react-native';

import { AirplaneIcon } from '@/assets/icons';

const EmptyMapScreen: React.FC = () => {
  return (
    <View className="items-center pt-[102px]">
      <View className="h-[80px] w-[80px] items-center justify-center">
        <AirplaneIcon />
      </View>

      <Text className="mt-3 text-h1 font-bold text-black">여행이 없어요</Text>
      <Text className="mt-1 text-p1 text-gray">여행을 추가하고 계획해보세요.</Text>
    </View>
  );
};

export default EmptyMapScreen;