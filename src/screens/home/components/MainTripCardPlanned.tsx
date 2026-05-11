import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import { DateIcon, MainPlaneIcon, VectorGrayIcon } from '@/assets/icons';
import type { MainTripCardPlannedViewProps } from '@/types/home';

const MainTripCardPlanned: React.FC<MainTripCardPlannedViewProps> = ({
  onOpenTripSchedule,
  tripTitle,
  startDate,
  endDate,
  scheduleCount,
  daysUntilTrip,
  progressRate,
}) => {
  const progressPercent = React.useMemo(() => {
    if (progressRate === undefined || progressRate === null) return 0;
    return Math.max(0, Math.min(100, progressRate));
  }, [progressRate]);

  const daysText = React.useMemo(() => {
    if (daysUntilTrip === undefined || daysUntilTrip === null) return '정보없음';
    return `${daysUntilTrip}일 남음`;
  }, [daysUntilTrip]);
  const fmtDate = (iso?: string) => {
    if (!iso) return '';
    try {
      const d = new Date(iso);
      return `${d.getMonth() + 1}/${d.getDate()}`;
    } catch {
      return iso;
    }
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
              <MainPlaneIcon width={14} height={14} />
              <Text className="ml-[6px] text-p text-white">다가오는 여행</Text>
            </View>
            <Text className="mb-1 font-pretendardBold text-h1 text-white">
              {tripTitle ?? '도쿄 여행'}
            </Text>
            <View className="flex-row items-center">
              <DateIcon width={12} height={12} />
              <Text className="ml-[6px] text-p text-white">
                {fmtDate(startDate)}
                {startDate && endDate ? ` - ${fmtDate(endDate)}` : ''}
              </Text>
            </View>
          </View>
        </View>

        <View className="px-4 py-4">
          <View className="mb-3 flex-row items-center justify-between">
            <Text className="text-p text-gray">
              {`${scheduleCount ?? 0}개의 일정이 계획되었어요`}
            </Text>
            <TouchableOpacity
              onPress={onOpenTripSchedule}
              className="flex-row items-center rounded-lg border border-borderGray px-3 py-2">
              <Text className="mr-2 text-p text-black">일정 보기</Text>
              <VectorGrayIcon width={16} height={16} />
            </TouchableOpacity>
          </View>

          <View>
            <View className="mb-[6px] flex-row items-center justify-between">
              <Text className="text-p text-gray">여행까지</Text>
              <Text className="text-p text-gray">{daysText}</Text>
            </View>
            <View className="h-[6px] overflow-hidden rounded-full bg-borderGray">
              <View
                className="h-[6px] rounded-full bg-main"
                style={{ width: `${progressPercent}%` }}
              />
            </View>
          </View>
        </View>
      </View>
    </Shadow>
  );
};

export default MainTripCardPlanned;
export { MainTripCardPlanned };
