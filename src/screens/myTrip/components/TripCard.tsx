import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';

import { TripStatusChip } from '@/components/ui';
import {
  PlaceIcon,
  CalendarWhiteIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@/assets/icons';

export interface TripCardProps {
  city: string;
  dateText: string;
  scheduleText: string;
  scheduleCountText: string;
  imageSource: any;
  status: 'traveling' | 'scheduled' | 'completed';
  isOpen: boolean;
  onToggle: () => void;
  onImagePress?: () => void;
  children?: React.ReactNode;
}

const TripCard = ({
  city,
  dateText,
  scheduleCountText,
  scheduleText,
  imageSource,
  status,
  isOpen,
  onToggle,
  onImagePress,
  children,
}: TripCardProps) => {

  return (
    <View
      className="mt-6 rounded-[8px] bg-white"
      style={{
        shadowColor: 'rgba(0, 0, 0, 0.25)',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 3,
        elevation: 3,
      }}
    >
      <View className="overflow-hidden rounded-[8px]">
        <Pressable onPress={onImagePress}>
          <View className="relative">
            <Image source={imageSource} className="h-[144px] w-full" resizeMode="cover" />

            <View pointerEvents="none"/>

          {/*TripStatusChip*/}
            <View className="absolute top-[13px] left-[15px]">
              <TripStatusChip status={status} />
            </View>

          {/*City*/}
            <View className="absolute bottom-3 left-3">
              <Text className="text-h1 font-pretendardBold text-white">{city}</Text>

          {/*Date*/}
              <View className="flex-row items-center">
                <CalendarWhiteIcon width={14} height={14}/>
                <Text className="px-1 text-p1 text-white">{dateText}</Text>
              </View>
            </View>
          </View>
        </Pressable>

        {/*schedule*/}
        <Pressable onPress={onToggle}>
          <View className="flex-row items-center justify-between px-4 py-3">
            <View className="flex-row items-center">
              <PlaceIcon width={14} height={14} />
              <Text className="ml-1 text-p text-gray">{scheduleText}개의 일정</Text>
              <Text className="ml-3 text-p text-gray">{scheduleCountText}일간</Text>
            </View>

            {/*Toggle*/}
            <View className="flex-row items-center">
              <Text className="text-p text-main">
                {isOpen ? '일정 접기 ' : '전체 보기 '}
              </Text>

              {isOpen ? (
                <ChevronUpIcon width={14} height={14} />
              ) : (
                <ChevronDownIcon width={14} height={14} />
              )}
            </View>
          </View>
        </Pressable>

        {isOpen && <View className="border-t border-chip px-4 py-4">{children}</View>}
      </View>
    </View>
  );
};

export default TripCard;
