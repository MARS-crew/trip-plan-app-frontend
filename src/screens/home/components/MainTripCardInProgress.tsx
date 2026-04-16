import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import { TimeB, MarkerGrayIcon, RightArrow2Icon } from '@/assets/icons';
import type { MainTripCardInProgressProps } from '@/types/home';

const MainTripCardInProgress: React.FC<MainTripCardInProgressProps> = ({ onViewAllSchedule }) => {
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
              <View className="w-[10px] h-[10px] bg-greenstate rounded-full" style={{ transform: [{ translateY: 1 }] }} />
              <Text className="ml-[9px] text-white text-p">여행중</Text>
            </View>
            <Text className="text-white text-h1 font-pretendardBold">도쿄 여행</Text>
          </View>
        </View>

        <View className="px-4 py-4">
          <View className="flex-row items-center mb-3">
            <TimeB width={14} height={14} />
            <Text className="ml-[6px] text-gray text-p">다음 일정</Text>
          </View>

          <View className="bg-serve rounded-xl p-3 mb-[18px]">
            <View className="flex-row items-start">
              <View className="mr-[14px] items-center">
                <Text className="text-main text-h3 font-pretendardBold">09:00</Text>
                <Text className="text-gray text-p font-pretendardMedium">11:00</Text>
              </View>
              <View className="flex-1">
                <Text className="text-black text-p1 font-pretendardSemiBold mb-[2px]">아사쿠사 센소지</Text>
                <View className="flex-row items-center mb-1">
                  <MarkerGrayIcon width={12} height={12} />
                  <Text className="text-gray text-p ml-1">아사쿠사, 도쿄</Text>
                </View>
                <Text className="text-gray text-p">도쿄에서 가장 오래된 사원 방문</Text>
              </View>
            </View>
          </View>

          <View className="mb-8">
            <View className="flex-row items-center ml-2 mb-4">
              <Text className="text-gray text-p font-pretendardMedium mr-[22px]">12:00</Text>
              <View className="w-[6px] h-[6px] bg-borderGray rounded-full mr-3" />
              <Text className="text-gray text-p">츠키지 시장 점심</Text>
            </View>
            <View className="flex-row items-center ml-2">
              <Text className="text-gray text-p font-pretendardMedium mr-[22px]">14:30</Text>
              <View className="w-[6px] h-[6px] bg-borderGray rounded-full mr-3" />
              <Text className="text-gray text-p">시부야 스크램블 교차로</Text>
            </View>
          </View>

          <TouchableOpacity className="items-center" onPress={onViewAllSchedule}>
            <View className="flex-row items-center">
              <Text className="text-main text-p mr-2">전체 일정 보기</Text>
              <RightArrow2Icon width={16} height={16} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </Shadow>
  );
};

export default MainTripCardInProgress;
export { MainTripCardInProgress };
