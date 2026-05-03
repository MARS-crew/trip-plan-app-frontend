import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import { DateIcon, MainPlaneIcon, VectorGrayIcon } from '@/assets/icons';
import type { MainTripCardPlannedProps } from '@/types/home';

const MainTripCardPlanned: React.FC<MainTripCardPlannedProps> = ({ onOpenTripSchedule }) => {
  return (
    <Shadow
      distance={25}
      offset={[0, 0]}
      startColor="#00000020"
      endColor="#00000000"
      paintInside={false}
      containerStyle={{ width: '100%' }}
      style={{ borderRadius: 8, width: '100%' }}>
      <View className="bg-white rounded-lg overflow-hidden">
        <View className="h-32 relative">
          <Image source={require('@/assets/images/maintokyo.png')} className="w-full h-full" />
          <View className="absolute left-4 bottom-3">
            <View className="flex-row items-center">
              <MainPlaneIcon width={14} height={14} />
              <Text className="ml-[6px] text-white text-p">다가오는 여행</Text>
            </View>
            <Text className="text-white text-h1 font-pretendardBold mb-1">도쿄 여행</Text>
            <View className="flex-row items-center">
              <DateIcon width={12} height={12} />
              <Text className="ml-[6px] text-white text-p">3/23 - 3/28</Text>
            </View>
          </View>
        </View>

        <View className="px-4 py-4">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-gray text-p">5개의 일정이 계획되었어요</Text>
            <TouchableOpacity
              onPress={onOpenTripSchedule}
              className="px-3 py-2 border border-borderGray rounded-lg flex-row items-center">
              <Text className="text-black text-p mr-2">일정 보기</Text>
              <VectorGrayIcon width={16} height={16} />
            </TouchableOpacity>
          </View>

          <View>
            <View className="flex-row justify-between items-center mb-[6px]">
              <Text className="text-gray text-p">여행까지</Text>
              <Text className="text-gray text-p">14일 남음</Text>
            </View>
            <View className="h-[6px] bg-borderGray rounded-full overflow-hidden">
              <View className="h-[6px] w-[72%] bg-main rounded-full" />
            </View>
          </View>
        </View>
      </View>
    </Shadow>
  );
};

export default MainTripCardPlanned;
export { MainTripCardPlanned };
