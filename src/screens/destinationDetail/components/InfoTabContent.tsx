import React from 'react';
import { View, Text } from 'react-native';

import { ContentContainer } from '@/components/ui';
import { AddressIcon, PlaceIcon, TimeIcon, VectorIcon } from '@/assets/icons';

const RECOMMENDED_PLACES = ['도쿄 스카이트리', '우에노 공원', '아메요코 시장'];

export const InfoTabContent: React.FC = () => {
  return (
    <>
      <ContentContainer className="p-4">
        <Text className="text-h3 font-pretendardSemiBold mb-2">소개</Text>
        <Text className="text-p text-gray font-pretendardMedium">
          도쿄에서 가장 오래된 불교 사원으로, 웅장한 카미나리몬과 나카미세 거리가 유명합니다.
        </Text>
      </ContentContainer>

      <View className="mt-5">
        <ContentContainer className="w-[181px]">
          <View className="flex-row items-center ml-4 mr-[44px] mt-[14px] mb-[14px]">
            <View className="w-9 h-9 bg-contentBackground rounded-lg items-center justify-center">
              <TimeIcon />
            </View>
            <View className="ml-[13px]">
              <Text className="text-p text-gray">영업시간</Text>
              <View className="mt-1">
                <Text className="text-p text-black">06:00 - 17:00</Text>
              </View>
            </View>
          </View>
        </ContentContainer>
      </View>

      <View className="mt-5">
        <ContentContainer>
          <View className="flex-row items-center ml-4 mt-[14px] mb-[14px]">
            <View className="w-9 h-9 bg-contentBackground rounded-lg items-center justify-center">
              <AddressIcon />
            </View>
            <View className="ml-[13px]">
              <Text className="text-p text-gray">주소</Text>
              <View className="mt-1">
                <Text className="text-p text-black">2 Chrome-3-1 Asakusa, Taito City, Tokyo</Text>
              </View>
            </View>
          </View>
        </ContentContainer>
      </View>

      <View className="mt-5">
        <Text className="text-h3 text-black font-pretendardSemiBold">주변 추천 장소</Text>
      </View>

      {RECOMMENDED_PLACES.map((placeName, index) => (
        <View
          key={placeName}
          className={`${index === 0 ? 'mt-3' : 'mt-2'} ${index === RECOMMENDED_PLACES.length - 1 ? 'mb-[26px]' : ''}`}>
          <ContentContainer>
            <View className="flex-row items-center justify-between ml-4 my-3">
              <View className="flex-row items-center">
                <View className="w-9 h-9 bg-chip rounded-lg items-center justify-center">
                  <PlaceIcon width={16} height={16} />
                </View>
                <View className="ml-3">
                  <Text className="text-p1 text-black font-pretendardMedium">{placeName}</Text>
                </View>
              </View>
              <View className="mr-4">
                <VectorIcon />
              </View>
            </View>
          </ContentContainer>
        </View>
      ))}
    </>
  );
};

InfoTabContent.displayName = 'InfoTabContent';

export default InfoTabContent;
