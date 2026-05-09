import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ContentContainer } from '@/components/ui';
import { AirplaneIcon, PlusIcon } from '@/assets/icons';
import type { MainTripCardEmptyProps } from '@/types/home';

const MainTripCardEmpty: React.FC<MainTripCardEmptyProps> = ({ onAddTrip }) => {
  return (
    <ContentContainer className="px-[102px] py-8 items-center">
      <View className="items-center justify-center mb-4">
        <AirplaneIcon width={64} height={64} />
      </View>
      <Text className="text-h1 font-bold text-black mb-[6px]">여행을 계획해보세요</Text>
      <Text className="text-p1 text-gray text-center mb-5">
        새로운 여행지를 추가하고{'\n'}일정을 관리해보세요
      </Text>
      <TouchableOpacity
        onPress={onAddTrip}
        className="bg-main px-8 py-3 rounded-lg flex-row justify-center items-center">
        <PlusIcon width={16} height={16} />
        <Text className="text-h3 font-Medium text-white ml-2">여행 추가하기</Text>
      </TouchableOpacity>
    </ContentContainer>
  );
};

export default MainTripCardEmpty;
export { MainTripCardEmpty };
