import React from 'react';
import { View, Text } from 'react-native';

import { ContentContainer } from '@/components/ui';
import { AddressIcon, PlaceIcon, TimeIcon, VectorIcon } from '@/assets/icons';
import { getNearbyRecommendedPlaces } from '@/services';
import type { NearbyRecommendedPlace } from '@/types/place';

interface InfoTabContentProps {
  placeId: number;
}

export const InfoTabContent: React.FC<InfoTabContentProps> = ({ placeId }) => {
  const [recommendedPlaces, setRecommendedPlaces] = React.useState<NearbyRecommendedPlace[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!placeId || placeId <= 0 || !Number.isFinite(placeId)) {
      setIsLoading(false);
      setErrorMessage('유효하지 않은 장소 정보입니다.');
      return;
    }

    const controller = new AbortController();
    setIsLoading(true);
    setErrorMessage(null);

    const fetchRecommendedPlaces = async (): Promise<void> => {
      const { data, error } = await getNearbyRecommendedPlaces({
        placeId,
        signal: controller.signal,
      });

      if (controller.signal.aborted) {
        return;
      }

      if (error) {
        setRecommendedPlaces([]);
        setErrorMessage('주변 추천 장소를 불러오지 못했습니다.');
        setIsLoading(false);
        return;
      }

      setRecommendedPlaces(data);
      setIsLoading(false);
    };

    void fetchRecommendedPlaces();

    return () => {
      controller.abort();
    };
  }, [placeId]);

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

      {!isLoading && !errorMessage && recommendedPlaces.length > 0 ? (
        recommendedPlaces.map((place, index) => (
          <View
            key={place.placeId}
            className={`${index === 0 ? 'mt-3' : 'mt-2'} ${index === recommendedPlaces.length - 1 ? 'mb-[26px]' : ''}`}>
            <ContentContainer>
              <View className="flex-row items-center justify-between ml-4 my-3">
                <View className="flex-row items-center">
                  <View className="w-9 h-9 bg-chip rounded-lg items-center justify-center">
                    <PlaceIcon width={16} height={16} />
                  </View>
                  <View className="ml-3">
                    <Text className="text-p1 text-black font-pretendardMedium">{place.name}</Text>
                  </View>
                </View>
                <View className="mr-4">
                  <VectorIcon />
                </View>
              </View>
            </ContentContainer>
          </View>
        ))
      ) : (
        <View className="mt-3 mb-[26px]">
          <ContentContainer>
            <View className="ml-4 my-3">
              {isLoading ? (
                <Text className="text-p1 text-gray font-pretendardMedium">
                  추천 장소를 불러오는 중입니다.
                </Text>
              ) : errorMessage ? (
                <Text className="text-p1 text-statusError font-pretendardMedium">{errorMessage}</Text>
              ) : (
                <Text className="text-p1 text-gray font-pretendardMedium">
                  주변 추천 장소가 없습니다.
                </Text>
              )}
            </View>
          </ContentContainer>
        </View>
      )}
    </>
  );
};

InfoTabContent.displayName = 'InfoTabContent';

export default InfoTabContent;
