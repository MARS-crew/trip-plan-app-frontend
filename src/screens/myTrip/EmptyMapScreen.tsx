import React from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AirplaneIcon } from '@/assets/icons';

const EmptyMapScreen: React.FC = () => {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <View className="flex-1 items-center bg-screenBackground pt-[102px]">
        <View className="h-[80px] w-[80px] items-center justify-center">
          <AirplaneIcon />
        </View>
        <Text className="mt-3 font-pretendardSemiBold text-h2 text-black">여행이 없어요</Text>
        <Text className="mt-1 text-p1 text-gray">여행을 추가하고 계획해보세요.</Text>
      </View>
    </SafeAreaView>
  );
};

export default EmptyMapScreen;
