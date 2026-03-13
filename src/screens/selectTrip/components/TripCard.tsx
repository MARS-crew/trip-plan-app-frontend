import React, { useCallback } from 'react';
import { View, Text, Image, TouchableOpacity, Animated, type NativeSyntheticEvent, type NativeScrollEvent } from 'react-native';
import { Shadow } from 'react-native-shadow-2';

import { ScheduleIcon, MarkerGrayIcon } from '@/assets/icons';
import { COLORS } from '@/constants';
import { TripStatusChip } from '@/components/ui';
import { DateSelector, type DateItem } from './DateSelector';

// ============ Types ============
interface TripCardProps {
  index: number;
  isExpanded: boolean;
  status?: 'traveling' | 'planned' | 'completed';
  destination: string;
  thumbnailSource: any;
  startDate: string;
  endDate: string;
  scheduleCount: number;
  duration: number;
  dates: DateItem[];
  selectedDateIndex: number | null;
  scrollPosition: number;
  animatedHeight: Animated.Value;
  animatedOpacity: Animated.Value;
  onCardPress: () => void;
  onDatePress: (dateIndex: number) => void;
  onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
}

// ============ Component ============
const TripCard: React.FC<TripCardProps> = ({
  isExpanded,
  status,
  destination,
  thumbnailSource,
  startDate,
  endDate,
  scheduleCount,
  duration,
  dates,
  selectedDateIndex,
  scrollPosition,
  animatedHeight,
  animatedOpacity,
  onCardPress,
  onDatePress,
  onScroll,
}) => {
  return (
    <View className="mr-4">
      <View className="bg-white overflow-hidden rounded-t-lg">
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={onCardPress}>
          {/* 이미지 영역 */}
          <View className="overflow-hidden relative rounded-t-lg">
            <Image
              source={thumbnailSource}
              className="w-full"
              resizeMode="cover"
            />
            
            {/* 여행 상태 칩 */}
            {status && (
              <View className="absolute top-[13px] left-[15px]">
                <TripStatusChip status={status} />
              </View>
            )}
            
            {/* 여행지 + 스케줄 아이콘 + 일정 + 날짜 */}
            <View className="absolute bottom-[14px] left-3">
              {/* 도쿄 텍스트 */}
              <Text className="text-h1 text-white font-bold mb-1">{destination}</Text>
              
              {/* 스케줄 아이콘 + 일정 + 날짜 */}
              <View className="flex-row items-center">
                <ScheduleIcon width={12} height={12} />
                <Text className="text-p text-white font-regular ml-1">일정</Text>
                <Text className="text-p text-white font-regular ml-[2px]">{startDate} ~ {endDate}</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
      
      <Shadow
        distance={2}
        startColor={COLORS.shadowStart}
        endColor={COLORS.shadowEnd}
        offset={[0, 0]}
        paintInside={false}
        containerStyle={{ width: '100%', alignSelf: 'stretch' }}
        style={{
          borderRadius: 8,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          borderBottomLeftRadius: 8,
          borderBottomRightRadius: 8,
          width: '100%',
        }}>
        <View className="bg-white overflow-hidden rounded-b-lg">
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={onCardPress}>
            {/* 정보 영역 */}
            <View className={`${isExpanded ? 'border-b border-chip' : 'rounded-b-lg'}`}>
              <View className="p-4 flex-row items-center">
                {/* 마커 아이콘 + 일정 개수 + 기간 */}
                <MarkerGrayIcon />
                <Text className="text-p text-gray font-regular ml-1">{scheduleCount}개의 일정</Text>
                <Text className="text-p text-gray font-regular ml-3">{duration}일간</Text>
              </View>
            </View>
          </TouchableOpacity>
        
          {/* 날짜 선택 영역 */}
          <DateSelector
            dates={dates}
            selectedDateIndex={selectedDateIndex}
            scrollPosition={scrollPosition}
            animatedHeight={animatedHeight}
            animatedOpacity={animatedOpacity}
            onDatePress={onDatePress}
            onScroll={onScroll}
          />
        </View>
      </Shadow>
    </View>
  );
};

TripCard.displayName = 'TripCard';

export default TripCard;
export { TripCard };
export type { TripCardProps };
