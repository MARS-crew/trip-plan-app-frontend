import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import { TimeB, MarkerGrayIcon, RightArrow2Icon } from '@/assets/icons';
import type { MainTripCardInProgressViewProps } from '@/types/home';
import type { TripScheduleItem } from '@/types/myTrip.types';

const MainTripCardInProgress: React.FC<MainTripCardInProgressViewProps> = ({
  onViewAllSchedule,
  tripTitle,
  nextSchedules,
}) => {
  const scheduledItems = nextSchedules ?? [];
  const next = scheduledItems[0];

  const formatTime = (time?: string): string => {
    if (!time) return '--:--';
    return time.length >= 5 ? time.slice(0, 5) : time;
  };

  const resolveLocation = (item: TripScheduleItem): string => {
    const locationParts = [item.placeName, item.address].filter((value) =>
      Boolean(value && value.trim()),
    );
    return locationParts.length > 0 ? locationParts.join(' · ') : '장소 정보 없음';
  };
  return (
    <Shadow
      distance={25}
      offset={[0, 0]}
      startColor="#00000020"
      endColor="#00000000"
      paintInside={false}
      containerStyle={{ width: '100%' }}
      style={{ borderRadius: 8, width: '100%' }}>
      <View className="overflow-hidden rounded-lg bg-white">
        <View className="relative h-32">
          <Image source={require('@/assets/images/maintokyo.png')} className="h-full w-full" />
          <View className="absolute bottom-3 left-4">
            <View className="flex-row items-center">
              <View
                className="h-[10px] w-[10px] rounded-full bg-greenstate"
                style={{ transform: [{ translateY: 1 }] }}
              />
              <Text className="ml-[9px] text-p text-white">여행중</Text>
            </View>
            <Text className="font-pretendardBold text-h1 text-white">
              {tripTitle ?? '도쿄 여행'}
            </Text>
          </View>
        </View>

        <View className="px-4 py-4">
          <View className="mb-3 flex-row items-center">
            <TimeB width={14} height={14} />
            <Text className="ml-[6px] text-p text-gray">다음 일정</Text>
          </View>

          {next ? (
            <View className="mb-[18px] rounded-xl bg-serve p-3">
              <View className="flex-row items-start">
                <View className="mr-[14px] items-center">
                  <Text className="font-pretendardBold text-h3 text-main">
                    {formatTime(next.startTime)}
                  </Text>
                  <Text className="font-pretendardMedium text-p text-gray">
                    {formatTime(next.endTime)}
                  </Text>
                </View>
                <View className="flex-1">
                  <Text className="mb-[2px] font-pretendardSemiBold text-p1 text-black" numberOfLines={1} ellipsizeMode="tail">
                    {next.title}
                  </Text>
                  <View className="mb-1 flex-row items-center">
                    <MarkerGrayIcon width={12} height={12} />
                    <Text className="ml-1 flex-1 text-p text-gray" numberOfLines={1} ellipsizeMode="tail">{resolveLocation(next)}</Text>
                  </View>
                  {!!next.memo?.trim() && <Text className="text-p text-gray" numberOfLines={1} ellipsizeMode="tail">{next.memo}</Text>}
                </View>
              </View>
            </View>
          ) : (
            <View className="mb-[18px] items-center p-3">
              <Text className="text-p text-gray">저장된 다음 일정이 없습니다.</Text>
            </View>
          )}

          {scheduledItems.length > 1 && (
            <View className="mb-8">
              {scheduledItems.slice(1).map((item) => (
                <View key={item.tripScheduleId} className="mb-4 ml-2 flex-row items-center">
                  <Text className="mr-[22px] font-pretendardMedium text-p text-gray">
                    {formatTime(item.startTime)}
                  </Text>
                  <View className="mr-3 h-[6px] w-[6px] rounded-full bg-borderGray" />
                  <View className="flex-1">
                    <Text className="text-p text-gray" numberOfLines={1} ellipsizeMode="tail">{item.title}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          <TouchableOpacity className="items-center" onPress={onViewAllSchedule}>
            <View className="flex-row items-center">
              <Text className="mr-2 text-p text-main">전체 일정 보기</Text>
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
